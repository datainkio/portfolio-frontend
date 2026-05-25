/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.builder
 *   role: Frontend runtime module: js/displays/blockframes/Builder.js
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
 * @fileoverview Builder - SVG DOM manipulation and isometric cityscape generation
 *
 * CRITICAL: This module has TWO distinct responsibilities:
 * 1. Generic SVG block insertion (insert function)
 * 2. Isometric city builder with buildings/stories/faces (build function)
 *
 * SVG.js DEPENDENCY:
 * - Imports SVG from Skypack CDN (@svgdotjs/svg.js@3.1.1)
 * - Used for advanced SVG manipulation (scaling, moving, bounding boxes)
 * - Provides wrapper around native SVG DOM for easier manipulation
 *
 * ARCHITECTURE:
 * - insert(): Simple block cloning/scaling for general use
 * - build(): Complex isometric city generator for specific visualization
 *
 * TAILWIND CSS:
 * - Adds w-full h-full classes for responsive SVG sizing
 * - Ensures SVG scales with container without affecting child positions
 *
 * @module Builder
 */

import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";

/**
 * Inserts a block into a container with optional cloning and auto-scaling
 *
 * CRITICAL FUNCTIONALITY:
 * 1. Optionally clones the block (or uses original)
 * 2. Wraps in SVG.js wrapper for advanced manipulation
 * 3. Scales block to fit 100x100 viewport while maintaining aspect ratio
 * 4. Positions block at origin (0, 0)
 * 5. Appends to container as responsive SVG
 *
 * SCALING LOGIC:
 * - Calculates block's bounding box (actual dimensions)
 * - Determines scale factor to fit within 100x100 viewport
 * - Uses Math.min() to maintain aspect ratio (uniform scaling)
 * - Applies scale transformation with origin at (0, 0)
 *
 * RESPONSIVE BEHAVIOR:
 * - Adds Tailwind classes: w-full h-full
 * - SVG resizes with container
 * - Child elements maintain relative positions/sizes
 *
 * SVG.js METHODS USED:
 * - SVG() - Creates new SVG container
 * - .add() - Adds element to SVG
 * - .first() - Gets first child element
 * - .bbox() - Gets bounding box (x, y, width, height)
 * - .scale() - Applies scale transformation
 * - .move() - Sets position
 * - .node - Accesses native DOM element
 *
 * @param {SVGElement} block - The SVG block to insert
 * @param {HTMLElement} container - The DOM container to insert into
 * @param {boolean} clone - Whether to clone the block (true) or move it (false)
 *
 * @returns {SVG} SVG.js wrapper object with .node property for DOM access
 *
 * @example
 * const card = blockframes.getBlock('.Card');
 * const container = document.querySelector('#grid-cell');
 *
 * // Clone and insert (preserves original)
 * const svgWrapper = Builder.insert(card, container, true);
 *
 * @example
 * // Move without cloning (removes from original location)
 * const hero = blockframes.getBlock('.Hero');
 * const article = document.querySelector('#article');
 * Builder.insert(hero, article, false);
 *
 * @example
 * // Access the native SVG element
 * const wrapper = Builder.insert(card, container, true);
 * const svgElement = wrapper.node;
 * svgElement.addEventListener('click', () => console.log('Clicked!'));
 */
export function insert(block, container, clone) {
  const blockSVG = SVG();
  const cloned = clone ? block.cloneNode(true) : block;
  blockSVG.add(cloned);

  const elem = blockSVG.first();
  // elem.untransform(); // Commented: Would remove existing transformations
  const bbox = elem.bbox();
  const vw = 100;
  const vh = 100;
  const scale = Math.min(vw / bbox.width, vh / bbox.height);

  elem.scale(scale, 0, 0);
  elem.move(0, 0);
  blockSVG.node.classList.add("w-full", "h-full"); // Let the SVG change size without impacting the size or position of the child elements

  container.appendChild(blockSVG.node);
  return blockSVG;
}

var SRC, COLOR, BW, COLS, ROWS, SIZE, ANGLE, OPACITY, TYPES, PALETTES;

