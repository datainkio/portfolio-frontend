/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.blockframes
 *   role: Frontend runtime module: js/displays/blockframes/Blockframes.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - blockframes
 * ---
 */
/**
 * @fileoverview Blockframes - SVG composition and manipulation system
 *
 * CRITICAL: This is the main controller class that orchestrates SVG loading,
 * manipulation, styling, and animation. It serves as the primary API for
 * the entire blockframes system.
 *
 * ARCHITECTURE:
 * - Loads external SVG files via fetch API
 * - Delegates styling to Painter.js (colors, palettes)
 * - Delegates DOM manipulation to Builder.js (cloning, insertion)
 * - Delegates animations to Animator.js (GSAP timelines)
 * - Manages SVG document state and responsive behavior
 *
 * DEPENDENCIES:
 * - GSAP: Animation engine (must be loaded before instantiation)
 * - Builder.js: DOM manipulation utilities
 * - Painter.js: Color application and styling
 * - Animator.js: Animation presets and timelines
 *
 * SVG STRUCTURE REQUIREMENTS:
 * - Must contain a `.Blocks` container element
 * - Blocks should use atomic design classes (atoms, molecules, organisms, templates)
 * - Elements should have semantic class names for selector targeting
 *
 * @example
 * // Basic usage
 * const blockframes = new Blockframes('/assets/svg/components.svg');
 * await blockframes.load();
 * blockframes.makeResponsive();
 * blockframes.insertInto(document.querySelector('#container'), blockframes.svgElement);
 *
 * @example
 * // With styling and animation
 * const blockframes = new Blockframes('/assets/svg/templates.svg');
 * await blockframes.load();
 *
 * const palette = {
 *   primary: { base: '#FF6B6B', light: '#FFE0E0', dark: '#CC5555', DEFAULT: '#FF6B6B' },
 *   neutral: { base: '#666', light: '#F5F5F5', dark: '#333', DEFAULT: '#666' }
 * };
 *
 * blockframes.paintAll(palette);
 * const card = blockframes.getBlock('.Card');
 * blockframes.paintBlock(card, palette);
 *
 * const timeline = blockframes.animateBlock(card);
 * timeline.play();
 */

import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
import * as Builder from './Builder.js';
import * as Painter from './Painter.js';
import * as Animator from './Animator.js';

/**
 * Blockframes - SVG composition and manipulation system
 *
 * Main controller class that provides a unified API for loading, styling,
 * and animating SVG components using the atomic design pattern.
 *
 * @class
 */
export default class Blockframes {
  /**
   * Creates a new Blockframes instance
   *
   * CRITICAL: Does NOT automatically load the SVG. You MUST call `await load()`
   * after instantiation before using any other methods.
   *
   * @param {string} url - Absolute or relative URL to the SVG file
   *
   * @throws {Error} Will throw during load() if URL is invalid or fetch fails
   *
   * @example
   * const blockframes = new Blockframes('/assets/svg/components.svg');
   * // At this point, blockframes.svgElement is null!
   * await blockframes.load(); // Now it's populated
   */
  constructor(url) {
    /** @type {string} URL of the SVG file to load */
    this.url = url;

    /** @type {SVGElement|null} The loaded SVG element (null until load() completes) */
    this.svgElement = null;

    /** @type {gsap.core.Timeline} GSAP timeline for coordinated animations */
    this.timeline = gsap.timeline({});
  }

