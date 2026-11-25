---
title: Graph paper
description: An engineering grid background coloured from the palette, with its syntax and live samples.
type: reference
templateEngineOverride: njk
---

{% import "molecules/sample/utility-sample.njk" as UtilitySample %}

{{ UtilitySample.render({
  id: "graphpaper",
  name: "Graph paper",
  file: "styles/backgrounds/Graphpapers.css",
  syntax: "bg-graphpaper-<color>[/<opacity>]",
  note: "An engineering grid with 1rem minor and 4rem major lines. The opacity modifier sets the minor grid; the major is always 1.25× it. The page body uses bg-graphpaper-accent-400.",
  examples: [
    "bg-neutral-950 bg-graphpaper-accent-400",
    "bg-neutral-950 bg-graphpaper-primary-100/10",
    "bg-neutral-50 bg-graphpaper-primary-950/10"
  ]
}) }}
