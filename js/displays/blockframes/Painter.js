/** @format */

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

export function block(blockNode, palette) {
  const type = blockNode.classList[0].toLowerCase();
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
        "Painter.block does not recognize '" + blockNode.classList + "'"
      );
  }
}

export function article(elem, palette) {
  Article.paint(elem, palette);
}

export function basic(elem, palette) {
  Basic.paint(elem, palette);
}

export function blog(elem, palette) {
  Blog.paint(elem, palette);
}

export function calendar(elem, palette) {
  Calendar.paint(elem, palette);
}

export function cart(elem, palette) {
  Cart.paint(elem, palette);
}

export function chart(elem, palette) {
  Chart.paint(elem, palette);
}

export function contact(elem, palette) {
  Contact.paint(elem, palette);
}

export function features(elem, palette) {
  Features.paint(elem, palette);
}

export function feed(elem, palette) {
  Feed.paint(elem, palette);
}

export function landing(elem, palette) {
  Landing.paint(elem, palette);
}

export function list(elem, palette) {
  List.paint(elem, palette);
}

export function login(elem, palette) {
  Login.paint(elem, palette);
}

export function main(elem, palette) {
  Main.paint(elem, palette);
}

export function map(elem, palette) {
  Map.paint(elem, palette);
}

export function project(elem, palette) {
  Project.paint(elem, palette);
}
export function text(elem, palette) {
  Text.paint(elem, palette);
}

export function video(elem, palette) {
  Video.paint(elem, palette);
}

/**
export async function paint(view) {
  console.log("Painter.paint");
  const colors = [["#06161f", "#f15025", "#776472", "#9888a5", "#f3e8ee"]]; // await loadColors("https://unpkg.com/nice-color-palettes@3.0.0/100.json");
  // console.log(colors)
  const faces = view.node.querySelectorAll(".face");
  faces.forEach(face => {
    // console.log(face, colors);
    paintBlockframe(face, colors[Math.floor(Math.random()*colors.length)]);
  });
}

function paintBlockframe(face, colors) {
  var paintMe;
  if (face.classList.contains("face-Calendar")) {
    paintMe = Calendar.paint;
  } else if (face.classList.contains("face-Article")) {
    paintMe = Article.paint;
  } else if (face.classList.contains("face-Landing")) {
    paintMe = Landing.paint;
  } else if (face.classList.contains("face-Cart")) {
    paintMe = Cart.paint;
  } else if (face.classList.contains("face-Contact")) {
    paintMe = Contact.paint;
  } else if (face.classList.contains("face-Map")) {
    paintMe = Map.paint;
  } else if (face.classList.contains("face-Timeline")) {
    paintMe = Timeline.paint;
  } else {
    console.log("Painter.paintBlockframe does not recognize anything in the classlist:" + face.classList);
  }

  // BLACK AND WHITE
  // BW.node.appendChild(stroked);
  var paths = face.querySelectorAll("path");
  paths.forEach(path => {
    // path.style.fill = "#FFF";
    // path.style.stroke = "#000";
    path.style.strokeWidth = 4;
    path.style.opacity = 1;
  });
  var background = face.querySelector(".background");
  background.style.opacity = .5;

  // var palette = types[Math.floor(Math.random() * types.length)];; // TODO: Select from the collection of palettes (currently in blockline)
  Chrome.paint(face, colors, paintElement);
  paintMe(face, colors);
  // return [stroked, painted];
}

export function paintElement(element, color, opacity) {
    switch (element.nodeName) {
        // Container elements
        case "svg":
        case "g":
        case "defs":
        case "symbol":
        case "use":
        element.childNodes.forEach((child) => {
            paintElement(child, color, opacity);
        });
        break;
        // Basic shapes
        case "rect":
        case "circle":
        case "ellipse":
        case "line":
        case "polyline":
        case "polygon":
        case "path":
        element.setAttribute("fill", color);
        if (opacity) {
            element.setAttribute("opacity", opacity);
        }
        // element.setAttribute('stroke', "#000000");
        break;

        default:
        // DO NOTHING
        // console.log("unknown element: " + element.nodeName);
        break;
    }
};

// PALETTES
function getColors(len) {
    let colorList = [...colors];
    let set = [];
    for (var i = 0; i < len; i++) {
        // Get random index for this array of colors
        let colorIndex = random(0, colorList.length - 1, true);
        // Add the color to the result
        set.push(colorList[colorIndex]);
        // remove that color from the options
        colorList.splice(colorIndex, 1);
    }
    // console.log(set);
    return set;
}

// SVG FILTERS
export function createFilters(svg, brightness) {
    // Append the filter to the SVG's defs section
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.node.appendChild(defs);
    defs.appendChild(getBrightnessFilter(brightness));
}

function getBrightnessFilter(brightness) {
    // Create a filter element
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "brightness");

    // Create feComponentTransfer element
    const feComponentTransfer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feComponentTransfer"
    );

    // Create feFuncR, feFuncG, feFuncB elements and set their attributes
    ["R", "G", "B"].forEach((channel) => {
      const feFunc = document.createElementNS(
        "http://www.w3.org/2000/svg",
        `feFunc${channel}`
      );
      feFunc.setAttribute("type", "linear");
      feFunc.setAttribute("slope", brightness);
      feComponentTransfer.appendChild(feFunc);
    });

    // Append feComponentTransfer to filter
    filter.appendChild(feComponentTransfer);
    return filter;
}

async function loadColors(url) {
  const response = await fetch(url); // .then((response) => response.json());
  const data = await response.json();
  return data;
};
*/
