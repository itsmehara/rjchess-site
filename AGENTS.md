# Codex instructions — Jagadeesh Babu Chess Academy site

This file is the Codex-CLI equivalent of this folder's `CLAUDE.md` — keep both in sync if you
update one.

This folder is the **deployable application only**. It has its own independent git repository
and `.gitignore`, separate from the parent workspace folder one level up. It may be forked to a
customer's own GitHub account, made public, or moved wholesale to hosting (Hostinger,
Cloudflare, wherever) — treat everything here as something a stranger might eventually read.

## What does not belong here

Research notes, client-confidential material (real pricing, phone numbers, contracts), unused
draft assets, scraped reference content, credentials, or internal status/audit docs. All of
that lives in the parent workspace folder, in its own separate and typically private repo. If
you need background context on why something was built a certain way, check the parent
folder's `HANDOFF.md` or ask the user — don't copy its content in wholesale.

## Git

This is its own repo. Commands here never affect the parent workspace's git history, and vice
versa. If you're ever unsure which repo a directory belongs to, run
`git rev-parse --show-toplevel`.
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
