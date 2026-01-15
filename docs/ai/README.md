# AI Prompts

This folder holds AI-facing prompt files and experiment briefs that guide Copilot or other assistants.

Start here:

- [WORKSPACE_PORTABILITY.md](./WORKSPACE_PORTABILITY.md) — how these prompts/agents remain usable when the frontend is opened alone or in a multi-root workspace

## Authority in multi-root workspaces

If this repository is opened in a multi-root workspace alongside a platform scaffold, treat the scaffold as the authoritative source for:

- agent routing policy (which “agent/module” to use)
- cross-workspace AIX measurement, scoring, and logging conventions

This repository’s AI docs and prompts are **project-local**: they should optimize Copilot output when working on the 11ty/Nunjucks/GSAP codebase, without redefining platform-wide conventions.

Guidelines:

- Keep prompts here, not alongside source; remove stale prompts quickly.
- Reference source-of-truth code and docs rather than embedding code copies.
- Avoid secrets, tokens, and production data.
- Prefer concise, task-scoped prompts; delete once obsolete.

Related guardrails:

- Prompt authority and scope live in [.copilot/README.md](../../.copilot/README.md). Language-specific prompts remain in `.copilot/`.
- Use the [AIX_Maintenance_Checklist.md](./AIX_Maintenance_Checklist.md) monthly or before refactors to keep Copilot signal clean.
