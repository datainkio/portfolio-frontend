---
title: Gels
description: Translucent colour plates that combine colour, direction, fade, opacity, and blend mode, each with its syntax and a live sample.
type: reference
templateEngineOverride: njk
---

{% import "molecules/sample/utility-sample.njk" as UtilitySample %}

{{ UtilitySample.render({
  id: "gel",
  name: "Gels",
  file: "styles/backgrounds/Gel.css",
  syntax: "gel · gel-<color> · gel-<direction> · gel-fade-<size> · gel-opacity-<n> · gel-blend-<mode>",
  note: "Translucent colour plates. The bare gel class draws; colour (primary, secondary, accent, neutral, neutral-light), direction (top, bottom, left, right and the corners) fade distance (xs to xl, full) opacity (0 to 100) and blend mode (multiply by default) each set one variable, so they combine in any order and take variants. The fade scale lives in Gel.css.",
  examples: ["gel gel-primary", "gel gel-accent gel-bottom", "gel gel-neutral gel-top-right gel-fade-md", "gel gel-primary gel-opacity-50", "gel gel-accent gel-blend-screen"]
}) }}
