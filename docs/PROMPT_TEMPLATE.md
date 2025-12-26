# Recommended Prompt Structure

1. **Goal:** one sentence describing the problem or outcome.
2. **Discovery:** ask me to search the workspace for relevant files and symbols, then summarize what’s found.
3. **Scope:** request a minimal TODO plan with 2–4 targeted actions.
4. **Constraints:** limit edits to confirmed files; stop after each phase and report progress.
5. **Acceptance:** define success criteria (e.g., specific behavior, commands that should run without errors).

## Optional add-ons

- “If uncertain, list 3 hypotheses and how you’ll test them.”
- “Prefer reading larger ranges over many small reads.”
- “Avoid unrelated refactors; only patch issues tied to the goal.”

## Defaults

1. Goal:
2. Discovery: Do not summarize what's found.
3. Scope: Do not describe your TODO plan.
4. Constraints: Do not run the build when testing JS edits. Do not stop after each phase of work to report progress.
5. Acceptance:
