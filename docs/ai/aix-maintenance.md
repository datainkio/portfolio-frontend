# AIX maintenance loop (frontend)

This repo already includes a checklist at [docs/ai/AIX_Maintenance_Checklist.md](AIX_Maintenance_Checklist.md). This page adds a lightweight “loop” to keep AIX quality high without expanding prompt sprawl.

## When to run

- Monthly
- Before large refactors
- Any time Copilot suggestions drift (invented abstractions, wrong file targets, framework assumptions)

## Order of operations

1. **Delete noise before adding rules**

- Remove stale experiments, duplicates, unused templates, dead JS.

2. **Reconfirm authority chain**

- Repo-wide invariants: `.github/copilot-instructions.md`
- Task modules: `.copilot/prompts/*`
- Human docs: `docs/ai/*`

3. **Update modules surgically**

- Prefer narrowing scope and adding one canonical example over adding more rules.

4. **Quick repo validation**

- Run `npm run test` and `npm run test:choreography` when choreography changes.
- Run `npm run validate` before shipping.

## Canonical examples

Start with: `docs/ai/examples/`.