/**
 * Builds an isometric cityscape visualization with multiple buildings
 *
 * CRITICAL: This is a SPECIALIZED function for creating isometric city views.
 * It generates TWO versions of the city: COLOR and BW (black & white).
 *
 * ISOMETRIC PROJECTION:
 * - Uses skewY transformations for 3D perspective
 * - Buildings have left and right faces (different skew angles)
 * - Roofs are diamond-shaped polygons
 * - Stories stack vertically within each building
 *
 * CONFIGURATION PARAMETERS (from blockline object):
 * - container: Source SVG with blockframe templates (.Chrome, .Calendar, etc.)
 * - cols: Number of buildings horizontally
 * - rows: Maximum building height (in stories)
 * - size: Size of each face/story (in pixels)
 * - angle: Skew angle for isometric projection (degrees)
 * - opacity: Opacity for certain elements
 * - types: Array of blockframe types to use (Calendar, Article, Landing, etc.)
 * - palettes: Color palettes for painting faces
 *
 * BUILD PROCESS:
 * 1. Create two SVG containers (COLOR and BW)
 * 2. Add to temporary hidden DOM element for measurement
 * 3. Generate random building heights
 * 4. For each building:
 *    a. Create building container (g element)
 *    b. For each story (floor):
 *       - Draw left and right faces
 *       - Scale and skew faces for isometric view
 *       - Add roof if top story
 *    c. Position stories vertically
 * 5. Return both SVG views
 *
 * TEMPORARY DOM MOUNTING:
 * - SVGs are added to hidden div for measurement
 * - getBBox() and getBoundingClientRect() require DOM presence
 * - Div is NOT removed (stays in document.body)
 * - [ ] CHORE: Remove temp div after build completes
 *
 * GLOBAL STATE WARNING:
 * - Uses module-level variables (SRC, COLOR, BW, etc.)
 * - Multiple calls to build() will overwrite these variables
 * - NOT thread-safe or concurrent-call safe
 *
 * @param {Object} blockline - Configuration object
 * @param {SVGElement} blockline.container - Source SVG with template blocks
 * @param {number} blockline.cols - Number of buildings (horizontal)
 * @param {number} blockline.rows - Max building height in stories
 * @param {number} blockline.size - Size of each face in pixels
 * @param {number} blockline.angle - Skew angle for isometric projection
 * @param {number} blockline.opacity - Opacity for elements
 * @param {string[]} blockline.types - Array of blockframe types
 * @param {Array} blockline.palettes - Color palettes for painting
 *
 * @returns {[SVG, SVG]} Array with [COLOR_SVG, BW_SVG] wrappers
 *
 * @example
 * const blockframes = new Blockframes('/assets/svg/templates.svg');
 * await blockframes.load();
 *
 * const config = {
 *   container: blockframes.svgElement,
 *   cols: 12,
 *   rows: 8,
 *   size: 100,
 *   angle: 24,
 *   opacity: 0.8,
 *   types: ['Calendar', 'Article', 'Landing', 'Cart', 'Contact', 'Map'],
 *   palettes: []
 * };
 *
 * const colorBwViews = Builder.build(config);
 * document.querySelector('#color-container').appendChild(colorBwViews[0].node);
 * document.querySelector('#bw-container').appendChild(colorBwViews[1].node);
 */
export function build(blockline) {
  console.log("Builder.build");
  SRC = blockline.container;
  COLS = blockline.cols;
  ROWS = blockline.rows;
  SIZE = blockline.size;
  ANGLE = blockline.angle;
  OPACITY = blockline.opacity;
  TYPES = blockline.types;
  PALETTES = blockline.palettes;
  // PALETTES = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json").then((response) => response.json());

  // Create the SVG objects that will display the blockline
  COLOR = SVG()
    .size("100%", "100%")
    .viewbox(`0 0 ${COLS * SIZE} ${ROWS * SIZE} `);
  BW = SVG()
    .size("100%", "100%")
    .viewbox(`0 0 ${COLS * SIZE} ${ROWS * SIZE} `);

  // Add them to a temporary container in the DOM so that we can measure and scale their children
  // appropriately. We'll remove it later when we call updateView.
  const tmp = document.createElement("div");
  tmp.style.position = "absolute";
  tmp.style.visibility = "hidden";
  tmp.style.width = 0;
  tmp.style.height = 0;

  tmp.appendChild(COLOR.node);
  tmp.appendChild(BW.node);
  document.body.appendChild(tmp);

  // Create building objects
  var building_id = 0;
  const b = buildings(ROWS, COLS);
  b.forEach((height) => {
    // Create an empty group node to represent the building. We'll clone this twice, then remove it
    let building = document.createElementNS("http://www.w3.org/2000/svg", "g");
    building.classList.add("building");

    // Distribute the buildings horizontally along a single value of y
    building.setAttribute(
      "transform",
      `translate(${building_id * SIZE * 2}, 0)`,
    );
    let building_color = COLOR.node.appendChild(building.cloneNode());
    let building_bw = BW.node.appendChild(building.cloneNode());

    building.remove(); // garbage collection

    // For each story in the building (aka value at the given index)
    for (var story = 0; story <= height; story++) {
      drawStory(
        [building_bw, building_color],
        building_id,
        story,
        story == height,
      );
    }
    // Increment so the buildings display properly without overlap
    building_id += 1;
  });

  // Return the populated SVGs
  return [COLOR, BW];
}

