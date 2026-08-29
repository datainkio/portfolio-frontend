/** @format */

// eleventy/shortcodes/loremChars.js
import { LoremIpsum } from "lorem-ipsum";

/**
 * Generates lorem ipsum text based on character length.
 * @param {number|string} length - The number of characters.
 * @returns {string} - Generated lorem ipsum text or an error message.
 */
export function loremChars(length) {
  // Initialize Lorem Ipsum generator
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  // Validate the 'length' parameter
  const parsedLength = parseInt(length, 10);
  if (isNaN(parsedLength) || parsedLength <= 0) {
    return "**Error:** `length` must be a positive integer.";
  }

  // Generate the required number of words (approximation)
  const generatedWords = lorem.generateWords(parsedLength);

  // Concatenate words to reach the desired character length
  let generatedText = "";
  const words = generatedWords.split(" ");
  for (const word of words) {
    if ((generatedText + " " + word).trim().length > parsedLength) {
      break;
    }
    generatedText = (generatedText + " " + word).trim();
  }

  // If the generated text is shorter than desired, append ellipsis
  if (generatedText.length < parsedLength) {
    generatedText += "...";
  }

  return generatedText;
}

/**
 * Generates lorem ipsum paragraphs, each wrapped in <p> tags with an optional CSS class.
 * @param {number|string} paragraphs - The number of paragraphs to generate (1-5).
 * @param {string} [className=""] - Optional CSS class to add to each <p> tag.
 * @returns {string} - Generated paragraphs wrapped in <p> tags or an error message.
 */
export function loremPars(paragraphs, className = "") {
  // Initialize Lorem Ipsum generator
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  // Validate the 'paragraphs' parameter
  const parsedParagraphs = parseInt(paragraphs, 10);
  if (isNaN(parsedParagraphs) || parsedParagraphs < 1 || parsedParagraphs > 5) {
    return `<strong>Error:</strong> \`paragraphs\` must be an integer between 1 and 5.`;
  }

  // Generate and wrap each paragraph individually
  const wrappedParagraphs = [];
  for (let i = 0; i < parsedParagraphs; i++) {
    const paragraph = lorem.generateParagraphs(1);
    if (className) {
      wrappedParagraphs.push(`<p class="${className}">${paragraph}</p>`);
    } else {
      wrappedParagraphs.push(`<p>${paragraph}</p>`);
    }
  }

  // Join all wrapped paragraphs with line breaks for readability
  return wrappedParagraphs.join("\n");
}
