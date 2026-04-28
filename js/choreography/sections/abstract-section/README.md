# Abstract Section Controller

This is the class extended by section controllers.

## The Abstract Class concept

An abstract class provides a blueprint or template for other classes, defining common properties and methods but never instantiated into an object itself; it enforces a structure by requiring subclasses to implement its abstract (unimplemented) methods, ensuring shared functionality and consistent design for related classes.

An abstract class helps you out by:

- Providing a template. It defines common attributes and methods that all its subclasses must have.
- Enforcing structure. It requires subclasses to implement specific abstract methods, ensuring consistency and predictability.
- Supplying reusable code. It allows common, fully-implemented methods and fields to be shared, reducing code duplication.
- Establishing hierarchy. It creates a clear base for related classes, defining what they are (e.g., an Animal) without being a concrete thing itself.
- Enable polymorphism. It lets you treat different subclasses (like Dog, Cat) as their abstract base type (Animal), enabling common operations.

## The role of AbstractSection

The interaction design for the landing page experience centers on event coordination between section elements on the site's homepage. An event broadcast by one section will trigger a response from other sections and other design elements on the page. The abstract class pattern simplifies the task of creating and managing these relationships.

### AbstractSection

Defines the lifecycle contract for every page section, including how intros, outros, and scroll triggers are orchestrated. It centralizes event broadcasting so choreography logic can react without sections talking to each other directly. Designers can rely on consistent hooks for sequencing interactions across the experience, including dedicated back-scroll hooks like `onEnterBack` when present in a section event contract.

### AbstractSectionAnimations

Provides shared timeline playback and registration helpers while each section owns direct references to landing, intro, idle, and outro timelines. It also includes reusable item-reveal helpers (`_showAllItems`, `_revealItemsOnScroll`) to reduce repeated viewport-threshold animation code across sections.

### AbstractSectionTrigggers

Handles the scroll and viewport detection that decides when a section should animate. It abstracts away ScrollTrigger setup so designers only specify the desired thresholds and behaviors. The result is predictable, reusable trigger logic across all sections.

## Implementing the AbstractSection pattern

Use AbstractSection subclasses when you need section controllers that plug into the choreography system, emitting standardized intro/outro events and controlling its DOM slice via GSAP timelines.

### Creating an AbstractSection subclass

An abstract class is never instantiated on its own, only its descendents. You implement the pattern by creating a subclass and integrating the subclass into the event system.

1. Build a class extending AbstractSectionAnimations to define intro/outro timelines. Required imports:

- - import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
- - import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

2. Optionally build a class extending AbstractSectionTrigggers for ScrollTrigger setup.

- - import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js';

3. Build the main entrypoint class extending AbstractSection, wire the animations/triggers, and register lifecycle handlers.

- - import { AbstractSection } from '../abstract-section/AbstractSection.js';
- - import { EVENTS } from '../../config/events.js';
- - import { SELECTORS, ANIMATION_DEFAULTS } from '../../config/index.js';

### Implementing the AbstractSection

See the Hero class for a good supply of code snippets.

- Instantiate the new subclass with two params:
- - the section's root selector defined by the SELECTORS object in config/index.js
- - the shared AnimationBus.
- Ensure that the required event and runtime config entries exist and are used
- - the AbstractSection subclass is dependent upon config/events.EVENTS for broadcasting events recognized by the choreography system
- - the AbstractSectionAnimations subclass relies on config/runtime.ANIMATION_DEFAULTS for animation values
- - the AbstractSectionTrigggers subclass uses config/runtime.SCROLL_DEFAULTS to define scroll trigger values