/**
 * Generates an array of random building heights
 *
 * RANDOMIZATION:
 * - Creates cols/2 buildings (half the column count)
 * - Each building gets random height from 1 to rows
 * - Uses Math.ceil() to ensure minimum height of 1
 *
 * ALTERNATIVE IMPLEMENTATIONS:
 * - Could use fixed heights: arr.push(rows) for uniform skyline
 * - Could use patterns: sine wave, stepped, clustered
 * - Could manually define: return [3, 5, 2, 8, 4, 6]
 *
 * @param {number} rows - Maximum building height (number of stories)
 * @param {number} cols - Total columns (buildings = cols/2)
 *
 * @returns {number[]} Array of building heights (one per building)
 *
 * @example
 * const heights = buildings(8, 12);
 * // heights = [4, 2, 7, 1, 5, 3] (6 buildings for 12 cols)
 */
function buildings(rows, cols) {
  var arr = [];
  for (var c = 0; c < cols / 2; c++) {
    var h = Math.ceil(Math.random() * rows);
    arr.push(h);
  }
  return arr;
}

/**
 * Draws a single story (floor) of a building with left and right faces
 *
 * CRITICAL ISOMETRIC CONSTRUCTION:
 * - Each story has TWO faces: left and right (for 3D effect)
 * - Each face is cloned into BW and COLOR versions
 * - Faces are scaled and skewed for isometric projection
 * - Top story gets a roof element
 *
 * STORY STRUCTURE:
 * <g class="story story-{s}">
 *   <g class="face"> (left face) </g>
 *   <g class="face"> (right face) </g>
 *   <polygon class="roof"> (if top story) </polygon>
 * </g>
 *
 * POSITIONING:
 * - x = SIZE/2 (centers in building column)
 * - y = (ROWS - s + 1) * SIZE (stacks stories vertically)
 * - +1 prevents top story from being cropped
 *
 * SHADING:
 * - Right face gets brightness filter (lighter appearance)
 * - Creates depth perception in isometric view
 *
 * @param {SVGElement[]} building - Array of [bw_building, color_building] elements
 * @param {number} b - Building ID (index)
 * @param {number} s - Story number (0 = ground floor)
 * @param {boolean} r - Whether this is the roof story (add roof element)
 *
 * @returns {void}
 *
 * @example
 * // Called internally by build() function
 * drawStory([building_bw, building_color], 0, 3, false); // 4th floor, no roof
 * drawStory([building_bw, building_color], 0, 5, true);  // 6th floor, with roof
 */
