# Project Card Responsiveness

## Intent

The goal for this spec is to define a motion strategy for project cards. There will be two variants: one covering all sizes up to and including md, and everything above md.

## Success

### Variant 01 (md and below)

- The behavior of the project card is triggered by scroll events.
- When the card's figure element enters the viewport from below, it snaps into position at top-0, where it stays pinned.
- The media contained in the card's figure element appears full-bleed to the user.
- The body element for the card follows native scroll, sliding over the figure as the figure remains pinned.
- When the bottom of the card's body element is at 75% from the top of the viewport the figure's pin is released and the card scrolls offscreen.
- Up until this point the next card in the set has remained below the fold. When the bottom of the outgoing card passes the top of the viewport, the incoming card enters from below.

### Variant 02 (lg and above)

Maintain the current state.
