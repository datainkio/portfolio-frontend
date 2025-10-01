<!-- @format -->

Figma Design Sync Given a design file ID, calls the Figma API to retrieve style
info and updates local resources to suit. The current implementation plays nice
as part of the build process for an 11ty/Tailwind project: "scripts": {
"design": "node scripts/fetchFigma.js", "dev:11ty": "eleventy --serve --quiet",
"dev:css": "tailwindcss -i tailwind/styles.css -o \_site/assets/css/styles.css
--watch  
 ... }

fetchFigma.fetchDesignFile is the main interface layer. Note the order of the
requests. Everything starts with the design file. The design file supplies the
IDs needed to retrieve the information we need to update the local files. The
current state produces theme files for Tailwind and font links for
11ty/Nunjucks. // GET DESIGN FILE DATA FROM FIGMA const designFile = await
fileService.getDocument();

    // GET STYLE DATA FROM FIGMA
    const styles = await styleService.getStyles(designFile.styleIDs);

    // UPDATE THE LOCAL PALETTE FILE
    const palette = await paletteService.write(styles.colors, designFile);

    // UPDATE THE LOCAL TYPOGRAPHY FILES
    const textFormats = await typographyService.updateFontFamilies(styles.textFormats, designFile);
    const fontWeights = await typographyService.updateFontWeights(styles.textFormats, designFile);
    const fontImports = await typographyService.updateFontImports(styles.textFormats, designFile);

2console.log() is hijacked to implement the chalk package. This simplifies the
task of producing clear updates about what everything is doing and how it works.
