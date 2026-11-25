---
title: Registration marks
description: Corner crop marks drawn on an element's ::before, with their syntax and live samples.
type: reference
templateEngineOverride: njk
---

{% import "molecules/sample/utility-sample.njk" as UtilitySample %}

<p>For proofing marks drawn as SVG, see the print-mark atoms:
<a href="/docs/design/atoms/printmarks/trim-marks/">trim</a>,
<a href="/docs/design/atoms/printmarks/margin-bleed-marks/">margin and bleed</a>,
<a href="/docs/design/atoms/printmarks/registration-marks/">registration</a>, and
<a href="/docs/design/atoms/printmarks/ink-marks/">ink</a>.</p>

{{ UtilitySample.render({
  id: "registration-marks",
  name: "Registration marks",
  file: "styles/decorations.css",
  syntax: "registration-marks · registration-marks-<color>[/<opacity>] · registration-marks-offset-<step> · -registration-marks-offset-<step>",
  note: "Corner crop marks on ::before, in currentColor unless a colour is given. A positive offset moves them outward, a negative one inward.",
  examples: [
    "registration-marks text-neutral-300",
    "registration-marks registration-marks-primary-300 registration-marks-offset-2",
    "registration-marks registration-marks-accent-400 -registration-marks-offset-2 inner-border inner-border-neutral-600"
  ]
}) }}
