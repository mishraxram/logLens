# START HERE (Chakravyuh 1.0 kit for Claude Code)

## One-time setup (aaj raat, 30 min)
1. Install Git for Windows: https://git-scm.com/downloads/win (default options).
2. PowerShell kholo (Start menu me PowerShell) aur chalao:
   irm https://claude.ai/install.ps1 | iex
3. Naya PowerShell window kholo, phir:
   claude --version
   git config --global user.name "Sagar Mishra"
   git config --global user.email "your-email@example.com"
4. Kit lagao:
   mkdir C:\Users\rames\Projects\hack-chakravyuh
   cd C:\Users\rames\Projects\hack-chakravyuh
   git init
   Expand-Archive -Path "$HOME\Downloads\chakravyuh-claude-kit.zip" -DestinationPath . -Force
   git add -A
   git commit -m "kit"
5. claude chalao. Browser khulega, apne Claude Pro account se login karo.
6. Check karo: alag PowerShell window me `claude doctor`. Claude ke andar `/usage`, `/model` (Sonnet 5.5 aur Opus 5.5 dikhne chahiye) aur `/skills` (11 commands dikhen).

## Event day (koi command yaad nahi rakhna)
1. hack-live folder me `claude` kholo, `/model opus` chalao.
2. PS aur theme paste karo. Claude T+0 time poochega, phir idea research karke 3 concepts dega.
3. Bolo "go A" (ya B, C). Plan aayega. Theek lage to "go".
4. Ab Claude khud banata jayega aur har feature ke baad batayega kya check karna hai. Tum browser me check karo.
5. Plan ke baad `/model sonnet` kar do.
6. Kuch toote: error paste karo. Status chahiye: "status" likho.
7. "ship karo", "pitch banao", "sawal practice karao" bolo, Claude wahi karega.
8. Limit ya chat bhari lage: "naya session" bolo.

## Rules
- Har slice ke baad commit. Git hi asli undo hai.
- claude.ai chat event ke din band, same quota pool hai.
- Model: /model sonnet (build), /model opus (sirf ek mushkil planning ya bug).
- Dar lage to Esc dabao aur /rewind (sirf Claude ke edits wapas aate hain, git commit pakka undo hai).
- Mode: neeche status bar me `auto mode on` dikhna chahiye. Shift+Tab se manual, accept edits, plan, auto cycle hota hai. bypass permissions kabhi nahi.


## v4 changes (research-based)
- Hackathon defaults in CLAUDE.md: no auth/DB, first screen = tool, real AI call + labelled fallback, 3 sample buttons + judge's own input, QR, honest claims only.
- New rule: anti "AI-made" UI look (.claude/rules/ui-quality.md) + docs/DESIGN.md before the first UI.
- New skill eval-set: honest test-set score at Gate B.
- ps-decode now asks for the organizers' rubric first and recommends the stack.
