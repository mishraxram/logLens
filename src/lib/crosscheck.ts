// AI vs rules cross-check: shows where the AI and the rules agree and disagree, instead of trusting either one.
import type { LogEvent } from './parse.ts';

type AiLike = { verdict: string; indicators: { events: number[] }[]; hidden_patterns?: { events: number[] }[] };
export type CrossCheck = {
  agree: boolean;          // verdicts point the same way
  ruleLevel: 'high' | 'medium' | 'none';
  cited: number[];         // flagged events the AI also cited
  missed: number[];        // high-risk flagged events the AI did not cite
  aiOnly: number[];        // events the AI cited that no rule flagged
  note: string;            // one plain sentence for the investigator
};

export function crossCheck(events: LogEvent[], ai: AiLike): CrossCheck {
  const high = events.filter((e) => e.flags.some((f) => f.severity === 'high')).map((e) => e.n);
  const flagged = new Set(events.filter((e) => e.flags.length).map((e) => e.n));
  const ruleLevel = high.length ? 'high' : flagged.size ? 'medium' : 'none';
  const aiEvents = new Set([...ai.indicators, ...(ai.hidden_patterns ?? [])].flatMap((i) => i.events));
  const cited = [...flagged].filter((n) => aiEvents.has(n)).sort((a, b) => a - b);
  const missed = high.filter((n) => !aiEvents.has(n));
  const aiOnly = [...aiEvents].filter((n) => !flagged.has(n)).sort((a, b) => a - b);
  // Agreement: rules high <-> AI incident/suspicious; rules none <-> AI normal/unsure; medium agrees with anything but "normal"
  const agree = ruleLevel === 'high' ? ['incident', 'suspicious'].includes(ai.verdict)
    : ruleLevel === 'none' ? ['normal', 'unsure'].includes(ai.verdict)
    : ai.verdict !== 'normal';
  const note = agree
    ? `AI and rules agree (rules: ${ruleLevel} risk, AI: ${ai.verdict}).`
    : `AI and rules DISAGREE (rules: ${ruleLevel} risk, AI: ${ai.verdict}). Check the cited events yourself before acting.`;
  return { agree, ruleLevel, cited, missed, aiOnly, note };
}
