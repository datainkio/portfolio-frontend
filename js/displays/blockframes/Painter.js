/** @format */

/**
 * @fileoverview Painter - Color palette application router for blockframes
 *
 * CRITICAL: This module acts as a ROUTING LAYER that delegates painting to
 * component-specific modules based on block class names.
 *
 * ARCHITECTURE:
 * - Imports ALL template paint modules (Article, Blog, Calendar, etc.)
 * - Routes blocks to appropriate paint function via switch statement
 * - Main entry point: block(blockNode, palette)
 * - Individual functions for each template type
 *
 * ROUTING LOGIC:
 * 1. Read first class name from block element
 * 2. Convert to lowercase
 * 3. Switch on class name
 * 4. Call corresponding template's paint() function
 *
 * PALETTE STRUCTURE:
 * All paint functions receive a palette object with this structure:
 * {
 *   primary: { base, light, dark, DEFAULT },
 *   secondary: { base, light, dark, DEFAULT },
 *   neutral: { base, light, dark, lightest, DEFAULT },
 *   accent: { base, light, dark, DEFAULT },
 *   semantic: { success, error, warning, info, alert }
 * }
 *
 * EXTENDING:
 * To add a new template type:
 * 1. Create template/TemplateName.js with paint() export
 * 2. Import at top: import * as TemplateName from './templates/TemplateName.js'
 * 3. Add case to switch in block() function
 * 4. Add corresponding function: export function templatename(elem, palette)
 *
 * @module Painter
 */

import * as Article from "./templates/Article.js";
import * as Basic from "./templates/Basic.js";
import * as Blog from "./templates/Blog.js";
import * as Calendar from "./templates/Calendar.js";
import * as Cart from "./templates/Cart.js";
import * as Chart from "./templates/Chart.js";
import * as Contact from "./templates/Contact.js";
import * as Features from "./templates/Features.js";
import * as Feed from "./templates/Feed.js";
import * as Landing from "./templates/Landing.js";
import * as List from "./templates/List.js";
import * as Login from "./templates/Login.js";
import * as Main from "./templates/Main.js";
import * as Map from "./templates/Map.js";
import * as Project from "./templates/Project.js";
import * as Text from "./templates/Text.js";
import * as Video from "./templates/Video.js";

/**
 * Routes a block element to its appropriate paint function
 *
 * CRITICAL: This is the main entry point for painting any block.
 * Called by Blockframes.paintBlock() and internally by other systems.
 *
 * ROUTING ALGORITHM:
 * 1. Extract first class name: blockNode.classList[0]
 * 2. Convert to lowercase for case-insensitive matching
 * 3. Switch on normalized class name
 * 4. Delegate to template-specific paint function
 * 5. Log warning if no matching template found
 *
 * CLASS NAME CONVENTION:
 * - Block must have at least one class
 * - First class MUST match a template name
 * - Case-insensitive: "Article", "article", "ARTICLE" all work
 *
 * SUPPORTED TYPES:
 * article, basic, blog, calendar, cart, chart, contact, features,
 * feed, landing, list, login, map, main, project, text, video
 *
 * ERROR HANDLING:
 * - Unrecognized types log to console: "Painter.block does not recognize '{class}'"
 * - Does NOT throw error (graceful degradation)
 * - Block remains unstyled if type unknown
 *
 * @param {SVGElement} blockNode - The block element to paint
 * @param {Object} palette - Color palette object
 *
 * @returns {void}
 *
 * @example
 * const article = blockframes.getBlock('.Article');
 * const palette = {
 *   primary: { base: '#FF6B6B', DEFAULT: '#FF6B6B' },
 *   neutral: { base: '#666', light: '#F5F5F5', DEFAULT: '#666' }
 * };
 *
 * Painter.block(article, palette);
 *
 * @example
 * // Handles case-insensitive class names
 * // All of these work:
 * <g class="Article">...</g>
 * <g class="article">...</g>
 * <g class="ARTICLE">...</g>
 */
export function block(blockNode, palette) {
  const first = blockNode.classList[0];
  if (!first) {
    console.log("Painter.block: node has no class", blockNode);
    return;
  }
  const type = first.toLowerCase();
  switch (type) {
    case "article":
      article(blockNode, palette);
      break;
    case "basic":
      basic(blockNode, palette);
      break;
    case "blog":
      blog(blockNode, palette);
      break;
    case "calendar":
      calendar(blockNode, palette);
      break;
    case "cart":
      cart(blockNode, palette);
      break;
    case "chart":
      chart(blockNode, palette);
      break;
    case "contact":
      contact(blockNode, palette);
      break;
    case "features":
      features(blockNode, palette);
      break;
    case "feed":
      feed(blockNode, palette);
      break;
    case "landing":
      landing(blockNode, palette);
      break;
    case "list":
      list(blockNode, palette);
      break;
    case "login":
      login(blockNode, palette);
      break;
    case "map":
      map(blockNode, palette);
      break;
    case "main":
      main(blockNode, palette);
      break;
    case "project":
      project(blockNode, palette);
      break;
    case "text":
      text(blockNode, palette);
      break;
    case "video":
      video(blockNode, palette);
      break;
    default:
      console.log(
        "Painter.block does not recognize '" + blockNode.classList + "'",
      );
  }
}

/**
 * TEMPLATE WRAPPER FUNCTIONS
 *
 * Each function below is a thin wrapper that delegates to the corresponding
 * template module's paint() function. These exist for:
 * 1. Named exports (allows direct import: import { article } from './Painter.js')
 * 2. Consistent API surface
 * 3. Future middleware insertion point (logging, validation, etc.)
 *
 * PATTERN:
 * export function templatename(elem, palette) {
 *   TemplateName.paint(elem, palette);
 * }
 *
 * All wrappers have identical signature:
 * @param {SVGElement} elem - The template element to paint
 * @param {Object} palette - Color palette object
 * @returns {void}
 */

/** Paints an Article template */
export function article(elem, palette) {
  Article.paint(elem, palette);
}

/** Paints a Basic template */
export function basic(elem, palette) {
  Basic.paint(elem, palette);
}

/** Paints a Blog template */
export function blog(elem, palette) {
  Blog.paint(elem, palette);
}

/** Paints a Calendar template */
export function calendar(elem, palette) {
  Calendar.paint(elem, palette);
}

/** Paints a Cart template */
export function cart(elem, palette) {
  Cart.paint(elem, palette);
}

/** Paints a Chart template */
export function chart(elem, palette) {
  Chart.paint(elem, palette);
}

/** Paints a Contact template */
export function contact(elem, palette) {
  Contact.paint(elem, palette);
}

/** Paints a Features template */
export function features(elem, palette) {
  Features.paint(elem, palette);
}

/** Paints a Feed template */
export function feed(elem, palette) {
  Feed.paint(elem, palette);
}

/** Paints a Landing template */
export function landing(elem, palette) {
  Landing.paint(elem, palette);
}

/** Paints a List template */
export function list(elem, palette) {
  List.paint(elem, palette);
}

/** Paints a Login template */
export function login(elem, palette) {
  Login.paint(elem, palette);
}

/** Paints a Main template */
export function main(elem, palette) {
  Main.paint(elem, palette);
}

/** Paints a Map template */
export function map(elem, palette) {
  Map.paint(elem, palette);
}

/** Paints a Project template */
export function project(elem, palette) {
  Project.paint(elem, palette);
}

/** Paints a Text template */
export function text(elem, palette) {
  Text.paint(elem, palette);
}

/** Paints a Video template */
export function video(elem, palette) {
  Video.paint(elem, palette);
}
