-- Server-side evidence ledger (Cloudflare D1 = SQLite). Append-only: the API has no UPDATE or DELETE route.
-- Each row stores the entry hash of the row before it (hash chain) and an HMAC signature made with a server secret.
CREATE TABLE IF NOT EXISTS seals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sealed_at TEXT NOT NULL,      -- server time (ISO, UTC)
  sha256 TEXT NOT NULL,         -- hash of the evidence, computed in the browser
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  investigator TEXT NOT NULL,
  action TEXT NOT NULL,         -- SEALED or VERIFIED_MATCH / VERIFIED_TAMPERED
  prev_hash TEXT NOT NULL,      -- entry_hash of the previous row (64 zeros for the first)
  entry_hash TEXT NOT NULL,     -- sha256(prev|sealed_at|sha256|name|size|investigator|action)
  sig TEXT NOT NULL             -- HMAC-SHA256(SEAL_SECRET, entry_hash)
);

-- v2 of the ledger (22 Oct 23:15): the first table allowed two receipts written in the same millisecond to link
-- to the same previous row (a fork, caught by /api/ledger). UNIQUE(prev_hash) makes the database refuse the
-- second one; the API then retries with the new newest row, so the chain stays one straight line.
-- The old "seals" table is kept unchanged as history and is no longer written.
CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sealed_at TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  investigator TEXT NOT NULL,
  action TEXT NOT NULL,
  prev_hash TEXT NOT NULL UNIQUE,
  entry_hash TEXT NOT NULL,
  sig TEXT NOT NULL
);
