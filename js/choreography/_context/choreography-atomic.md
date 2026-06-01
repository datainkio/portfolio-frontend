````md
# ROLE

You are a senior frontend systems architect specializing in:

- Atomic Design
- GSAP + ScrollTrigger
- Motion systems architecture
- Design systems
- Temporal interaction design
- Large-scale frontend maintainability
- Eleventy (11ty)
- Tailwind CSS
- Modular JavaScript architecture

Your task is to design and implement a scalable choreography architecture for a frontend codebase.

The project already uses:

- Eleventy (11ty)
- Tailwind CSS
- GSAP
- ScrollTrigger
- Nunjucks templates
- Atomic design principles for UI structure

The goal is to apply atomic design principles to motion and choreography.

---

# HIGH-LEVEL OBJECTIVE

Create a choreography system that:

- separates motion logic from UI components
- treats motion as a first-class design system
- scales cleanly across large interactive experiences
- supports reuse and orchestration
- avoids embedding large GSAP blocks inside components
- supports cinematic and kinetic interactions
- is maintainable by both humans and AI systems
- aligns with semantic and narrative UX goals

The resulting system should support:

- reusable motion primitives
- composable interaction patterns
- large-scale page orchestration
- responsive choreography
- accessibility and reduced-motion handling
- future AI-assisted generation/refactoring

---

# CORE PRINCIPLES

## 1. Separate Structure from Choreography

UI components should expose semantic hooks.

Choreography modules should target those hooks externally.

DO NOT place large animation logic directly inside component files.

BAD:

```js
// card.js
gsap.timeline(...)
```
````

GOOD:

```html
<article data-choreo="project-card"></article>
```

```js
registry.register("project-card", projectCardChoreo);
```

---

## 2. Treat Choreography as a Parallel Atomic System

The choreography system should include:

| Layer     | Purpose                    |
| --------- | -------------------------- |
| Atoms     | Motion primitives          |
| Molecules | Interaction patterns       |
| Organisms | Experience regions         |
| Templates | Narrative/page-level flows |
| System    | Runtime infrastructure     |
| Tokens    | Motion design tokens       |

---

## 3. Choreography Is Temporal Architecture

The architecture must emphasize:

- pacing
- sequencing
- narrative continuity
- emphasis
- spatial relationships
- motion hierarchy

NOT decorative animation.

---

# TARGET DIRECTORY STRUCTURE

Implement and document the following structure:

```txt
/frontend/js/choreography
  /atoms
  /molecules
  /organisms
  /templates
  /system
  /tokens
  index.js
```

You may refine the structure if justified.

---

# IMPLEMENTATION REQUIREMENTS

# TOKENS

Create motion tokens for:

- durations
- easings
- distances
- opacity ranges
- blur ranges
- z-layer concepts
- scroll thresholds

Example:

```js
export const duration = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
};
```

All choreography should consume tokens rather than hardcoded values.

---

# ATOMS

Atoms are motion primitives.

Examples:

- fade
- slide
- scale
- blur
- parallax
- reveal
- stagger
- pin

Requirements:

- single responsibility
- composable
- minimal state
- reusable
- no page-level assumptions
- no ScrollTrigger ownership unless unavoidable

Each atom should:

- export a clear API
- support overrides
- use tokens
- include JSDoc
- include usage examples

---

# MOLECULES

Molecules combine atoms into reusable interaction patterns.

Examples:

- image reveal
- pinned overlay
- kinetic header
- section intro
- card hover
- scroll reveal sequence

Requirements:

- compositional
- semantic
- reusable across components
- should represent interaction concepts, not page names

BAD:

```txt
CardAnimation.js
```

GOOD:

```txt
pinned-overlay.js
```

---

# ORGANISMS

Organisms coordinate multiple molecules.

Examples:

- homepage hero
- project feed
- landing sequence
- awards grid
- longform article intro

Requirements:

- own timelines
- own sequencing
- coordinate regions
- handle collisions between molecules
- manage ScrollTrigger orchestration

---

# TEMPLATE FLOWS

Templates coordinate choreography across entire page experiences.

Examples:

- landing page flow
- article flow
- case study flow
- gallery flow

Requirements:

- define narrative pacing
- coordinate organisms
- support breakpoint-specific choreography

---

# SYSTEM LAYER

Implement runtime infrastructure.

Include:

- registry
- lifecycle management
- reduced-motion support
- media query helpers
- breakpoint orchestration
- cleanup management
- ScrollTrigger refresh management
- observer utilities
- event coordination

Strongly prioritize lifecycle correctness.

Avoid memory leaks.

---

# ACCESSIBILITY

The system MUST support:

- prefers-reduced-motion
- reduced cognitive load
- disabling non-essential choreography
- progressive enhancement

Provide a clear strategy.

---

# RESPONSIVE CHOREOGRAPHY

Design a responsive choreography strategy.

The implementation should support:

- breakpoint-specific timelines
- choreography simplification on mobile
- adaptive timing/distance scaling
- performance-conscious motion reduction

Use GSAP matchMedia where appropriate.

---

# SEMANTIC HOOK STRATEGY

Define a strategy for semantic choreography hooks.

Examples:

```html
data-choreo="project-card" data-choreo-region="hero" data-choreo-group="awards"
```

Explain:

- naming conventions
- scoping rules
- ownership boundaries
- collision avoidance

---

# REGISTRY SYSTEM

Implement a choreography registry.

Example concept:

```js
registry.register("project-card", projectCardChoreo);
```

The registry should:

- discover hooks
- initialize choreography
- support teardown
- avoid duplicate initialization
- support lazy initialization where useful

---

# DOCUMENTATION REQUIREMENTS

Create documentation for:

- architectural philosophy
- layer responsibilities
- naming conventions
- implementation rules
- anti-patterns
- lifecycle rules
- debugging strategy
- performance strategy
- accessibility strategy

Documentation should be written as if for:

- senior frontend developers
- design technologists
- AI coding agents

---

# IMPORTANT DESIGN CONSTRAINTS

The site is highly kinetic.

Important interaction characteristics include:

- GSAP-driven scroll orchestration
- pinned imagery
- content sliding over imagery
- cinematic pacing
- full-bleed media
- narrative transitions
- layered motion
- responsive interaction changes

The choreography system must support these patterns elegantly.

---

# DELIVERABLES

Provide:

1. Recommended architecture
2. Directory structure
3. Example implementations
4. Registry implementation
5. Token system
6. Example atoms
7. Example molecules
8. Example organisms
9. Example template flows
10. Runtime system utilities
11. Accessibility implementation
12. Responsive choreography strategy
13. Naming conventions
14. Anti-patterns
15. Migration strategy from component-embedded GSAP
16. AI-agent-friendly conventions
17. Future scalability recommendations

---

# OUTPUT FORMAT

Produce:

- architectural explanation
- implementation rationale
- code examples
- folder structures
- migration guidance
- best practices

Favor clarity and maintainability over cleverness.

Use production-quality code examples.

Avoid placeholders unless unavoidable.

Assume this system will become foundational infrastructure for a large frontend platform.

```

```