function drawStory(building, b, s, r) {
  // Each story has a neutral and a color version
  let story_bw = document.createElementNS("http://www.w3.org/2000/svg", "g");
  story_bw.classList.add("story");
  story_bw.classList.add("story-" + s);
  let story_color = document.createElementNS("http://www.w3.org/2000/svg", "g");
  story_color.classList.add("story");
  story_color.classList.add("story-" + s);

  // Add the story to the building so that we can access its dimensions
  building[0].appendChild(story_bw);
  building[1].appendChild(story_color);

  // Draw the left and right faces of the story
  var face_left = drawFace(s, 0);
  var face_right = drawFace(s, 1);

  // scaleFace(face_left);
  // scaleFace(face_right);

  // Add the faces of the story
  story_bw.appendChild(face_left[0]);
  story_color.appendChild(face_left[1]);
  story_bw.appendChild(face_right[0]);
  story_color.appendChild(face_right[1]);

  // Do we need to add a roof?
  if (r) {
    story_bw.appendChild(roof());
    story_color.appendChild(roof());
  }

  // Scale the faces
  scaleFace(face_left, 0);
  scaleFace(face_right, 1);

  // Size things to suit
  // Style one of the faces to provide a bit of shadow relative to the other
  // face_right[0].setAttribute("opacity", ".5");
  face_right[1].setAttribute("filter", "url(#brightness)");

  // Set the xy coords for the story to position it within a given building
  let x = SIZE / 2; // makes sure it's in the right building
  let y = (ROWS - s + 1) * SIZE; // places it at the right floor (+1 ensures that the top doesn't get cropped. I don't know why.)
  story_bw.setAttribute("transform", `translate(${x}, ${y})`);
  story_color.setAttribute("transform", `translate(${x}, ${y})`);
}

/**
 * Creates a diamond-shaped roof polygon for the top of a building
 *
 * GEOMETRY:
 * - Diamond shape with 4 vertices
 * - Width = SIZE * 2
 * - Height calculated using tan(ANGLE): h = width * tan(angle)
 * - Centered on building
 *
 * ISOMETRIC ALIGNMENT:
 * - Positioned above the top story
 * - Angle matches face skew for visual coherence
 * - Creates peaked roof effect
 *
 * COORDINATES:
 * - centerX = SIZE/2 (building center)
 * - centerY = -SIZE/2 - ANGLE (above building)
 * - 4 vertices: left, top, right, bottom
 *
 * @param {string} [color="#AAA"] - Fill color for the roof
 *
 * @returns {SVGPolygonElement} Diamond polygon element
 *
 * @example
 * const roofElement = roof('#FF6B6B');
 * story.appendChild(roofElement);
 */
function roof(color = "#AAA") {
  // Create the rectangle (square) element
  const poly = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  // Desired width of the diamond
  const width = SIZE * 2;
  // Convert degrees to radians for JavaScript trigonometric functions
  const radians = ANGLE * (Math.PI / 180);
  // Calculate the height using the formula h = width * tan(angle)
  const height = width * Math.tan(radians);
  // Calculate the coordinates of the diamond vertices
  const centerX = SIZE / 2; // Center X position in the SVG canvas
  const centerY = 0 - SIZE / 2 - ANGLE; // Center Y position in the SVG canvas

  const points = [
    [centerX - width / 2, centerY], // Left vertex (24 degrees)
    [centerX, centerY - height / 2], // Top vertex
    [centerX + width / 2, centerY], // Right vertex (24 degrees)
    [centerX, centerY + height / 2], // Bottom vertex
  ];

  // Create the polygon points string
  const pointsString = points.map((point) => point.join(",")).join(" ");

  poly.setAttribute("points", pointsString);
  if (color) {
    poly.setAttribute("fill", color);
  }
  poly.classList.add("roof");
  return poly;
}

/**
 * Creates a building face with Chrome base and random blockframe content
 *
 * FACE COMPOSITION:
 * 1. Clone .Chrome template (browser window frame)
 * 2. Randomly select a blockframe type from TYPES array
 * 3. Clone that blockframe template from SRC
 * 4. Append blockframe inside Chrome
 * 5. Clone entire assembly for BW and COLOR versions
 *
 * BLOCKFRAME TYPES:
 * - Calendar, Article, Landing, Cart, Contact, Map, Timeline
 * - Each type is a template from the source SVG
 * - Randomly selected for variety in cityscape
 *
 * DUAL VERSIONS:
 * - stroked (BW): Black and white version for outline view
 * - painted (COLOR): Color version for painted view
 * - Both created from same assembled face
 *
 * GARBAGE COLLECTION:
 * - Original assembled face is removed after cloning
 * - Prevents memory leaks from temporary elements
 *
 * CLASS NAMING:
 * - Removes "Chrome" class, adds "face"
 * - Adds "face-{type}" for identification (e.g., "face-Calendar")
 *
 * @param {number} s - Story number (unused, kept for signature consistency)
 * @param {number} side - Face side: 0 = left, 1 = right
 *
 * @returns {[SVGElement, SVGElement]} Array of [BW_face, COLOR_face]
 *
 * @example
 * const leftFace = drawFace(3, 0);  // Left face of 4th story
 * const rightFace = drawFace(3, 1); // Right face of 4th story
 * // leftFace[0] = BW version, leftFace[1] = COLOR version
 */
