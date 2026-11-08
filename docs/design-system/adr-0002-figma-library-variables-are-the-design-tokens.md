---
title: "ADR 0002: The Figma library's variables are the design tokens"
description: "Decision record for moving the design-token source from the old Figma file's styles and layers to the design-system library's variables, read on a Pro plan through a generated Tokens page."
type: reference
status: draft
tags:
  - design-system
  - design-tokens
  - figma
  - decision
links:
  - "[ADR 0001](adr-0001-figma-owns-design-tokens.md)"
  - "[VariablesService](../../figma/services/VariablesService.md)"
  - "[Tokens page generator](../../figma/generators/tokensPage.md)"
  - "[TokenService](../../figma/services/TokenService.md)"
  - "[ADR 0003](adr-0003-figma-owns-mapped-component-colours.md)"
---

# ADR 0002: The Figma library's variables are the design tokens

- **Status:** Proposed, 2026-11-08. Russ set the direction that day: tokens flow
  from Figma to code. Once accepted, this record supersedes
  [ADR 0001](adr-0001-figma-owns-design-tokens.md).
- **Scope:** Colour, spacing, container, radius, shadow, and type tokens in
  `frontend/`.

## Context

ADR 0001 made Figma the source of truth, and the sync read three things from the
old Figma file (`dS8gTREDjwWE5xZXTPUfPK`): paint styles for colour; the
`fontSize/*`, `lineHeight/*`, and `fontWeight/sans/*` text styles for type; and
named layers on a `#️ Tokens` page for everything else.

On 2026-11-08 a new library,
[dataink.io Design System](https://www.figma.com/design/tl8ANcSSVEzPOS6ZU6lSI1)
(`tl8ANcSSVEzPOS6ZU6lSI1`), was built from the code. It holds 161 variables in
five collections (Color, Spacing, Size, Typography, Motion), text styles bound
to those variables, 16 `Shadow/*` effect styles, and the v1 components. It has no
paint styles, and its text styles are named by role, so the old readers can't
use it.

Figma's REST endpoint for variables needs an Enterprise plan, and the team is on
Pro. A layer bound to a variable, though, comes back from the file endpoint with
its value and the variable's ID on any plan.

## Decision

1. **Figma still owns the tokens.** Changes flow from Figma to code, and the
   generated CSS files stay off-limits to hand edits.
2. **The source is the new library,** and the old file is no longer read. Tokens
   come from its variables, and shadows from its `Shadow/*` effect styles,
   because Figma has no variable type for a shadow.
3. **The build reads the library through a generated Tokens page.**
   `figma/generators/tokensPage.js`, run through the Figma MCP's Plugin API,
   gives every variable a bound layer with a hidden JSON note of the fields REST
   can't return, and adds one sample per text and effect style.
   `VariablesService` reads the page with two REST calls.

| Group                                                | Source in the library                                                  | Written to          |
| ---------------------------------------------------- | ---------------------------------------------------------------------- | ------------------- |
| Colour                                               | Color variables, except `base/white` and `base/black` (Tailwind's own) | `styles/colors.css` |
| Spacing                                              | Spacing variables                                                      | `styles/tokens.css` |
| Container, radius                                    | Size variables                                                         | `styles/tokens.css` |
| Shadow                                               | `Shadow/*` effect styles                                               | `styles/tokens.css` |
| Type size and line height, weight, leading, tracking | Typography variables                                                   | `styles/tokens.css` |

`npm run build:design` writes both CSS files and
`figma/exports/variables.local.json`, a copy of the variables in the Enterprise
API's shape. `FIGMA_FILE_ID` names the library.

## Exceptions carried over from ADR 0001

- **Motion stays in JavaScript.** `js/choreography/tokens/motion/motion.js`
  remains the authority for `styles/motion.css`. The library's Motion collection
  mirrors its durations and easings for reference and is kept in step by hand.
- **Fonts stay in code.** `styles/typography/` is maintained by hand, so the site
  can self-host its faces. The `font/*` variables are reference only.
- **Screens stay in code.** `styles/sizes.css` declares the breakpoints by hand.
  The `screen/*` variables are reference only.
- **Relative values stay in code,** as before: Figma can't express `auto`,
  `full`, fractions, or viewport units.

## Alternatives

- **Code owns the tokens and Figma mirrors them.** Not chosen. Pushing variables
  needs the Plugin API in a signed-in session, because the REST endpoint that
  writes variables is Enterprise-only too, so the push couldn't run in CI.
- **Keep reading the old file.** That would leave two Figma sources of truth, and
  the old file has no variables.
- **Move to an Enterprise plan** and read variables directly. Only
  `VariablesService` would change, and the export already has the Enterprise
  shape.

## Consequences

- The first sync from the library, on 2026-11-08, reproduced `styles/colors.css`
  and `styles/tokens.css` exactly. Only their header comments changed.
- **Editing a value** in Figma needs only `npm run build:design`. **Adding,
  renaming, or deleting** a variable or style also needs the Tokens page
  generator re-run, in a Figma MCP session.
- The build fails, writing nothing, when the Tokens page has drifted from the
  library: a layer that's detached, bound to another variable, or missing. It
  can't detect a deleted variable, because Figma keeps the old binding.
- `colors.css` is now written in Prettier's form, so the manual
  `prettier --write` step after a sync is gone.
- ADR 0001's open items close. `font-weight/extrabold` and `black` are 800 and
  900 in the library, and the old `headings/H1`–`H4` styles aren't read.
- The old file's readers (`FileService`, `StyleService`, `TypographyService`,
  `figma/models/`, `figma/utils/`, and the font writers) were deleted on
  2026-11-08.

## Still open

- **Motion.** The library now holds easings as `cubic-bezier()` strings, which
  answers ADR 0001's reason for keeping motion out of Figma. Whether motion moves
  to Figma is a separate decision.
- **Modes and aliases.** The Tokens page supports one mode per collection, and an
  aliased variable exports its resolved value. Neither exists today. Themes or a
  semantic layer would need the generator and `VariablesService` extended.
