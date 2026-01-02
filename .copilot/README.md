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

### `js.prompt.md`
**Scope**
- Browser-first JavaScript used for progressive enhancement
- Initialization, DOM interaction, UI behavior

**Does NOT apply to**
- Build output
- Config files
- Server-side JS

---

### `html.prompt.md`
**Scope**
- Nunjucks / HTML templates rendered by 11ty
- Layouts, includes, macros

**Does NOT apply to**
- Generated HTML (`_site/`)
- JavaScript logic
- CSS authoring rules

---

## Precedence Rules

1. File-type prompt beats general guidance
2. Explicit constraints beat implied conventions
3. Repository conventions beat generic best practices
4. When in doubt, ask one clarifying question

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
