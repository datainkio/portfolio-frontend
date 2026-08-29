---
description: "Audit findings and the phased plan to reduce structural debt in frontend frontmatter — one dialect, one authority, only non-derivable fields. Phases 1-5 are complete."
type: plan
tags:
  - frontmatter
  - structural-debt
---

# Plan: Frontmatter Strategy

Frontmatter is the highest-leverage place to start on structural debt: it is read
on every file access by both humans and agents, it was the single largest source
of low-signal tokens in the repo, and it is fixable deterministically.

**Status: phases 1–5 complete.** The contract is
[`specs/frontmatter.spec.md`](../specs/frontmatter.spec.md); before/after evidence
is [`docs/frontmatter-audit/`](frontmatter-audit/README.frontmatter-audit.md).
Phase 6 (sidecar coverage) remains open.

Section 1 below records the **pre-remediation** measurement — it is the evidence
the plan was built on, kept as written.

---

## 1. What the audit found

Measured across the `portfolio-frontend` repo at `ixd` (453 tracked `.md`, 457
`.js`/`.njk`).

| Metric                                              | Value                                         |
| --------------------------------------------------- | --------------------------------------------- |
| Markdown files                                      | 453 (356 with frontmatter, **97 without**)    |
| Distinct top-level frontmatter keys                 | **50**                                        |
| `title` present                                     | 146 (41%)                                     |
| `description` present                               | **25 (7%)** — required by the existing schema |
| Files with `tags`                                   | 293, of which `"#tag"`-formatted: **0**       |
| `status` values in use                              | `stable` 193, `active` 129, + 5 others        |
| Source files carrying inline `aix:` blocks in JSDoc | **183**                                       |
| `.js`/`.njk` missing a co-located sidecar           | **157 (34%)**                                 |
| Auto-generated boilerplate sidecars                 | ~91                                           |
| Frontmatter bytes that restate derivable facts      | **75.6 KB of 135.7 KB (56%)**                 |

### The debt, in your terms

**Fragmentation — three frontmatter dialects, no shared schema.**

1. `.md` sidecar YAML (356 files, 50 keys)
2. Inline pseudo-frontmatter in JSDoc comments (183 `.js` files, incl. `.eleventy.js`)
3. Eleventy-functional YAML in the 27 `.md` files 11ty actually renders

No tool reads dialect 2. Nothing reconciles the three. Parallel key families do
the same job under different names: `template`/`templatePath`/`templateRole`
(108 each) vs `module`/`modulePath`/`scriptRole` (2 each); `type` (123) vs
`docType` (18); `role` (200) vs `description` (25).

**Ambiguity — `.md` means two incompatible things.**
27 markdown files are Eleventy page inputs; ~420 are documentation sidecars. They
share an extension and a frontmatter block with no marker distinguishing them.
Worse, `permalink` appears on `specs/views/*.md` and `data/sanity/*/README.*.md`,
which do **not** publish — the key implies a route that does not exist.
`status: stable` (193) vs `status: active` (129) has no defined difference.

