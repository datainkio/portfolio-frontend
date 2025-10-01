/**
 *  <script src="https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js"></script>
    <script src="/assets/js/gsap/gsap.min.js"></script>
    <script src="/assets/js/gsap/MorphSVGPlugin.min.js"></script>

    <svg
    id="textSVG"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 300"
    class="w-full max-w-3xl h-auto"
    role="img"
    aria-label="Animated Text: ink"><!-- Paths will be dynamically appended here -->
    </svg>
 */
import opentype from "https://esm.sh/opentype.js";
import { gsap } from "/assets/js/gsap/gsap-core.js";
import * as MorphSVGPlugin from "/assets/js/gsap/MorphSVGPlugin.js";
gsap.registerPlugin(MorphSVGPlugin);

// Initialize values
var CONTAINER,
  TEXT,
  FONTS,
  SVG,
  DURATION,
  EASE,
  FONTPATHS,
  // FONTSIZE,
  TL,
  INTERVAL;

// Here ya go
export function TextMorph(id, fonts) {
  // Morphing values
  CONTAINER = document.getElementById(id);
  TEXT = CONTAINER.innerText;
  FONTS = fonts;
  SVG = buildSVG(CONTAINER);
  FONTPATHS = []; // 2D array for storing path data: fontPaths[fontIndex][charIndex]
  // FONTSIZE = 150; // TODO: Abstract font size to a settings object
  TL = gsap.timeline({ repeat: -1 });
  INTERVAL = 1.5;
  // GSAP settings
  // TODO: Abstract duration and ease to a settings object
  DURATION = 0.75;
  EASE = "back.out(1.7)";

  // Work your magic once all of the fonts are loaded
  Promise.all(FONTS.map((font) => loadFont(font.url)))
    .then((loadedFonts) => {
      // loadedFonts is an array of font objects in the order of the FONTS array
      // Generate path data for each font with proper kerning
      generateAllFontPaths(loadedFonts);
      // Create initial SVG paths using the first font
      createInitialSVGPaths();
      // Animate initial load
      animateInitialLoad();
      animate();
      // Update current font display
      // updateCurrentFontDisplay();
      // Setup morph button
      // setupMorphButton();
      // Setup reset button
      // setupResetButton();
    })
    .catch((err) => {
      console.error("Error loading fonts:", err);
    });
}

/**
 * Generate SVG path data for all fonts and all characters with proper kerning.
 * @param {Array} loadedFonts - Array of loaded font objects.
 */
function generateAllFontPaths(loadedFonts) {
  // Initialize fontPaths array
  for (let i = 0; i < loadedFonts.length; i++) {
    FONTPATHS[i] = [];
  }
  // Iterate through each font to generate path data
  loadedFonts.forEach((font, fontIndex) => {
    let x = 0; // Starting x position
    const y = 200; // Baseline position
    let previousGlyph = null;
    for (let charIndex = 0; charIndex < TEXT.length; charIndex++) {
      const char = TEXT[charIndex];
      const glyph = font.charToGlyph(char);
      if (!glyph) {
        FONTPATHS[fontIndex][charIndex] = null;
        continue;
      }
      // Apply kerning if not the first character
      if (previousGlyph) {
        /*
         * If a font does not have kerning data, it will return 0
         * let kerning = font.getKerningValue(previousGlyph, glyph);
         * kerning *= FONTS[fontIndex].kerning; // Apply font-specific kerning modifier
         * console.log(FONTS[fontIndex].kerning, kerning);
         * x += kerning * (fontSize / font.unitsPerEm);
         */
      }
      // Get path data with current x, y, and fontSize
      const pathData = glyph.getPath(x, y, FONTS[fontIndex].size).toPathData(5);
      FONTPATHS[fontIndex][charIndex] = pathData;
      // console.log(glyph.advanceWidth * (FONTSIZE / font.unitsPerEm));
      // Advance x position based on glyph's advance width
      x +=
        glyph.advanceWidth *
        (FONTS[fontIndex].size / font.unitsPerEm) *
        FONTS[fontIndex].kerning;
      // Update previousGlyph
      previousGlyph = glyph;
    }
  });
}

/**
 * Create initial SVG paths using the first font in the array.
 */
function createInitialSVGPaths() {
  if (!SVG) {
    buildSVG();
  }
  const initialFontPaths = FONTPATHS[0];
  let x = 50;
  const y = 200; // Baseline position
  for (let charIndex = 0; charIndex < TEXT.length; charIndex++) {
    const pathData = initialFontPaths[charIndex];
    if (!pathData) continue;

    // Create SVG path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "#000000");
    path.setAttribute("data-char-index", charIndex);
    path.classList.add("cursor-pointer");
    // Store original path data
    path.setAttribute("data-original", pathData);
    // Append to SVG
    SVG.appendChild(path);
  }
}

function buildSVG(container) {
  // Create the <svg> element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // Set the attributes
  svg.setAttribute("id", "textSVG");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 600 300");
  svg.setAttribute("class", "w-full max-w-3xl h-auto");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Animated Text: ink");
  container.appendChild(svg);
  // Return the created SVG element
  return svg;
}

/**
 * Load a font using opentype.js and return a Promise.
 * @param {string} url - URL to the font file.
 * @returns {Promise<Object>} - Promise resolving to the font object.
 */
function loadFont(url) {
  console.log(url);
  return new Promise((resolve, reject) => {
    opentype.load(url, function (err, font) {
      if (err) {
        reject(`Failed to load font from ${url}: ${err}`);
      } else {
        resolve(font);
      }
    });
  });
}

/**
 * Animate SVG paths on initial load.
 */
function animateInitialLoad() {
  const paths = document.querySelectorAll("#textSVG path");
  gsap.from(paths, {
    duration: DURATION,
    opacity: 0,
    scale: 0.5,
    transformOrigin: "center center",
    stagger: 0.05,
    ease: EASE,
  });
}

/**
 * Animate the morphing of text using the current font index.
 */
function animate() {
  const paths = document.querySelectorAll("#textSVG path");

  FONTS.forEach((font, fontIndex) => {
    const fontTL = gsap.timeline({
      delay: INTERVAL,
      onStart: () => {
        // Add blur and scale horizontally by 1.5 when timeline starts
        gsap.to("#textSVG", {
          duration: DURATION,
          filter: "blur(2px)",
          ease: "power1.inOut",
        });
      },
      onComplete: () => {
        // Remove blur and reset horizontal scale to 1 when timeline completes
        gsap.to("#textSVG", {
          duration: DURATION,
          filter: "none",
          ease: "power1.inOut",
        });
      },
    });

    const nextFontIndex = (fontIndex + 1) % FONTS.length;
    const targetFontPaths = FONTPATHS[nextFontIndex];

    paths.forEach((path, charIndex) => {
      const targetPath = targetFontPaths[charIndex];
      if (!targetPath) return;

      fontTL.to(
        path,
        {
          duration: DURATION,
          morphSVG: targetPath,
          ease: EASE,
          onStart: () => {
            if (!path.getAttribute("data-original")) {
              path.setAttribute("data-original", path.getAttribute("d"));
            }
          },
          onComplete: () => {
            path.setAttribute("data-original", targetPath);
          },
        },
        "<"
      );
    });

    TL.add(fontTL);
  });

  return TL;
}
