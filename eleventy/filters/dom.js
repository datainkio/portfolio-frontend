export default function (eleventyConfig) {
  /**
   * Insert referenced content into text.
   * str: the string containing references to external content; uses format {type, id}
   * ds: the datasource containing the referenced content.
   */
  eleventyConfig.addFilter("expand", function (str, ds) {
    let expanded = str;
    if (str) {
      const results = str.matchAll(/{(.*?)}/g); // Added 'g' flag for global matches
      for (const result of results) {
        const item = result[1].split(",");
        switch (item[0].trim()) {
          case "image":
            // Find the image by ID in the datasource
            const image = ds.find((img) => img["id"] == item[1].trim());
            if (image) {
              expanded = expanded.replace(`{${result[1]}}`, figure(image));
            }
            break;
          default:
            // Do nothing for unknown types
            break;
        }
      }
    }
    return expanded;
  });
}

/**
 * A helper function to generate an HTML figure for an image.
 * Update this function based on your desired HTML output.
 */
function figure(image) {
  return `<figure>
    <img src="${image.src}" alt="${image.alt || ""}" />
    <figcaption>${image.caption || ""}</figcaption>
  </figure>`;
}
