---
title: "Spec: Design system"
description: "Contract for the design system: what a token is, what a component is, where each comes from, how to add one, and what npm run validate enforces."
type: spec
tags:
  - spec
  - design-system
  - design-tokens
  - atomic-design
aliases:
  - Design System Spec
links:
  - "[ADR 0001](../docs/design-system/adr-0001-figma-owns-design-tokens.md)"
  - "[ADR 0004](../docs/design-system/adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md)"
  - "[Component API spec](views/component-api.views-spec.md)"
  - "[Living reference](../ia/docs/design/README.md)"
  - "[lintPalette](../scripts/lint/lintPalette.md)"
---

# Spec: Design system

- **Scope:** every visual value and every macro component in `frontend/`
- **Decisions behind it:** [ADR 0001](../docs/design-system/adr-0001-figma-owns-design-tokens.md), who owns each token group; [ADR 0004](../docs/design-system/adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md), how GSAP runs the ease tokens
- **Component contract:** [Component API spec](views/component-api.views-spec.md)
- **Rendered at:** `/docs/design/`, from [`ia/docs/design/`](../ia/docs/design/README.md)

## Token or component

|                | Token                                                        | Component                                                                                                                 |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Is**         | One named value: a colour, a spacing step, a radius, a curve | A Nunjucks macro that renders markup                                                                                      |
| **Lives in**   | A CSS custom property in `@theme`, reached through a utility | `views/atoms/`, `views/molecules/`, or `views/organisms/`                                                                 |
| **Owned by**   | Figma, except motion and fonts (below)                       | Code, except the colour utilities in a mapped `variants` map (below)                                                      |
| **Changed by** | Editing the source, then running its sync                    | Editing the `.njk` and its sidecar; for a mapped component's colours, editing Figma and running `npm run sync:components` |
| **Answers**    | "What value?"                                                | "What structure, and which values does it apply?"                                                                         |

A component applies tokens and never declares them. If a component needs a value
the theme doesn't have, that's a new token, added at its source, not an arbitrary
value in the template.

A **mapped component** is one whose sidecar names a Figma component set
(`figma: "25:43"` in `views/atoms/button.md`). Figma owns the `bg-`, `text-` and
`border-` utilities, and their `hover:` forms, inside its `variants` map;
`npm run sync:components` writes them and reverts a hand edit there. Layout, type
and everything else in the template stays code-owned. Contract:
[Component colour sync spec](component-sync.spec.md). Button is the only mapped
component today.

A project utility (`@utility` in `styles/`, such as the halftone and stripe
patterns) sits between the two. It composes tokens into one reusable effect and
owns no markup. It's documented on the
[utilities page](../ia/docs/design/tokens/utilities.md).

## Where tokens come from

| Group                                             | Source                                          | Written to          | Command                |
| ------------------------------------------------- | ----------------------------------------------- | ------------------- | ---------------------- |
| Colour                                            | Color variables in the Figma library            | `styles/colors.css` | `npm run build:design` |
| Spacing, containers, radius                       | Spacing and Size variables in the Figma library | `styles/tokens.css` | `npm run build:design` |
| Shadow                                            | `Shadow/*` effect styles in the Figma library   | `styles/tokens.css` | `npm run build:design` |
| Type size, line height, weight, leading, tracking | Typography variables in the Figma library       | `styles/tokens.css` | `npm run build:design` |
| Motion durations and easings                      | `js/choreography/tokens/motion/motion.js`       | `styles/motion.css` | `npm run build:motion` |
| Font faces and families                           | `styles/typography/`, by hand                   | —                   | —                      |

`colors.css`, `tokens.css`, and `motion.css` are generated. Never edit them by hand;
the next sync overwrites the edit.

The GSAP choreography reads motion tokens through `motion` in
`js/choreography/config/ix/motion.js`, not through `motion.css`. Durations pass
through unchanged. Easings don't: GSAP can't parse a `cubic-bezier()`, so
`motion.ease(name)` returns the nearest GSAP core ease from `GSAP_EASE`. CSS runs
the exact curve and GSAP runs that approximation. The
[motion reference page](../ia/docs/design/tokens/motion.md) plots the two
together. [ADR 0004](../docs/design-system/adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md)
has the map and the reasons. Never pass a `motionTokens.ease` string to GSAP.

Relative values (`auto`, `full`, `screen`, fractions, `dvh`, `%`) stay as plain
utilities. Figma can't express them, so they aren't tokens.

## Rules

