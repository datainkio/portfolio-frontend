/**
<p id="textMorph">INK</p>
<script type="module">
    // Import GSAP dependencies first
    import { gsap } from '/assets/js/gsap/all.js';
    import { SplitText } from '/assets/js/gsap/SplitText.js';
    import { CustomEase } from '/assets/js/gsap/CustomEase.js';
    import { CustomWiggle } from '/assets/js/gsap/CustomWiggle.js';
    import { MorphSVGPlugin } from '/assets/js/gsap/MorphSVGPlugin.js';
    
    // Register GSAP plugins
    gsap.registerPlugin(SplitText, CustomEase, CustomWiggle, MorphSVGPlugin);
    
    // Make GSAP available globally for TextParty
    window.gsap = gsap;
    window.SplitText = SplitText;
    window.CustomEase = CustomEase;
    window.CustomWiggle = CustomWiggle;
    window.MorphSVGPlugin = MorphSVGPlugin;
    
    import * as TextParty from '/assets/js/effects/TextParty.js';
    // Define the fonts for the morphing text
    const fonts = [
        {
            name: 'Big Shoulders Display',
            url: '/assets/fonts/Big_Shoulders_Display/static/BigShouldersDisplay-Regular.ttf',
            kerning: .85,
            size: 125
        }, {
            name: 'Twinkle Star',
            url: '/assets/fonts/Twinkle_Star/TwinkleStar-Regular.ttf',
            kerning: 1,
            size: 110
        }, {
            name: 'Playwrite',
            url: '/assets/fonts/Playwrite_AU_SA/static/PlaywriteAUSA-Regular.ttf',
            kerning: .9,
            size: 80
        },
        // Add more fonts as desired
    ];
    TextParty.morph("textMorph", fonts)
</script>
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
  console.log(`TextMorph called with id: ${id}, fonts:`, fonts);

  // Morphing values
  CONTAINER = document.getElementById(id);
  if (!CONTAINER) {
    console.error(`Container element with id '${id}' not found!`);
    return;
  }

  TEXT = CONTAINER.innerText;
  console.log(`Found container with text: "${TEXT}"`);

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
  console.log(
    "Starting font loading for:",
    FONTS.map((f) => f.name)
  );
  Promise.all(FONTS.map((font) => loadFont(font.url)))
    .then((loadedFonts) => {
      console.log("All fonts loaded successfully, generating paths...");
      // loadedFonts is an array of font objects in the order of the FONTS array
      // Generate path data for each font with proper kerning
      generateAllFontPaths(loadedFonts);
      console.log("Font paths generated, creating initial SVG...");
      // Create initial SVG paths using the first font
      createInitialSVGPaths();
      console.log("Initial SVG created, starting animations...");
      // Animate initial load
      animateInitialLoad();
      animate();
      console.log("Text morph animation initialized successfully");
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

  // Return the timeline immediately so TextParty.morph() can access it
  return TL;
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
    path.setAttribute("fill", "#ffffff"); // Changed to white for visibility on dark background
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("data-char-index", charIndex);
    path.classList.add("cursor-pointer");
    // Store original path data
    path.setAttribute("data-original", pathData);
    // Append to SVG
    SVG.appendChild(path);
    console.log(
      `Created path for character '${TEXT[charIndex]}' with data:`,
      pathData
    );
  }
}

function buildSVG(container) {
  console.log("Building SVG in container:", container);

  // Hide the original text
  container.style.color = "transparent";

  // Create the <svg> element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // Set the attributes
  svg.setAttribute("id", "textSVG");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 600 300");
  svg.setAttribute("class", "w-full max-w-3xl h-auto");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Animated Text: ${container.innerText}`);
  svg.style.border = "1px solid rgba(255,255,255,0.2)"; // Debug border

  container.appendChild(svg);
  console.log("SVG created and appended to container");

  // Return the created SVG element
  return svg;
}

/**
 * Load a font using opentype.js and return a Promise.
 * @param {string} url - URL to the font file.
 * @returns {Promise<Object>} - Promise resolving to the font object.
 */
function loadFont(url) {
  console.log("Loading font:", url);
  return new Promise((resolve, reject) => {
    opentype.load(url, function (err, font) {
      if (err) {
        console.error(`Failed to load font from ${url}:`, err);
        reject(`Failed to load font from ${url}: ${err}`);
      } else {
        console.log("Font loaded successfully:", font.names.fontFamily.en);
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
