<!-- @format -->

# Gel Effects

Liquid-style background and transition primitives used by the effects system.

## Location

- Source: `js/effects/gel/`

## What’s Here

- `index.js` exports the public gel API for the effects package.
- `Gel.js`, `GelGeometry.js`, `GelMask.js`, `GelManipulator.js`, and `GelVisualState.js` implement the rendering + state model.

## Usage

Most consumers should import from the gel package entry:

```js
import { gel } from "./gel/index.js";
```

If you’re wiring gel into page/section transitions, start from the transitions entry points in `js/effects/Transitions.js` and the choreography system.