**Duplication — two competing frontmatter authorities.**
[`docs/ia/frontmatter.md`](ia/frontmatter.md) ("IA Frontmatter Schema", canonical)
and [`ia/docs/ia/frontmatter.md`](../ia/docs/ia/frontmatter.md) ("Frontmatter
Rules", operational contract) both define the schema, and they differ. Separately,
`role:` holds 199 distinct free-text values across 200 files — it _is_ a
description, stored under a second name, while `description` sits at 7% coverage.

**Conflict — the written standard contradicts both practice and CLAUDE.md.**

| The rule                                         | Where it is stated       | Reality                                              |
| ------------------------------------------------ | ------------------------ | ---------------------------------------------------- |
| `description`, `docType`, `owner` required       | `docs/ia/frontmatter.md` | 7% / 4% / 6% present                                 |
| `status` ∈ `draft\|active\|deprecated\|archived` | `docs/ia/frontmatter.md` | most common value is `stable` (193), not in the enum |
| The `aix:` namespace is retired                  | `dataink.io/CLAUDE.md`   | 198 files still carry it (183 `.js` + 15 `.md`)      |
| Optional `aix.intent` / `aix.audience` fields    | `docs/ia/frontmatter.md` | directly contradicts the retirement above            |
| Tags formatted `"#[tag-name]"`                   | `dataink.io/CLAUDE.md`   | 0 of 293 tagged files comply                         |

**Bloat — 56% of frontmatter bytes carry no discriminating information.**
`scope: frontend` appears on 200 files with **one** distinct value — in a repo
called `frontend`. Likewise `surface` (193/200 `internal`), `system: "Eleventy"`
(131), `engine: "Nunjucks"` (112), and the two most common tags, `frontend` (111)
and `js` (109). `atomicLevel`, `templatePath`, `templateRole`, and `engine` are
all derivable from the file's own path and extension.

A representative sidecar, [`views/atoms/gel.md`](../views/atoms/gel.md), spends
11 frontmatter lines without stating one fact its path does not already give —
and its `links:` block links to itself. Its body says the classification was
inferred "based on its location under `views/`", which is the tell: the metadata
was _generated from_ the path, then stored next to the path.

Quantified: **~132 KB (~34k tokens)** of derivable or retired metadata across the
corpus — `.md` frontmatter plus the inline JSDoc blocks.

---

## 2. Organizing principles

Three rules, in priority order. Everything in Phase 3 follows from them.

1. **Frontmatter carries only what the path, filename, and extension cannot.**
   If a field can be computed from location, it is noise at rest and should be
   computed at read time instead. This single rule removes ~56% of current
   frontmatter.
2. **One dialect, one location per file.** Documentary metadata lives in the
   `.md` sidecar. Source files carry no pseudo-frontmatter.
3. **Functional and documentary frontmatter never mix.** Eleventy-consumed keys
   (`permalink`, `layout`, `eleventyComputed`, …) appear only in files Eleventy
   renders. Sidecars and specs never carry them.

The corollary worth stating plainly: **`description` is the field that matters
most for AIX and it is the one field that is nearly absent.** It is the only key
here that a retrieval system, a graph query, or an agent skimming a directory can
actually use to discriminate between files. Everything else is either derivable
or constant. The strategy is a trade — drop ~34k tokens of restated path facts,
spend a fraction of that on real one-line descriptions.

---

## 3. Proposed target schema

Minimal core, applied to every documentary `.md`:

```yaml
---
title: "Gel" # human label; keep when it differs from filename
description: "One sentence, specific enough to tell this file from its siblings."
type: "template" # controlled enum, single key (retires docType)
status: "active" # controlled enum; omit when it equals the default
tags:
  - "#atom" # controlled vocabulary; no #frontend, no #js
---
```

- **Required:** `description`. Non-negotiable — it is the whole point.
- **Conditional:** `title` (when it adds over the filename), `status` (when not
  default), `type`, `tags`.
- **Retired:** `scope`, `surface`, `system`, `engine`, `runtime`, `atomicLevel`,
  `template`, `templatePath`, `templateRole`, `module`, `modulePath`,
  `scriptRole`, `id`, `role`, `docType`, `aix:` — 16 keys, all derivable,
  constant, or superseded.
- **Preserved as-is:** `links`, `aliases`, `backlinks` (Obsidian graph), and the
  Eleventy-functional set **only** in the 27 files 11ty renders.

Enums to fix, replacing today's 9 status values and mixed quoting:

- `status`: `draft | active | stable | deprecated | historical` — reconciled
  against real usage, so 193 `stable` files stay legal rather than being defined
  out of existence.
- `type`: `template | script | spec | guide | reference | index | plan | handoff`

`role:` is not deleted — its prose is **migrated into `description`**, which is
where that content belonged. That preserves the only hand-written signal in the
generated sidecars.

---

## 4. Phased plan

Ordered so that every cheap deterministic win lands before the one expensive
judgment-heavy phase.

| #   | Phase                              | Status  | Output                                                                                                                                                                                               |
| --- | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Ratify one authority**           | ✅ done | [`specs/frontmatter.spec.md`](../specs/frontmatter.spec.md). Both `frontmatter.md` files reduced to stubs deferring to it. Resolves the `aix:` contradiction and the tag-format conflict explicitly. |
| 2   | **Normalize values**               | ✅ done | `scripts/normalizeFrontmatter.js` — unified quoting, `docType`→`type`, status mapped onto the enum, canonical key order.                                                                             |
| 3   | **Strip derivable + retired keys** | ✅ done | 1,687 retired keys removed; all 185 inline JSDoc `aix:` blocks removed; `role:` prose migrated into `description:` across 200 files.                                                                 |
| 4   | **Backfill `description`**         | ✅ done | 100% coverage. 200 files from the `role:` migration, 177 derived from body text, 48 hand-authored where neither was possible.                                                                        |
| 5   | **Enforce**                        | ✅ done | `npm run lint:frontmatter`, wired into `npm run validate`. Deterministic and local, per [`constraints.md`](../../context/constraints.md).                                                            |
| 6   | **Close the sidecar gap**          | ⬜ open | 157 `.js`/`.njk` files still have no sidecar (65.6% coverage, unchanged). Now safe to run: Phase 5 means new sidecars are born compliant.                                                            |

### What the tooling looks like now

Three scripts over one shared classification —
`scripts/lib/frontmatterSchema.js` is the only place a key list exists, so the
audit, the codemod, and the linter cannot drift apart:

```bash
npm run lint:frontmatter    # schema compliance (report-only, exits non-zero)
npm run fix:frontmatter     # apply the codemod (idempotent)
npm run audit:frontmatter   # metrics + Mermaid + Gephi sources
```

The `frontmatter-lint` skill still owns _presence_ checks (does a sidecar exist);
this linter owns _schema_. They do not overlap.

### Verification

- `npm run lint:frontmatter` — clean, 446 files conform
- `npm run test` — 6 passed, 0 failed
- `npm run clean && npm run quick` — exit 0, 50 pages, 0 zero-byte routes
- Codemod re-run — 0 changes (idempotent)

---

## 5. Decisions taken

1. **Boilerplate sidecars: kept, and re-pointed at their actual purpose.**
   The stated intent is Obsidian findability — every file type discoverable in the
   vault. That purpose is served by `description`, `aliases`, and `links`, and not
   at all by `atomicLevel` or `templatePath`. So the sidecars stay; what changed is
   that each now carries the fields that make it _findable_ instead of eleven lines
   restating its own path. `views/atoms/gel.md` went from 11 frontmatter lines to 3.
2. **The `aix:` object is removed entirely**, in markdown and in the 185 JSDoc
   comment blocks. It was declared retired in `CLAUDE.md`, still recommended by the
   old schema doc, and read by no tool. Its one real field, `role:`, was prose —
   migrated into `description`, where it belongs.
3. **Tag format: the `"#tag"` rule is reversed for frontmatter.** Compliance was
   0/293 here. Obsidian adds the `#` itself in the tag pane, and a literal `#` in
   unquoted YAML starts a comment — which is the hazard the old rule was quoting
   around. Dropping the prefix removes the hazard instead. Inline body tags still
   require `#`; `dataink.io/context/` keeps its existing form. **This reverses a
   documented non-negotiable — flagged for veto.**
4. **`status: stable` is retained alongside `active`.** `stable` means settled;
   `active` means current and still moving. `active` is the default and is omitted.

---

## 6. Adjacent findings

- **`.claude/agents/` did not exist anywhere in the vault** — ✅ **resolved.** Both
  [`dataink.io/CLAUDE.md`](../../CLAUDE.md) and [`frontend/CLAUDE.md`](../CLAUDE.md)
  routed all agent work through a table of dead links. Treated as fully deprecated:
  both routing tables now point at the skills in `.claude/skills/`, which is what
  actually replaced them.
- **A fourth metadata dialect exists** — `specs/animation/*.animation-spec.md` use
  bold-key lists (`- **Title:** …`) rather than YAML. Left alone; they now carry
  conforming frontmatter _as well_, but the body convention is untouched.
- **`.eleventyignore` references `njk/_pages/lab/README.md`** — the `njk/` tree no
  longer exists. Not addressed.
- **52 unresolved wikilinks** across 34 distinct targets (`[[TODO]]`,
  `[[ProjectHeader]]`, `[[01 XS]]`, …), plus ~70 broken relative links. Not addressed.
- **`permalink` on non-publishing files** — ✅ resolved. Eleventy's input dir is
  `ia/`, so the 9 `permalink` keys outside it were provably inert; the linter now
  rejects the pattern.
- **8 zero-byte `_site/` routes** were stale build artifacts from before the
  previous session's deletions, not a live defect — a clean rebuild produces none.
