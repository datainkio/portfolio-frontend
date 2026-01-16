# AIX Maintenance Checklist (Copilot‑First Repos)

This checklist is designed for **11ty + browser‑first JavaScript + Nunjucks** projects that rely heavily on **GitHub Copilot**.  
Use it **monthly**, **before major refactors**, or **any time Copilot quality degrades**.

---

## 1. Context Hygiene (Highest Impact)

☐ `_site/` is untracked and ignored  
☐ No generated files committed (`dist/`, `.cache/`, build logs)  
☐ No minified JS/CSS in source directories  
☐ Bundled JS artifacts remain ignored (`assets/js/choreography/bundle.js`)  
☐ No experimental or scratch files in `src/`  
☐ Old patterns deleted (not commented out)

**Rule:** Generated or stale files _actively harm_ Copilot accuracy.

---

## 2. Prompt Integrity (`.copilot/`)

☐ `.copilot/README.md` exists and is current  
☐ Each prompt has a single, explicit scope  
☐ No overlapping authority between prompts  
☐ Prompts use **must / must not**, not “should”  
☐ Obsolete rules removed immediately

**Quick test:**  
Can you answer _“Which prompt applies to this file?”_ in under 5 seconds?

---

## 3. File & Folder Signal Quality

☐ One responsibility per file  
☐ File names describe behavior, not abstraction  
☐ No `utils.js`, `helpers.js`, or `misc/` without justification  
☐ Shared logic lives in clearly named modules  
☐ Dead directories removed

**Rule:** Copilot learns more from filenames than comments.

---

## 4. JavaScript AIX Health (Browser‑First)

☐ Initialization functions are idempotent  
☐ DOM access is guarded (`if (!el) return`)  
☐ No SPA or framework assumptions  
☐ Side effects are documented  
☐ Functions under ~40 lines where practical

**Red flags:**  
global state · hidden singletons · implicit lifecycles

---

## 5. Template AIX Health (Nunjucks / HTML)

☐ Semantic HTML used consistently  
☐ Layouts define structure only  
☐ Includes/macros are narrowly scoped  
☐ No business logic in templates  
☐ Accessibility treated as baseline

**Rule:** Templates express _meaning_, not computation.

---

## 6. Comment Quality (Critical)

☐ Comments explain **why**, not **what**  
☐ Constraints and invariants documented  
☐ Performance assumptions stated  
☐ No narrating obvious code  
☐ No commented‑out code remains

**Bad**

```js
// loop through items
```

**Good**

```js
// Must remain synchronous to avoid layout thrashing
```

---

## 7. Copilot Behavior Check (5‑Minute Test)

Create a new JS file and type:

```js
// initialize navigation enhancements
```

☐ Suggests guarded init function  
☐ Avoids frameworks  
☐ Uses early returns  
☐ Matches repo patterns  
☐ No invented abstractions

If this fails → tighten prompts or delete noisy files.

---

## 8. Acceptance Discipline

☐ Large suggestions reviewed carefully  
☐ Partial completions preferred over full rewrites  
☐ Refactors begin with “explain current behavior”  
☐ Copilot rejected when uncertain

**Metric:** Lower acceptance rate with _higher confidence_ is healthy.

---

## 9. Deletion as Optimization

☐ Remove unused includes  
☐ Delete dead JS modules  
☐ Prune near‑duplicate patterns  
☐ Consolidate canonical examples

> Deleting code improves Copilot faster than adding rules.

---

## 10. Periodic Reset (Monthly / Major Milestone)

☐ Open `.copilot/js.prompt.md` once per session  
☐ Open one canonical JS file and one canonical template  
☐ Re‑read `.copilot/README.md`  
☐ Ask: _“What would confuse an AI here?”_

---

## Success Signals

- Copilot suggestions feel **boring** (good)
- New files start out correct
- Fewer rejections and edits
- Patterns remain stable over time
- Repo “teaches” Copilot automatically

---

## If Copilot Quality Drops

1. Look for new noise (generated files, experiments)
2. Delete before adding prompts
3. Tighten scope, don’t broaden it
4. Re‑run the 5‑minute behavior check
