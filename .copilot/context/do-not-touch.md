# Do not touch (noise + generated output)

- Generated site output: `_site/**` (never treat as source of truth).
- Generated design tokens:
  - `styles/colors.css`
  - `styles/typography/fontFamilies.css`
  - (re-generated via design/token sync)

Guideline: prefer deleting noise (generated artifacts, experiments left in canonical paths) before adding new prompts.