  /**
   * Loads the SVG file from the URL provided in the constructor
   *
   * CRITICAL: This method MUST be called and awaited before using any other
   * methods that interact with the SVG element. It:
   * 1. Fetches the SVG file as text
   * 2. Parses the text into an SVG DOM element
   * 3. Validates the parsed content is valid SVG
   * 4. Stores the result in this.svgElement
   *
   * ERROR HANDLING:
   * - Network errors (404, 500, etc.) throw with status details
   * - Invalid SVG content throws with validation error
   * - CORS issues will throw fetch errors
   *
   * DEBUGGING:
   * - Check browser console for "Error loading SVG from {url}" messages
   * - Verify URL is correct and file exists
   * - Ensure server allows CORS if loading from different domain
   * - Confirm file contains valid XML/SVG syntax
   *
   * @async
   * @returns {Promise<SVGElement>} The loaded and parsed SVG element
   *
   * @throws {Error} If fetch fails (network error, 404, etc.)
   * @throws {Error} If response is not OK (non-2xx status code)
   * @throws {Error} If parsed content is not a valid SVG element
   *
   * @example
   * const blockframes = new Blockframes('/assets/svg/components.svg');
   *
   * try {
   *   const svg = await blockframes.load();
   *   console.log('SVG loaded:', svg);
   *   // Now safe to use other methods
   * } catch (error) {
   *   console.error('Failed to load SVG:', error);
   *   // Handle error (show fallback, retry, etc.)
   * }
   */
  async load() {
    try {
      // Fetch the SVG file as text
      const response = await fetch(this.url);

      // Check if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG. Status: ${response.status} ${response.statusText}`);
      }

      // Get the response text (the SVG content)
      const svgText = await response.text();

      // Parse the SVG text into an SVG document
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      // Extract the SVG element from the document
      this.svgElement = svgDoc.documentElement;

      // Check if the parsed content is a valid SVG element
      if (this.svgElement.nodeName !== 'svg') {
        throw new Error('The fetched content is not a valid SVG element.');
      }

      // Return the SVG element for potential further use
      return this.svgElement;
    } catch (error) {
      // Log the error with more context
      console.error(`Error loading SVG from ${this.url}:`, error);

      // Rethrow the error to let the caller handle it
      throw error;
    }
  }

  /**
   * Creates a CSS Grid layout container (utility method)
   *
   * WARNING: This method creates a DOM grid container, NOT an SVG grid.
   * For SVG grid layouts, use layouts/Grid.js instead.
   *
   * USAGE: Primarily used for creating visual grid mockups or testing
   * color palettes in a grid format.
   *
   * PERFORMANCE: Uses DocumentFragment for batch DOM insertion to minimize reflows.
   *
   * @param {number} rows - Number of grid rows
   * @param {number} cols - Number of grid columns
   * @param {string[]} colors - Array of color values (hex, rgb, etc.)
   *
   * @returns {HTMLDivElement} A div element configured as CSS Grid
   *
   * @example
   * const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
   * const grid = blockframes.makeGrid(3, 3, palette);
   * document.body.appendChild(grid);
   * // Creates a 3x3 grid with cycling colors
   */
  makeGrid(rows, cols, colors) {
    const grid = document.createElement('div');
    const totalCells = rows * cols;
    const colorCount = colors.length;

    // Set grid properties
    grid.classList.add('grid');
    Object.assign(grid.style, {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '1px',
    });

    // Use DocumentFragment for batch insertion (prevents multiple reflows)
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.style.backgroundColor = colors[i % colorCount];
      fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
    return grid;
  }

  /**
   * Makes the SVG responsive by setting viewBox and removing fixed dimensions
   *
   * CRITICAL: This method modifies the SVG element to use viewBox-based scaling
   * instead of fixed width/height attributes. This allows the SVG to:
   * - Scale proportionally with its container
   * - Maintain aspect ratio
   * - Respond to container size changes
   *
   * WHAT IT DOES:
   * 1. Removes width/height attributes (enables fluid sizing)
   * 2. Sets/preserves viewBox attribute (defines coordinate system)
   * 3. Sets preserveAspectRatio to "xMidYMid meet" (centered, proportional)
   * 4. Adds Tailwind classes: w-full h-full (100% of container)
   *
   * WHEN TO CALL:
   * - After load() completes
   * - Before insertInto() if responsive behavior is needed
   * - When converting fixed-size SVGs to fluid layouts
   *
   * WARNING: If SVG already has a viewBox, this preserves it. If not,
   * it attempts to infer from width/height attributes (defaults to "0 0 100 100").
   *
   * PERFORMANCE: Batches attribute changes to minimize reflows.
   *
   * @returns {void}
   *
   * @example
   * const blockframes = new Blockframes('/assets/svg/components.svg');
   * await blockframes.load();
   * blockframes.makeResponsive(); // Now scales with container
   * blockframes.insertInto(document.querySelector('#responsive-container'), blockframes.svgElement);
   *
   * @example
   * // CSS container sizing
   * #responsive-container {
   *   width: 100%;
   *   max-width: 800px;
   *   height: 400px;
   * }
   * // SVG will scale to fit while maintaining aspect ratio
   */
  makeResponsive() {
    const svg = this.svgElement;

    // Capture dimensions before removal (if viewBox needs to be inferred)
    if (!svg.hasAttribute('viewBox')) {
      const width = svg.getAttribute('width') || '100';
      const height = svg.getAttribute('height') || '100';
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    // Batch attribute changes to minimize reflows
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.add('w-full', 'h-full');
  }

  /**
   * Inserts an SVG element into a DOM container
   *
   * SIMPLE WRAPPER: This is a convenience method that wraps appendChild.
   * You can also use container.appendChild(svg) directly.
   *
   * TYPICAL USAGE: Called after load() and makeResponsive() to add the
   * SVG to the page.
   *
   * @param {HTMLElement} container - The DOM element to insert the SVG into
   * @param {SVGElement} svg - The SVG element to insert
   *
   * @returns {void}
   *
   * @example
   * const blockframes = new Blockframes('/assets/svg/components.svg');
   * await blockframes.load();
   * blockframes.makeResponsive();
   * blockframes.insertInto(
   *   document.querySelector('#svg-container'),
   *   blockframes.svgElement
   * );
   */
  insertInto(container, svg) {
    container.appendChild(svg);
  }

  /**
   * Gets an array of all block elements from the SVG
   *
   * CRITICAL SVG STRUCTURE REQUIREMENT:
   * - SVG MUST contain an element with class "Blocks"
   * - This container holds all block components (atoms, molecules, organisms, templates)
   * - Each child of .Blocks is considered a "block" (component instance)
   *
   * WHAT IS A BLOCK:
   * A "block" is a single component instance with a semantic class name:
   * - `.Card` - A card component
   * - `.Article` - An article template
   * - `.Button` - A button atom
   *
   * PERFORMANCE OPTIMIZATION:
   * - Uses Array.from() for clean array conversion
   * - Caches querySelector result to avoid redundant DOM traversal
   * - Direct array return (no intermediate forEach needed)
   *
   * ERROR HANDLING:
   * Will throw if .Blocks element doesn't exist in the SVG.
   * Always ensure your SVG has the required structure:
   *
   * <svg>
   *   <g class="Blocks">
   *     <g class="Card">...</g>
   *     <g class="Button">...</g>
   *   </g>
   * </svg>
   *
   * @returns {SVGElement[]} Array of block elements
   *
   * @throws {TypeError} If .Blocks element doesn't exist
   *
   * @example
   * const blockframes = new Blockframes('/assets/svg/components.svg');
   * await blockframes.load();
   *
   * const blocks = blockframes.inventory;
   * console.log(`Found ${blocks.length} blocks`);
   *
   * blocks.forEach(block => {
   *   console.log('Block type:', block.classList[0]);
   *   blockframes.paintBlock(block, palette);
   * });
   */
  get inventory() {
    const blocksContainer = this.svgElement.querySelector('.Blocks');
    if (!blocksContainer) {
      throw new TypeError('SVG must contain a .Blocks container element');
    }
    return Array.from(blocksContainer.children);
  }

  /**
   * Gets a specific block element by CSS selector
   *
   * WRAPPER METHOD: Shorthand for this.svgElement.querySelector(type)
   *
   * SELECTOR TYPES:
   * - Class selector: '.Card' - Gets first element with class "Card"
   * - ID selector: '#hero' - Gets element with id "hero"
   * - Descendant: '.Article .Image' - Gets Image inside Article
   * - Any valid CSS selector works
   *
   * RETURNS NULL: If no matching element is found (standard querySelector behavior)
   *
   * @param {string} type - CSS selector string
   *
   * @returns {SVGElement|null} The matching SVG element, or null if not found
   *
   * @example
   * const card = blockframes.getBlock('.Card');
   * if (card) {
   *   blockframes.paintBlock(card, palette);
   * }
   *
   * @example
   * // Get nested element
   * const heroImage = blockframes.getBlock('.Article .hero.Image');
   * if (heroImage) {
   *   heroImage.setAttribute('href', '/images/hero.jpg');
   * }
   */
  getBlock(type) {
    return this.svgElement.querySelector(type);
  }

  /**
   * Applies global styling to the entire SVG element
   *
   * SCOPE: Sets attributes on the root <svg> element, NOT individual blocks.
   * For block-specific styling, use paintBlock() instead.
   *
   * CURRENT IMPLEMENTATION:
   * - Sets stroke-width to 2px (global stroke thickness)
   * - Sets fill to palette.neutral.light (background color)
   * - Stroke color is commented out (add if needed)
   *
   * USE CASE: Initial SVG setup with default styling before painting
   * individual blocks with their specific colors.
   *
   * PERFORMANCE: Batches attribute changes in single operation.
   *
   * PALETTE STRUCTURE REQUIRED:
   * {
   *   neutral: {
   *     light: '#F5F5F5',  // Used for SVG background
   *     dark: '#333333'    // Could be used for stroke (currently commented)
   *   }
   * }
   *
   * @param {Object} palette - Color palette object with neutral tones
   * @param {Object} palette.neutral - Neutral color variants
   * @param {string} palette.neutral.light - Light neutral color for fill
   * @param {string} [palette.neutral.dark] - Dark neutral for stroke (unused)
   *
   * @returns {void}
   *
   * @example
   * const palette = {
   *   primary: { base: '#FF6B6B', DEFAULT: '#FF6B6B' },
   *   neutral: { light: '#F5F5F5', dark: '#333' }
   * };
   *
   * await blockframes.load();
   * blockframes.paintAll(palette); // Sets SVG background
   * // Then paint individual blocks...
   */
  paintAll(palette) {
    const svg = this.svgElement;
    svg.setAttribute('stroke-width', 2);
    svg.setAttribute('fill', palette.neutral.light);
    // Optional: svg.setAttribute('stroke', palette.neutral.dark);
  }

  /**
   * Applies palette-based styling to a specific block element
   *
   * DELEGATION: This method delegates to Painter.js, which routes to the
   * appropriate component-specific paint function based on the block's class.
   *
   * ROUTING LOGIC (in Painter.js):
   * - Reads block's first class name (e.g., "Card", "Article", "Button")
   * - Imports corresponding paint module from atoms/molecules/organisms/templates
   * - Calls that module's paint(block, palette) function
   *
   * PALETTE STRUCTURE:
   * See Painter.js and component READMEs for full palette structure.
   * Typical palette includes:
   * {
   *   primary: { base, light, dark, DEFAULT },
   *   secondary: { base, light, dark, DEFAULT },
   *   neutral: { base, light, dark, lightest, DEFAULT },
   *   accent: { base, light, dark, DEFAULT },
   *   semantic: { success, error, warning, info, alert }
   * }
   *
   * WHAT GETS PAINTED:
   * - Background fills
   * - Stroke colors
   * - Text colors
   * - Nested element styling (recursively paints child components)
   *
   * ERROR HANDLING:
   * - Returns early if block is null/undefined (defensive programming)
   * - If no paint module exists for the block type, Painter.js will log a warning
   * - No error thrown (graceful degradation)
   *
   * @param {SVGElement} block - The block element to paint
   * @param {Object} palette - Color palette object
   *
   * @returns {void}
   *
   * @example
   * const card = blockframes.getBlock('.Card');
   * const palette = {
   *   primary: { base: '#FF6B6B', light: '#FFE0E0', dark: '#CC5555', DEFAULT: '#FF6B6B' },
   *   neutral: { base: '#666', light: '#F5F5F5', dark: '#333', DEFAULT: '#666' }
   * };
   *
   * blockframes.paintBlock(card, palette);
   *
   * @example
   * // Paint all blocks with same palette
   * blockframes.inventory.forEach(block => {
   *   blockframes.paintBlock(block, palette);
   * });
   *
   * @example
   * // Paint with different palettes
   * const hero = blockframes.getBlock('.Article');
   * const sidebar = blockframes.getBlock('.Sidebar');
   *
   * blockframes.paintBlock(hero, primaryPalette);
   * blockframes.paintBlock(sidebar, secondaryPalette);
   */
  paintBlock(block, palette) {
    if (!block) {
      console.warn('paintBlock: block is null or undefined');
      return;
    }
    Painter.block(block, palette);
  }

  /**
   * Inserts a block element into a container, optionally cloning it first
   *
   * DELEGATION: This method delegates to Builder.js for DOM manipulation.
   *
   * CLONING BEHAVIOR:
   * - clone=true (default): Creates a deep copy of the block before insertion
   *   - Original block remains in .Blocks inventory
   *   - Cloned block is inserted into container
   *   - Safe for reusing the same block multiple times
   *
   * - clone=false: Moves the original block to the container
   *   - Block is removed from .Blocks inventory
   *   - Only one instance exists
   *   - Use when you want to relocate, not duplicate
   *
   * USE CASES:
   * - Clone multiple cards from a template block (clone=true)
   * - Create instances of reusable components (clone=true)
   * - Relocate a unique element (clone=false)
   *
   * ERROR HANDLING:
   * - Returns early if block or container is null/undefined
   * - Logs warning for debugging
   *
   * IMPORTANT: Builder.js handles the actual insertion logic. See Builder.js
   * documentation for implementation details.
   *
   * @param {SVGElement} block - The block element to place
   * @param {SVGElement} container - The container element to place it in
   * @param {boolean} [clone=true] - Whether to clone before inserting
   *
   * @returns {void}
   *
   * @example
   * // Clone a card template 5 times
   * const cardTemplate = blockframes.getBlock('.Card');
   * const grid = blockframes.getBlock('.Grid');
   *
   * for (let i = 0; i < 5; i++) {
   *   blockframes.placeBlock(cardTemplate, grid, true); // Clone each time
   * }
   * // Original cardTemplate still exists in .Blocks
   *
   * @example
   * // Move a unique element (don't clone)
   * const hero = blockframes.getBlock('.HeroImage');
   * const article = blockframes.getBlock('.Article');
   *
   * blockframes.placeBlock(hero, article, false); // Move, don't clone
   * // hero is now inside article, removed from original location
   */
  placeBlock(block, container, clone = true) {
    if (!block || !container) {
      console.warn('placeBlock: block or container is null/undefined', { block, container });
      return;
    }
    Builder.insert(block, container, clone);
  }

  /**
   * Animates a block element using a preset animation
   *
   * DELEGATION: This method delegates to Animator.js, which currently uses
   * the "wipe" animation preset.
   *
   * WIPE ANIMATION:
   * The Animator.wipe() function creates a GSAP timeline that:
   * - Reveals the block with a wipe/reveal effect
   * - Returns a GSAP timeline object
   * - Can be controlled (play, pause, reverse, etc.)
   *
   * ANIMATION CONTROL:
   * The returned timeline provides full GSAP control:
   * - timeline.play() - Start animation
   * - timeline.pause() - Pause animation
   * - timeline.reverse() - Play backwards
   * - timeline.seek(time) - Jump to specific time
   * - timeline.timeScale(speed) - Change playback speed
   *
   * OTHER ANIMATIONS:
   * To use different animations, modify this method to call other
   * Animator functions or pass animation type as parameter:
   * - Animator.fade(block)
   * - Animator.slideIn(block)
   * - Animator.scale(block)
   *
   * ERROR HANDLING:
   * - Returns null if block is invalid (defensive programming)
   * - Logs warning for debugging
   *
   * GSAP DEPENDENCY:
   * Requires GSAP to be loaded (imported at top of file).
   * Timeline controls won't work if GSAP is not available.
   *
   * @param {SVGElement} block - The block element to animate
   *
   * @returns {gsap.core.Timeline|null} GSAP timeline for animation control, or null if invalid
   *
   * @example
   * const card = blockframes.getBlock('.Card');
   * const timeline = blockframes.animateBlock(card);
   *
   * // Play immediately
   * if (timeline) timeline.play();
   *
   * @example
   * // Animate with delay
   * const timeline = blockframes.animateBlock(card);
   * if (timeline) setTimeout(() => timeline.play(), 1000);
   *
   * @example
   * // Chain multiple block animations
   * const masterTimeline = gsap.timeline();
   *
   * blockframes.inventory.forEach((block, i) => {
   *   const blockTimeline = blockframes.animateBlock(block);
   *   if (blockTimeline) {
   *     masterTimeline.add(blockTimeline, i * 0.2); // Stagger by 0.2s
   *   }
   * });
   *
   * masterTimeline.play();
   *
   * @example
   * // Control animation interactively
   * const timeline = blockframes.animateBlock(card);
   * if (timeline) {
   *   playButton.addEventListener('click', () => timeline.play());
   *   pauseButton.addEventListener('click', () => timeline.pause());
   *   reverseButton.addEventListener('click', () => timeline.reverse());
   * }
   */
  animateBlock(block) {
    if (!block) {
      console.warn('animateBlock: block is null or undefined');
      return null;
    }
    return Animator.wipe(block);
  }
}
