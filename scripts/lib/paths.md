---
description: Sidecar for paths.js — the one definition of the frontend repo root for every script.
type: script
tags:
  - tooling
---

# paths.js

Exports `projectRoot`, the absolute path to the frontend repo root.

Import this instead of working out the root from a script's own location. That
keeps a script working when it moves between folders, and when it runs from a
directory other than the repo root.

Only code shared across `scripts/` folders belongs in `lib/`.
