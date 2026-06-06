# Canonical choreography patterns

## Event contract (single source)

- Standard event names live in: [js/choreography/config/events.js](../../../js/choreography/config/events.js)

## Section lifecycle + reduced motion

- Base lifecycle, event emission, and reduced-motion handling:
  - [js/choreography/system/AbstractSection.js](../../../js/choreography/system/AbstractSection.js)

## Playground harness

- Hero tuning harness (repeatable intro/outro):
  - [ia/playground/hero-playground.md](../../../ia/playground/hero-playground.md)

## Constraints to preserve

- Loose coupling via `AnimationBus` events.
- Reduced motion must still produce a coherent experience (apply end state, emit completion events).
