import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";

export function insert(block, container, clone) {
  const blockSVG = SVG();
  const cloned = clone ? block.cloneNode(true) : block;
  blockSVG.add(cloned);

  const elem = blockSVG.first();
  // elem.untransform();
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
      `translate(${building_id * SIZE * 2}, 0)`
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
        story == height
      );
    }
    // Increment so the buildings display properly without overlap
    building_id += 1;
  });

  // Return the populated SVGs
  return [COLOR, BW];
}

/**
 * Returns an array supplying building heights. By default all buildings have the same
 * height (determined by cols). Note that the a building's height can be randomly
 * determined. Another alternative - if you want more control over things - is to populate
 * the array manually.
 *
 * @param {*} rows
 * @param {*} cols
 * @returns Array of row counts (each index == one building)
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
 * A building is composed of stories positioned vertically. Each story is composed
 * of two faces. If a story is positioned at the top of the building, then it has
 * a roof.
 *
 * @param {*} building
 * @param {*} b the building ID (int)
 * @param {*} s the story (int)
 * @param {*} r boolean for adding a roof
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
 *
 * @param {*} color
 * @returns An SVG polygon representing the roof of a given building
 */
function roof(color = "#AAA") {
  // Create the rectangle (square) element
  const poly = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
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
 * @param {*} s
 * @param {*} side
 * @returns Two SVG nodes representing the color and BW versions of a given face
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
      }) scale(${scale})`
    );
  });
}