function drawFace(s, side) {
  var type;
  // Every face starts with an instance of Chrome as its foundation
  const block = SRC.querySelector(".Chrome").cloneNode(true);
  block.classList.remove("Chrome");
  block.classList.add("face");

  var random = TYPES[Math.floor(Math.random() * TYPES.length)];
  // Next we add a randomly selected type of blockframe to add to the chrome
  switch (random) {
    case "Calendar":
      type = SRC.querySelector(".Calendar").cloneNode(true);
      // paintMe = Calendar.paint;
      break;
    case "Article":
      type = SRC.querySelector(".Article").cloneNode(true);
      // paintMe = Article.paint;
      break;
    case "Landing":
      type = SRC.querySelector(".Landing").cloneNode(true);
      // paintMe = Landing.paint;
      break;
    case "Cart":
      type = SRC.querySelector(".Cart").cloneNode(true);
      // paintMe = Cart.paint;
      break;
    case "Contact":
      type = SRC.querySelector(".Contact").cloneNode(true);
      // paintMe = Contact.paint;
      break;
    case "Map":
      type = SRC.querySelector(".Map").cloneNode(true);
      // paintMe = Map.paint;
      break;
    case "Timeline":
      type = SRC.querySelector(".Timeline").cloneNode(true);
      // paintMe = Timeline.paint;
      break;
  }
  block.classList.add("face-" + random);
  // Added the selected blockframe on top of the Chrome instance
  block.appendChild(type);

  // Create the two different views of the block
  const stroked = block.cloneNode(true); // BW
  const painted = block.cloneNode(true); // COLOR
  block.remove(); // Garbage collection

  return [stroked, painted];

  // return Painter.paintBlockframe(block, SRC, TYPES, colors);
}

/**
 * Scales and skews a face for isometric projection
 *
 * CRITICAL ISOMETRIC TRANSFORMATION:
 * This is the KEY function that creates the 3D isometric effect.
 * It applies a complex transformation matrix to make faces appear angled.
 *
 * TRANSFORMATION SEQUENCE:
 * 1. translate(x, 0) - Position left (x=0) or right (x=SIZE)
 * 2. skewY(angle) - Skew for isometric angle (left=+ANGLE, right=-ANGLE)
 * 3. translate(-SIZE/2, -SIZE/2) - Center for scaling
 * 4. scale(scale) - Uniform scale to fit SIZE
 *
 * SCALING CALCULATION:
 * - Gets bounding box of face (actual dimensions)
 * - Calculates scale to fit within SIZE x SIZE
 * - Uses Math.min for uniform scaling (maintains aspect ratio)
 * - Must be done AFTER face is in DOM (for getBBox() to work)
 *
 * SKEW DIRECTION:
 * - Left face (side=0): skewY(+ANGLE) - Tilts right
 * - Right face (side=1): skewY(-ANGLE) - Tilts left
 * - Creates the two visible sides of the 3D building
 *
 * DOM REQUIREMENT:
 * - Face MUST be appended to DOM before calling this
 * - getBBox() returns {0,0,0,0} if element not in DOM
 * - This is why faces are added to story before scaling
 *
 * @param {SVGElement[]} face - Array of [BW_face, COLOR_face] to scale
 * @param {number} side - Face side: 0 = left, 1 = right
 *
 * @returns {void}
 *
 * @example
 * // Called internally after face is added to DOM
 * story.appendChild(face[0]); // Add to DOM first
 * scaleFace(face, 0); // Now safe to scale (left side)
 */
function scaleFace(face, side) {
  // Skew and scale the face (note that we can't do this properly until it has been added to the DOM)
  face.forEach((f) => {
    const rect = f.getBBox();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const scale = Math.min(scaleX, scaleY); // Uniform scaling
    const skewYangle = side % 2 === 0 ? ANGLE : ANGLE * -1;
    const x = side === 0 ? 0 : SIZE;
    f.setAttribute(
      "transform",
      `translate(${x}, 0) skewY(${skewYangle}) translate(${-SIZE / 2}, ${
        -SIZE / 2
      }) scale(${scale})`,
    );
  });
}
