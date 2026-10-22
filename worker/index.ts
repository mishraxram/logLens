// v2 entry point: one Cloudflare Worker serves the static Astro build and the /api routes.
// The API handlers are the same files v1 uses on Pages, so both versions share one tested code path.
import { onRequestPost as analyze } from '../functions/api/analyze.ts';
import { onRequestGet as health } from '../functions/api/health.ts';

type RateLimiter = { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
type Env = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  AI_LIMITER?: RateLimiter; // Cloudflare rate limit binding (wrangler.jsonc "ratelimits")
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  AI?: { run: (model: string, input: object) => Promise<any> }; // Workers AI binding (wrangler.jsonc "ai")
};

const MAX_BODY_BYTES = 256 * 1024; // 200 events of short fields fit easily in this
const LOCAL_LIMIT = 20; // per IP per minute, counted inside this server instance
const hits = new Map<string, { count: number; start: number }>();

// Simple per-instance counter. Each Cloudflare server keeps its own count, so this is best effort.
function localAllowed(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.start > 60_000) { hits.set(ip, { count: 1, start: now }); return true; }
  hits.set(ip, { count: h.count + 1, start: h.start });
  return h.count + 1 <= LOCAL_LIMIT;
}

// Two layers: the local counter (catches a fast burst at once) and the Cloudflare binding
// (shared across instances, but its docs say it is "permissive, eventually consistent").
async function allowed(env: Env, ip: string): Promise<boolean> {
  if (!localAllowed(ip)) return false;
  return env.AI_LIMITER ? (await env.AI_LIMITER.limit({ key: ip })).success : true;
}

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!(await allowed(env, ip))) {
    return Response.json({ error: 'Too many requests, try again in a minute' }, { status: 429, headers: { 'retry-after': '60' } });
  }
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return Response.json({ error: 'Send JSON' }, { status: 415 });
  }
  // Read the body ourselves so a huge upload is refused before it is parsed
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return Response.json({ error: 'Request too large' }, { status: 413 });
  return analyze({ request: new Request(request.url, { method: 'POST', headers: request.headers, body: text }), env });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/api/analyze' && request.method === 'POST') return await handleAnalyze(request, env);
      if (pathname === '/api/health' && request.method === 'GET') return health();
      if (pathname.startsWith('/api/')) return Response.json({ error: 'Not found' }, { status: 404 });
    } catch {
      // Never leak a stack trace; the page shows the offline rule-based result instead
      return Response.json({ error: 'Server error' }, { status: 500 });
    }
    // Everything else is a static file from dist/ (404.html if nothing matches)
    return env.ASSETS.fetch(request);
  },
};
