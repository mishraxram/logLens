#!/usr/bin/env bash
# Master command: one-time setup (key, Cloudflare login, team) + starts the LOOP.md upgrade loop.
# Run from anywhere:  bash ~/Projects/logLens/win.sh
# Safe to run again: steps that are already done are skipped.
set -uo pipefail
cd "$(dirname "$0")" || exit 1

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

# 1. Branch + dependencies
say "1/5 Branch and packages"
[ "$(git branch --show-current)" = "avinya-final" ] || git switch avinya-final || exit 1
[ -d node_modules ] || npm ci || exit 1

# 2. Gemini key -> .env and .dev.vars (git-ignored). Typing is hidden; Enter skips.
say "2/5 Gemini API key"
key=$(grep -s '^GEMINI_API_KEY=' .env | cut -d= -f2-)
if [ -z "$key" ]; then
  echo "Get one at https://aistudio.google.com/apikey"
  read -rsp "Paste GEMINI_API_KEY (hidden, Enter to skip): " key; echo
fi
if [ -n "$key" ]; then
  for f in .env .dev.vars; do
    touch "$f"; grep -v '^GEMINI_API_KEY=' "$f" > "$f.tmp"; mv "$f.tmp" "$f"
    printf 'GEMINI_API_KEY=%s\n' "$key" >> "$f"
  done
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "x-goog-api-key: $key" \
    https://generativelanguage.googleapis.com/v1beta/models)
  [ "$code" = 200 ] && echo "Key works." || echo "WARNING: Google answered HTTP $code. Check the key."
else
  echo "Skipped. AI will show the offline fallback until a key is added."
fi

# 3. Cloudflare login + secret on the v2 Worker
say "3/5 Cloudflare"
if ! npx wrangler whoami 2>&1 | grep -q 'You are logged in'; then
  echo "A browser will open. Log in to Cloudflare and click Allow."
  npx wrangler login
fi
if [ -n "$key" ] && npx wrangler whoami 2>&1 | grep -q 'You are logged in'; then
  printf '%s' "$key" | npx wrangler secret put GEMINI_API_KEY --name loglens-v2 \
    && echo "Secret set on Worker loglens-v2."
fi
unset key

# 4. Team roles (Team Delegation = 20 marks). Real names only.
say "4/5 Team"
if [ ! -f docs/TEAM.md ]; then
  echo "One member per line as:  Name - role (e.g. Sagar - backend + AI + demo). Empty line to finish."
  { echo "# TEAM (from the user, do not invent)"; echo; echo "| Member | Role |"; echo "|---|---|"; } > docs/TEAM.md
  while read -rp "> " line && [ -n "$line" ]; do
    printf '| %s | %s |\n' "${line%% - *}" "${line#* - }" >> docs/TEAM.md
  done
  echo "Saved docs/TEAM.md"
else
  echo "docs/TEAM.md exists, skipping."
fi

# 5. Start the loop (deep research runs first as Phase R inside it)
say "5/5 Starting the loop. Type 'status' any time, Esc or 'stop the loop' to stop."
exec claude --permission-mode auto \
  "/loop Run ONE iteration of LOOP.md, then schedule the next. Phase R uses the anthropic-skills:deep-research skill. Read docs/TEAM.md for team roles."
