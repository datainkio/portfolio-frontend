# Copilot Prompt Scoping & Authority

This directory defines **authoritative, operational guidance for AI-assisted development**
within this repository.

Prompts in this folder are treated as **constraints**, not suggestions.

---

## Purpose

- Improve Copilot accuracy and restraint
- Prevent pattern drift and hallucination
- Make developer intent legible to AI systems
- Maintain long-term AIX (AI Experience) quality

---

## Prompt Authority Model

Prompts are scoped by **language and responsibility**.

They apply only within their declared scope and must not be blended unless explicitly stated.

---

## Prompt Index

Prompt modules now live under `.copilot/prompts/` and are intended to be selected by the workspace Concierge when working in this repo:

- Prompt index: [.copilot/prompts/index.md](prompts/index.md)
- `prompts/domain.prompt.md` — repo-wide domain constraints
- `prompts/js.prompt.md` — browser-first JavaScript, progressive enhancement
- `prompts/display.prompt.md` — UI rendering and display layers
- `prompts/choreography-planning.prompt.md` — planning-only choreography output
- `prompts/choreography-implementation.prompt.md` — implementing an approved plan

## Curated context

- Frontend context hub: [.copilot/context/README.md](context/README.md)
- Architecture map: [.copilot/context/architecture-map.md](context/architecture-map.md)

---

## Precedence Rules

1. File-type prompt beats general guidance
2. Explicit constraints beat implied conventions
3. Repository conventions beat generic best practices
4. When in doubt, ask one clarifying question

---

## Multi-root note (scaffold + frontend)

When this repo is opened alongside a platform scaffold, treat the scaffold as the **entrypoint** (Concierge routing policy and cross-workspace conventions). These prompt modules remain authoritative for work **inside this frontend repo**.

---

## Editing Rules

- Prompts must be:
  - concise
  - prescriptive
  - low-noise
- Remove obsolete rules immediately
- Avoid narrative or speculative language
- Prefer "must / must not" over "should"

---

## What Does NOT Belong Here

- AI philosophy
- Tutorials
- Experiments
- Rationale or retrospectives

Those belong in `docs/ai/`.

---

## Success Criteria

This system is working when:

- Copilot suggestions align with repo conventions
- AI-generated code requires minimal correction
- Patterns remain consistent over time
- New contributors understand constraints quickly
