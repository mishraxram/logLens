// POST /api/analyze  -> asks an AI model for an investigation summary.
// Two providers run at the same time: Gemini (secret GEMINI_API_KEY) and Cloudflare Workers AI
// (binding AI, v2 Worker only). The first valid answer inside 8s wins; keys stay on the server.
import { investigationPrompt, type AiEvent } from '../../src/lib/prompts.ts';

type WorkersAi = { run: (model: string, input: object) => Promise<any> };
type Env = { GEMINI_API_KEY?: string; GEMINI_MODEL?: string; AI?: WorkersAi };

const MAX_EVENTS = 200;
const TIMEOUT_MS = 8000;
// Tried in order; Gemini models are sometimes busy, so we keep backups
const MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
// Workers AI models with JSON mode (listed in the Workers AI JSON mode docs).
// The big one writes better summaries; the small fast one is a backup (see step 2 below).
const CF_BIG = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const CF_FAST = '@cf/meta/llama-3.1-8b-instruct-fast';
const BACKUP_GRACE_MS = 1500;

// Check one AI reply and clean it. Throws (with a readable message) if it cannot be used.
function clean(ai: any, events: AiEvent[], lang: string) {
  if (!ai || typeof ai !== 'object' || typeof ai.summary !== 'string') throw new Error('AI reply could not be read');
  // Hindi asked but no Devanagari in the reply: do not show English instead
  if (lang === 'hi' && !/[ऀ-ॿ]/.test(ai.summary)) throw new Error('AI replied in the wrong language');
  if (!['incident', 'suspicious', 'normal', 'unsure'].includes(ai.verdict)) ai.verdict = 'unsure';
  if (!['low', 'medium', 'high'].includes(ai.confidence)) ai.confidence = 'low';
  if (!Array.isArray(ai.next_steps)) ai.next_steps = [];
  // Keep only indicators that cite real event numbers (guards against made-up events)
  const valid = new Set(events.map((e) => e.n));
  const cited = (list: any) => (Array.isArray(list) ? list : []).filter(
    (i: any) => Array.isArray(i.events) && i.events.length && i.events.every((n: number) => valid.has(n)),
  );
  ai.indicators = cited(ai.indicators);
  ai.hidden_patterns = cited(ai.hidden_patterns).slice(0, 3);
  return ai;
}

// Gemini: try each model in turn until one gives a usable answer or time runs out
async function gemini(key: string, models: string[], prompt: string, events: AiEvent[], lang: string, deadline: number) {
  let lastError = 'AI unavailable';
  for (const model of models) {
    const left = deadline - Date.now();
    if (left < 500) { lastError = 'AI took longer than 8s'; break; }
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(left),
      });
      if (!res.ok) { lastError = `AI error ${res.status}`; continue; }
      const data: any = await res.json();
      return { model, ...clean(JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''), events, lang) };
    } catch (err) {
      lastError = err instanceof Error && err.name === 'TimeoutError' ? 'AI took longer than 8s'
        : err instanceof Error && err.message.startsWith('AI ') ? err.message : 'AI reply could not be read';
    }
  }
  throw new Error(lastError);
}

// Workers AI: one call per model, stopped at the same deadline
async function workersAi(ai: WorkersAi, model: string, prompt: string, events: AiEvent[], lang: string, deadline: number) {
  const call = ai.run(model, {
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 900,
  });
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('AI took longer than 8s')), deadline - Date.now()));
  const out: any = await Promise.race([call, timeout]);
  const reply = typeof out?.response === 'string' ? JSON.parse(out.response) : out?.response;
  return { model, ...clean(reply, events, lang) };
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // 1. Read and validate input
  let body: { events?: AiEvent[]; notes?: string[]; lang?: string };
  try { body = await request.json(); } catch { return Response.json({ error: 'Bad JSON' }, { status: 400 }); }
  // Keep only known fields, as short strings (limits prompt size and junk input)
  const s = (x: unknown, max = 200) => String(x ?? '').slice(0, max);
  const events: AiEvent[] = (Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS) : []).map((e: any) => ({
    n: Number(e.n) || 0, timeText: s(e.timeText, 25), user: s(e.user, 60), role: s(e.role, 20), ip: s(e.ip, 45),
    action: s(e.action, 30), target: s(e.target, 100), detail: s(e.detail), flags: (Array.isArray(e.flags) ? e.flags : []).map((f: unknown) => s(f)).slice(0, 6),
  }));
  if (!events.length) return Response.json({ error: 'No events to analyze' }, { status: 400 });
  const notes = (Array.isArray(body.notes) ? body.notes : []).map((n) => String(n).slice(0, 500)).slice(0, 5);
  const lang = body.lang === 'hi' ? 'hi' : 'en';
  if (!env.GEMINI_API_KEY && !env.AI) return Response.json({ error: 'AI not configured' }, { status: 503 });

  // 2. Start all providers at once. Whole thing must finish in 8s.
  //    Gemini and the big Workers AI model are preferred. The small fast model is only a backup:
  //    its answer is used if nothing better arrived by 1.5s before the deadline (it over-calls "incident").
  const deadline = Date.now() + TIMEOUT_MS;
  const prompt = investigationPrompt(events, notes, lang);
  const better: Promise<any>[] = [];
  if (env.GEMINI_API_KEY) better.push(gemini(env.GEMINI_API_KEY, env.GEMINI_MODEL ? [env.GEMINI_MODEL] : MODELS, prompt, events, lang, deadline));
  if (env.AI) better.push(workersAi(env.AI, CF_BIG, prompt, events, lang, deadline));
  const best = Promise.any(better);
  const tries: Promise<any>[] = [best];
  if (env.AI) {
    const fast = workersAi(env.AI, CF_FAST, prompt, events, lang, deadline);
    tries.push(fast.then(async (r) => {
      const wait = new Promise((ok) => setTimeout(ok, Math.max(0, deadline - BACKUP_GRACE_MS - Date.now())));
      await Promise.race([wait, best.catch(() => {})]);
      return r;
    }));
  }
  try {
    const ai = await Promise.any(tries);
    return Response.json({ source: 'ai', sent: events.length, ...ai });
  } catch (err) {
    // All providers failed: report the first reason (the page then shows the offline rule-based result)
    let first: unknown = err;
    while (first instanceof AggregateError) first = first.errors[0]; // "best" is itself a Promise.any
    return Response.json({ error: first instanceof Error ? first.message : 'AI unavailable' }, { status: 504 });
  }
};
