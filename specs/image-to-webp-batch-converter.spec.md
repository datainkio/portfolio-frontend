Create a concise, implementation-ready plan for delivering my portfolio’s raster images as WebP, including PNGs with transparency. You are planning the work; Claude Haiku 4.5 will implement it.

**Context**

- My portfolio uses Eleventy, Nunjucks, JavaScript, and Sanity. Verify the actual repository structure and image pipeline before proposing changes.
- Priorities: visual fidelity, preserved transparency, smaller delivered files, maintainability, and minimal agent token usage.
- Preserve original source assets. WebP files are delivery derivatives.
- Plan only. Do not modify files, install dependencies, or convert images.

**Investigate**
Inspect only the files needed to understand image sources, build configuration, existing image utilities, and references in templates, CSS, JavaScript, and CMS content. Summarize findings without dumping file inventories.

Determine:

- Which images are local versus delivered through Sanity or another remote service.
- Whether an existing build pipeline or CDN can produce WebP without a separate batch conversion.
- How image URLs, responsive variants, and caching currently work.
- Any exceptions requiring explicit handling, including animation, SVGs, favicons, or social-sharing images. Scope routine conversion to raster content images; explain exceptions.

**Design the approach**
Recommend one approach that fits the existing project. Prefer existing dependencies and deterministic scripts over per-image agent actions.

Define:

1. Conversion settings for photography, screenshots, text-heavy graphics, and transparent images. Preserve alpha without flattening. Treat quality settings as starting points requiring representative visual review.
2. A simple way to assign conversion settings without having an LLM inspect every image.
3. Source and output locations, collision-safe naming, and reference updates.
4. Repeatable execution: skip unchanged assets, invalidate outputs when settings change, handle failures, and provide a dry run.
5. Handling of dimensions, orientation, color profiles, and metadata.
6. A concise report covering counts, byte savings, failures, and outputs larger than their originals.
7. Integration into the existing build or asset workflow so future runs require no model calls.

**Validation**
Specify proportionate checks for successful decoding, expected dimensions, preserved alpha, valid image references, and a successful site build. Include a small visual review sample covering photographs, sharp text, and transparent edges against light and dark backgrounds.

**Deliver**
Return:

- A brief findings summary with relevant file paths.
- Your recommended approach and its rationale.
- An ordered implementation checklist naming files to create or change.
- Clear acceptance criteria.
- A self-contained handoff prompt for Haiku containing the decisions, constraints, implementation steps, and verification commands.

Keep the plan focused. Avoid unrelated refactoring, exhaustive alternatives, and unnecessary testing. Distinguish verified facts from assumptions. Ask questions only when a missing answer would materially change the implementation; otherwise state a reasonable default.
