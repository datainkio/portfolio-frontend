# AI Prompts

This folder holds AI-facing prompt files and experiment briefs that guide Copilot or other assistants.

Start here:

- [START_HERE.md](./START_HERE.md) — single entrypoint for prompts, context, and canonical examples
- [WORKSPACE_PORTABILITY.md](./WORKSPACE_PORTABILITY.md) — how these prompts/agents remain usable when the frontend is opened alone or in a multi-root workspace

Also useful:

- [aix-maintenance.md](./aix-maintenance.md) — lightweight loop to keep AIX quality high
- `examples/` — canonical patterns to anchor Copilot suggestions
- [plan-landing-performance.prompt.md](./plan-landing-performance.prompt.md) — performance planning prompt for landing page

Legacy reference:

- `legacy-agents/` — prior agent definitions preserved as reference (not active as selectable agents)
	- [legacy-agents/choreography-planner.agent.md](./legacy-agents/choreography-planner.agent.md)
	- [legacy-agents/choreography-implementer.agent.md](./legacy-agents/choreography-implementer.agent.md)

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
