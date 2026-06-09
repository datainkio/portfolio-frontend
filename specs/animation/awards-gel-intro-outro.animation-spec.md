# Awards / Recognition Section — Gel Intro & Outro Spec

- **Title:** Awards / Recognition — Two-Gel Backing Intro/Outro Sequence
- **Owner(s):** Frontend / Choreography Maintainers
- **Status:** accepted (design sign-off 2026-06-09)
- **Last reviewed:** 2026-06-09
- **Scope:** The Awards/Recognition section ([../../views/organisms/section/awards.njk](../../views/organisms/section/awards.njk)) and the two background gel layers that compose its visual backing during enter/leave. Defines the resting (init) state, the intro reveal, and the outro reversal.
- **Links:** gel arrangement system [section-gel-arrangements.animation-spec.md](section-gel-arrangements.animation-spec.md), motion accessibility policy [motion-accessibility-policy.md](motion-accessibility-policy.md), choreographer spec [choreographer.animation-spec.md](choreographer.animation-spec.md). Source: section animations [../../js/choreography/organisms/awards/AwardsAnimations.js](../../js/choreography/organisms/awards/AwardsAnimations.js), section triggers [../../js/choreography/organisms/awards/AwardsTriggers.js](../../js/choreography/organisms/awards/AwardsTriggers.js), gel manager [../../js/choreography/managers/GelAnimationManager/GelAnimationManager.js](../../js/choreography/managers/GelAnimationManager/GelAnimationManager.js), arrangements config [../../js/choreography/config/displays/arrangements/arrangements.js](../../js/choreography/config/displays/arrangements/arrangements.js), gel color classes [../../styles/backgrounds/Gel.css](../../styles/backgrounds/Gel.css), event contracts [../../js/choreography/config/contracts/events/events.js](../../js/choreography/config/contracts/events/events.js).

## Intent

From the user's perspective the section reads as a light card that, on entry, gains a second colored panel slipping into place slightly askew behind it. On exit, that panel retreats. The "light card" is not a section background — it is a gel layer; the askew panel is a second gel layer. The section element itself is transparent.

### State model

| State | User perception | Implementation |
| --- | --- | --- |
| **init** | Section content on a light background. | Section background is transparent. **Backing gel** (neutral gradient) sits beneath the section, matching its position and dimensions. **Accent gel** (accent gradient) sits offscreen to the **bottom-right**, rotated `-5°`, with a z-index one step above the backing gel. |
| **intro** | A second panel slides in and settles slightly askew behind the card. | Accent gel animates from bottom-right to align with the section's position and dimensions — but **retains its `-5°` rotation**. End state: two stacked gels behind the section, the upper one askew. |
| **outro** | The askew panel retreats offscreen. | Intro reverses: accent gel returns to its offscreen bottom-right, rotated start. Backing gel is unchanged. |

## Motion Principles

- **Two layers, one askew.** The composition is exactly two gels: a flush backing layer and an offset accent layer. Rotation is the signature — it is set once and never animated.
- **Position animates, rotation does not.** The intro tweens the accent gel's translation/scale to register with the section box; `rotate(-5deg)` (default transform-origin) is constant across init → intro → outro.
- **Both gels track the section.** As the section scrolls through the viewport, both the backing and accent gels stay locked to its box, not to fixed viewport fractions.
- **Transform/opacity-class motion only.** Move the accent gel with `x`/`y` (and scale if matching by transform); avoid animating `width`/`height`/`top`/`left` per-frame where a transform achieves the same result. Layout-property tweening is permitted only at refresh-time geometry sync, not during scrub.
- **Section-relative geometry.** Unlike the viewport-normalized `GEL_ARRANGEMENTS` schema, this sequence positions gels against the **section element's box**, measured at its in-view rest position. See [Decisions](#decisions).
- **Reversible.** Outro is the literal reverse of intro — same easing family, no bespoke exit curve.

## Primitives & Utilities

- **Gel instances.** Add **two new** `.bg-gel` elements in [sizzle-background.njk](../../views/molecules/background/sizzle-background.njk) dedicated to this section — do **not** reuse `bg-gel-0`…`bg-gel-4`, which other sections animate. Proposed:
  - `bg-gel-5` → **backing gel**, `bg-gel-neutral`
  - `bg-gel-6` → **accent gel**, `bg-gel-accent`
- **Color.** Use the existing gradient color classes: `bg-gel-neutral` (`neutral-900→400`) for the backing gel and `bg-gel-accent` (`accent-900→600`) for the accent gel. No flat-color treatment needed.
- **Composition pattern.** Follow the established **Hero precedent**: `HeroAnimations` receives an injected `gelManager` and composes `bg-gel-0` directly into its intro/outro GSAP timelines (`gelManager.getGel("bg-gel-0").view`). `AwardsAnimations` should accept the same `options.gelManager` and compose the accent gel into `_buildIntro`/`_buildOutro`.
- **Timing/easing.** Source from a new `AWARDS_GEL_*` block alongside `AWARDS_ANIMATION_DEFAULTS` in [ix/motion/motion.js](../../js/choreography/config/ix/motion/motion.js); reuse the section's existing `ease.in` / `ease.out` families for parity with the header intro.

## Patterns by Component/View

