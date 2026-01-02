# AI Prompts

This folder holds AI-facing prompt files and experiment briefs that guide Copilot or other assistants.

Guidelines:

- Keep prompts here, not alongside source; remove stale prompts quickly.
- Reference source-of-truth code and docs rather than embedding code copies.
- Avoid secrets, tokens, and production data.
- Prefer concise, task-scoped prompts; delete once obsolete.

Related guardrails:

- Prompt authority and scope live in [.copilot/README.md](../../.copilot/README.md). Language-specific prompts remain in `.copilot/`.
- Use the [AIX_Maintenance_Checklist.md](./AIX_Maintenance_Checklist.md) monthly or before refactors to keep Copilot signal clean.
