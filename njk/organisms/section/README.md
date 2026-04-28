This directory primarily contains section content for the homepage. Most of these are going to be one-offs.

Accessibility contract for section macros:

- Section templates with visible headings should wire `<section aria-labelledby="...">` to the section heading element id.
- Macros may accept an optional `headingId` param; when omitted, derive it from `sectionId` using `sectionId ~ "-heading"`.
- Hero section macro (`hero.njk`) renders at `50dvh` so the section height is 50% of the viewport.