- **Section element** (`#recognition`, `[data-scroll-section]`): background becomes transparent. The current `bg-accent-500` utility on the section is **removed** and superseded by the accent gel layer.
- **Backing gel** (`bg-gel-5`, `bg-gel-neutral`): positioned and sized to the section box; no rotation; lower z-index. Stays locked to the section box as it scrolls. No intro/outro tween of its own beyond geometry tracking.
- **Accent gel** (`bg-gel-6`, `bg-gel-accent`): `rotate(-5deg)` (default origin) set at init and held constant; z-index one step above the backing gel; offscreen to the bottom-right at init; tweened into section registration on intro and back out on outro. Once registered, it also stays locked to the section box as it scrolls.
- **Layer order:** backing gel < accent gel < section content. Both gels remain behind the transparent section content. The existing `.bg-pixelator` overlay and other `bg-gel-*` instances must not occlude this composition while Awards is the active arrangement.

## Event Orchestration

- **Source events** (already defined in [events.js](../../js/choreography/config/contracts/events/events.js)): `awards.enter` / `awards.exit`, with finer-grained `awards.introStart` / `introComplete` / `outroStart` / `outroComplete` available for sequencing.
- **Init** is established when the Awards arrangement is applied (the section's gels are placed in their start state: backing flush, accent offscreen+rotated). This supersedes the current viewport-normalized `awards` entry in `GEL_ARRANGEMENTS`, which uses four multiply-blended gels and must be reconciled (see Decisions).
- **Intro** plays on section enter (or `introStart`); **outro** plays on exit (or `outroStart`) as the reverse.
- **Scroll tracking:** both gels stay locked to the section box for the duration of its scroll travel — a scroll-linked (scrubbed) track keeps the backing gel flush and the registered accent gel in step. On `ScrollTrigger.refresh()` / resize, re-measure the section box and recompute the track so placement stays accurate.

## Performance & Budget

- Target 60fps. The accent gel transition is a single tween on transform; backing gel is static.
- O(2) gels touched per Awards enter/leave — negligible cost.
- Avoid per-frame `getBoundingClientRect()` reads during scrub; measure once at refresh and drive motion from cached geometry (mirrors the Hero release-phase pattern in the gel arrangements spec).
- Batch the geometry write so backing + accent placement happen in one layout pass.

## Accessibility

- **Reduced motion:** no intro/outro motion. Render the rest state immediately — backing gel flush, accent gel in its aligned-but-askew end position (still `-5°`), set via `gsap.set()` not `gsap.to()`. Per the [motion accessibility policy](motion-accessibility-policy.md), the askew end-state is the static composition; the offscreen bottom-right start is motion-only.
- Gels are `aria-hidden="true"` and `pointer-events: none` — purely decorative; no focus or keyboard impact.
- Color treatment must preserve text contrast: section text is `text-black`; verify the neutral backing and accent gradients keep body/heading text within WCAG AA.

## Testing & Validation

- Entering Awards slides the accent gel in from the bottom-right and settles it askew behind the section; leaving retreats it; re-entering replays cleanly (no stuck/offscreen state).
- Rotation is `-5°` in init, intro end, and outro start — confirm it is never tweened.
- Both gels remain locked to the section box throughout its scroll travel and across resize / `ScrollTrigger.refresh()`.
- Reduced motion: composition is fully visible (askew accent + flush backing) with no animation.
- No layout thrash / long tasks during the Awards transition or scroll track (perf trace).
- Visual: section background is transparent (no residual `bg-accent-500`); the two new gels do not leak into other sections, and other `bg-gel-*` do not leak into the Awards backing.
- Contrast check on heading/body/subheading text over the new gel colors.

## Decisions

- **Compose via injected `gelManager`, not the arrangement map alone.** The viewport-normalized `GEL_ARRANGEMENTS` schema cannot express section-relative geometry, rotation, or scroll-locked tracking. Following the Hero precedent, `AwardsAnimations` takes `options.gelManager` and composes the two gels into its intro/outro timelines and scroll track. The arrangement entry is reduced to the init placement (backing flush, accent offscreen bottom-right).
- **Section-relative, scroll-locked geometry.** Both gels are placed against the section element's measured box and stay locked to it for the section's full scroll travel, re-measured on refresh/resize — not against viewport fractions.
- **Rotation is state, not motion.** `-5°` (default transform-origin) is applied at init and held; only translation/scale animates.
- **Two new dedicated gels.** Add `bg-gel-5` (neutral backing) and `bg-gel-6` (accent) rather than reusing `bg-gel-0`/`bg-gel-1`, so other sections' gel animations are untouched. Colors use the existing `bg-gel-neutral` / `bg-gel-accent` gradient classes.
- **Offscreen entry from bottom-right.** The accent gel's motion-only start is off the bottom-right corner; the intro travels it up-and-left into registration.
- **Section background removed.** The section's `bg-accent-500` utility is replaced by the accent gel layer so the gel composition is the sole source of the colored backing.

## Open Questions

- **Reconcile with existing `awards` arrangement.** The current `GEL_ARRANGEMENTS.awards` uses `bg-gel-0..3` with `multiply` blend. This two-gel design supersedes it — confirm removal vs. coexistence and update [arrangements.js](../../js/choreography/config/displays/arrangements/arrangements.js). (Implementation-time cleanup; does not block design sign-off.)
