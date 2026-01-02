# Code Review Prompt — js/choreography (AIX + DX First)

You are **GPT-5.1-Codex-Max** acting as a **senior staff frontend engineer and AIX (AI Experience) architect**.

## Task
Perform a **code review of the `js/choreography` package** in this repository.

---

## Objectives

### Primary Objective — AIX
Maximize **AI Experience (AIX)** so that GitHub Copilot and other AI assistants can:
- Understand intent with minimal ambiguity
- Produce accurate, restrained, idiomatic suggestions
- Avoid hallucinating APIs, patterns, or frameworks

### Secondary Objective — DX
Improve **Developer Experience (DX)** so humans can:
- Discover how the package works quickly
- Debug and extend it safely
- Refactor without introducing entropy

---

## Non-Negotiable Constraints

- Follow all rules defined in `.copilot/js.prompt.md`
- Assume **11ty + browser-first JavaScript**
- Do **not** reference generated output (e.g. `_site/`)
- Do **not** propose SPA or framework architectures
- Do **not** introduce new dependencies without strong justification
- Favor explicitness, predictability, and idempotent initialization

---

## Scope

- Review **only** `js/choreography/**`
- Include immediately required imports or shared utilities if necessary for understanding
- Evaluate:
  - file structure
  - naming
  - exports / public API
  - initialization patterns
  - DOM interaction
  - side effects
  - error handling
  - performance
  - documentation
  - consistency with repo conventions

---

## Required Review Process

### 1. Inventory & Map
Produce a concise map of the package:
- Entry points
- Modules and exports
- Responsibility of each file
- Primary data flows
- Explicit side effects

Call out:
- unclear boundaries
- mixed responsibilities
- implicit contracts

---

### 2. AIX Audit (Highest Priority)

Identify **AI-confusers**, including:
- Ambiguous or generic naming
- Hidden coupling or reliance on implicit DOM structure
- Clever abstractions that obscure control flow
- Inconsistent patterns across files
- Undocumented invariants or assumptions

For each issue:
- Explain why it harms AIX
- Propose the **smallest possible change** to improve clarity
- Explicitly note where Copilot is likely to hallucinate or over-generalize

---

### 3. DX Audit

Evaluate:
- Discoverability (how a dev learns how to use this package)
- Debuggability (logging, traceability, error clarity)
- Maintainability (file boundaries, API stability)
- Onboarding friction (where to start, missing docs)

Call out **missing documentation** that would materially reduce friction.

---

### 4. Browser-First Correctness

Confirm:
- All initialization paths are **idempotent**
- DOM access is guarded against missing elements
- Event listeners are not duplicated
- Observers/listeners are cleaned up where appropriate
- DOM mutations preserve semantic structure and accessibility intent
- No unnecessary layout thrashing or repeated DOM queries

---

### 5. Actionable Recommendations (Deliverable)

Provide a prioritized list:

**P0 — Must Fix**
- Bugs
- Unsafe patterns
- AIX breakers

**P1 — Should Fix**
- Clarity improvements
- DX improvements
- Pattern consistency

**P2 — Nice to Have**
- Cleanup
- Polish
- Minor refactors

Each recommendation must include:
- Affected file(s)
- Observed issue (one sentence)
- Why it matters (AIX/DX impact)
- Proposed change (concrete)
- Low-risk validation step

---

### 6. Canonical Pattern Proposal

Identify **1–3 canonical patterns** this package should standardize on, such as:
- init function signature
- DOM query strategy
- event binding approach
- animation / choreography sequencing

Recommend:
- Which pattern(s) should become canonical
- Where the canonical example should live so Copilot learns it

---

## Output & Persistence Requirements (Critical)

### File Output (Required)
- Write the **full review output** to:
  ```
  js/choreography/audit.md
  ```
- The file must include:
  - Inventory & Map
  - AIX Audit findings
  - DX Audit findings
  - Browser-first correctness checks
  - Prioritized recommendations (P0 / P1 / P2)
  - Canonical pattern recommendations

### Console Output (Restricted)
- Console/chat output must contain **only**:
  - A short executive summary (5–10 bullets)
  - Counts of P0 / P1 / P2 items
- Do **not** duplicate the full review in the console.

---
## TODO Extraction (Required)

After generating `js/choreography/audit.md`, create a second deliverable: a TODO list derived **only** from the Actionable Recommendations (P0/P1/P2).

### Output File
Write the TODO list to:
```
js/choreography/audit.todos.md
```

### Formatting Requirements (Obsidian)
- Use Markdown task syntax for every item:
  - `- [ ] ...`
- Every task line must begin with one of the following prefixes (choose the best fit):
  - `TODO`, `FIXME`, `A11Y`, `FEAT`, `REFACTOR`, `HACK`, `TEST`, `PERF`, `OPTIMIZE`, `REVIEW`, `DOCS`, `COPY`, `STYLE`, `I18N`, `TOKEN`, `CHORE`, `BUILD`, `CONFIG`, `MIGRATION`
- Include priority tagging in the text:
  - Start each task description with `P0`, `P1`, or `P2` immediately after the prefix.
- Include file references:
  - Mention the affected file(s) in backticks, e.g. `` `js/choreography/init.js` ``.
- Keep each task atomic and actionable (one change per task).
- Do not invent tasks not grounded in the audit recommendations.
- If a recommendation affects multiple files, split into multiple tasks when feasible.

### Example Task Format
- [ ] FIXME P0: Guard missing nav root before binding listeners in `js/choreography/nav.js`
- [ ] DOCS P1: Document idempotent init contract at top of `js/choreography/init.js`
- [ ] PERF P2: Cache repeated selectors used per frame in `js/choreography/scroll.js`

### Console Output (Reminder)
Console/chat output remains restricted to the executive summary and P0/P1/P2 counts. Do not print the full TODO list to the console.

## Output Quality Rules

- Be concrete and opinionated
- Tie observations directly to the code
- Avoid generic best-practice lists
- State assumptions explicitly
- Prefer small, low-risk improvements

---

## Success Criteria

This review is successful when:
- Package intent is obvious to humans and AI
- Copilot suggestions align with established patterns
- Refactors feel safer and more predictable
- `js/choreography` becomes a **canonical teaching surface** for the repo