1. **Colour comes from the palette.** Every colour in a template or a
   hand-written stylesheet is a colour declared in `styles/colors.css`: a step
   of `primary`, `secondary`, `tertiary`, `accent`, or `neutral`, a
   `semantic-*` colour, or `black` or `white`. Utilities name it (`bg-neutral-900`);
   CSS and arbitrary values reference it (`var(--color-neutral-900)`), including
   black and white. For transparency, mix it:
   `color-mix(in oklab, var(--color-black) 30%, transparent)`. No hex, `rgb()`,
   `oklch()`, or named colours, and no `--color-*` declared outside
   `colors.css`. `transparent`, `current`, and `inherit` are always allowed.
   Tailwind's default families still load, so nothing but the lint stops one
   from rendering. Enforced by `npm run lint:palette`.
2. **Every value in use is a token.** Spacing, radius, shadow, and type utilities
   resolve to theme values. An arbitrary value (`[…]`) that recurs across files
   is a missing token. A one-off may stay where it is.
3. **States use semantic colours.** Invalid, success, and change states use
   `semantic-fail`, `semantic-success`, and `semantic-change`. Where a semantic
   colour falls short of 4.5:1 on its background, use the nearest palette step
   that passes and say so in the component's sidecar.
4. **Components follow the Component API.** One `render(params = {})` macro, no
   ambient context, caller classes appended through `classes` and `styles`. See
   the [Component API spec](views/component-api.views-spec.md).
5. **Every component has a reference page.** Its page under `ia/docs/design/`
   renders it live, or links to where it appears when it can't render alone.

## Adding a token

1. Add it in the [Figma library](https://www.figma.com/design/tl8ANcSSVEzPOS6ZU6lSI1):
   a variable in Color, Spacing, Size (radius, container) or Typography, or a
   `Shadow/*` effect style for a shadow. A variable named `spacing/18` defines
   `--spacing-18`. A type size needs both `text/<step>/size` and
   `text/<step>/line-height`. Set the variable's web code syntax to its CSS name.
   [TokenService](../figma/services/TokenService.md) lists how each group is read.
2. Re-run the Tokens page generator,
   [tokensPage.js](../figma/generators/tokensPage.md), so the new variable or
   style has a layer. Changing an existing value needs no re-run.
3. Run `npm run build:design`.
4. Review the diff of `styles/colors.css` and `styles/tokens.css`. Only the new
   token should change.
5. Use it through its utility (`p-18`, `bg-accent-300`). Its token page under
   `ia/docs/design/tokens/` reads the theme files and picks it up without edits.

For a motion token, add it to `motion.js` and run `npm run build:motion` instead.
An ease token also needs a `GSAP_EASE` entry in `js/choreography/config/ix/motion.js`,
naming the GSAP core ease closest to the curve. `npm test` fails until it has one.

## Adding a component

1. Run `npm run scaffold:component <tier> <name>`, e.g.
   `npm run scaffold:component molecules project-card`. It writes a Component
   API skeleton.
2. Write the macro. Read only `params`, and apply `classes` with the `classes`
   filter on the root element.
3. Write the sidecar's `## Params` table: every `params.*` key the macro reads,
   including every `styles` slot.
4. Add a page at `ia/docs/design/<tier>s/<path>.md` mirroring the component's
   path under `views/`. Set `component` to its path, and give it `specimens`
   with sample params. A component that can't render alone gets `inContext`
   links instead. [`layouts/design-doc.njk`](../views/layouts/design-doc.md) is
   the contract for these keys. `ia/**/*.md` renders as Nunjucks, so a broken
   import there fails the build.
5. Run `npm run validate` and `npm run quick`, then read the rendered page in
   `_site/docs/design/`.

## Enforcement

| Check                      | Fails on                                                                                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint:palette`     | A colour in `views/`, `styles/`, `js/`, or `data/sanity/transforms/` that isn't from the palette (rule 1), or an arbitrary value used in more than one file (rule 2) |
| `npm run lint:frontmatter` | Sidecar and reference-page frontmatter outside the frontmatter spec                                                                                                  |
| `npm run audit:sidecars`   | A new `.njk` or `.js` without a sidecar                                                                                                                              |
| `npm run check:motion`     | `styles/motion.css` differing from a fresh build of `js/choreography/tokens/motion/motion.js`                                                                        |
| `npm test` (motion-eases)  | An ease token with no `GSAP_EASE` entry, or one whose GSAP name doesn't parse                                                                                        |
| `npm run quick`            | A broken import in a component or a reference page                                                                                                                   |

`npm run validate` runs the first four and `npm test`.

The generated stylesheets (`colors.css`, `tokens.css`, `motion.css`) are also
protected from agent edits by deny rules in `.claude/settings.json`. Those rules
cover the file tools only, not shell commands, which is why `check:motion`
exists. `colors.css` and `tokens.css` have no fresh-build check yet: rebuilding
them needs the Figma API, so their check waits on the offline Figma fixture.

Not enforced yet: colour literals in JavaScript values (as opposed to classes),
and classes in `ia/**/*.md`. Run `npm run inventory:design` and read its
arbitrary-values table to review one-off arbitrary values by hand.
