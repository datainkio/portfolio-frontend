/** @format */
console.log("https://frontend.horse/articles/generative-grids/");
import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";

console.clear();

let draw, squareSize, numRows, numCols, colors, colorPalette;

/*
Block Design Functions
*/

function drawBlock(x, y, background) {
  // Create group element
  const group = draw.group().addClass("draw-block");

  // Draw Square
  group.rect(squareSize, squareSize).fill(background).move(x, y);
}

function drawCircle(x,y, foreground, background) {
	// Create group element
	const group = draw.group().addClass("draw-circle");
	// Draw background
	group.rect(squareSize, squareSize).fill(background).move(x,y);
	// Draw foreground
	group.circle(squareSize).fill(foreground).move(x,y);

  // 30% of the time add an inner circle
  if (Math.random() < 0.3) {
    group
      .circle(squareSize / 2)
      .fill(background)
      .move(x + squareSize / 4, y + squareSize / 4);
  }
}

function drawOppositeCircles(x,y, foreground, background) {
	const group = draw.group().addClass("opposite-circles");
	const circleGroup = draw.group();
	// Draw background
	group.rect(squareSize, squareSize).fill(background).move(x,y);
	const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x,y);
	const offset = random([
		[0,0, squareSize, squareSize],
		[0, squareSize, squareSize, 0]
	]);
	// Draw foreground
	circleGroup
	.circle(squareSize)
	.fill(foreground)
	.center(x + offset[0], y+offset[1]);
	
	circleGroup
	.circle(squareSize)
	.fill(foreground)
	.center(x + offset[2], y+offset[3]);

	circleGroup.maskWith(mask);
	group.add(circleGroup);
}

/*
Create New Piece
*/

function generateNewGrid() {
  // Remove SVG
  document.querySelector(".container").innerHTML = "";
  drawGrid();
}

async function drawGrid() {
	// Set Random Palette
	colorPalette = random(colors);

  // Set Variables
  squareSize = 100;
  numRows = random(4, 8, true);
  numCols = random(4, 8, true);

	// Set background color
	const bg = tinycolor
	.mix(colorPalette[0], colorPalette[1], 50)
	.desaturate(10)
	.toString();

	// Make lighter version
	const bgInner = tinycolor(bg).lighten(10).toString();
	// And darker version
	const bgOuter = tinycolor(bg).darken(10).toString();
	// Set to CSS custom properties
	gsap.to(".container", {
		"--bg-inner": bgInner,
		"--bg-outer": bgOuter,
		duration: 0.5
	});

  // Create parent SVG
  draw = SVG()
    .addTo(".container")
    .size("100%", "100%")
    .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

  // Create Grid
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      generateLittleBlock(i, j);
    }
  }
}

function generateLittleBlock(i, j) {
	const { foreground, background } = getTwoColors(colorPalette);
	const blockStyleOptions = [drawCircle, drawOppositeCircles];
  const xPos = i * squareSize;
  const yPos = j * squareSize;
	const blockStyle = random(blockStyleOptions);
  blockStyle(xPos, yPos, foreground, background);
}

function getTwoColors(colors) {
	let colorList = [...colors];
	// Get random index for this array of colors
	const colorIndex = random(0, colorList.length - 1, true);
	// Set the background to the color at that array
	const background = colorList[colorIndex];
	// Remove that color from the options
	colorList.splice(colorIndex, 1);
	// Set the foreground to any other color in the array
	const foreground = random(colorList);
	return {foreground, background};
}

async function init() {
	// Get color palettes
	colors = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json").then((response) => response.json());
  generateNewGrid();
  document.querySelector(".button").addEventListener("click", generateNewGrid);
}

init();