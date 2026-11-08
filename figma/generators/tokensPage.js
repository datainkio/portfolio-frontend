/**
 * Builds or refreshes the "Tokens" page in the design-system library: one layer
 * per variable, bound to that variable, so the REST file endpoint (open to Pro
 * plans) reports each variable's live value. A hidden `meta` text in each layer
 * holds what REST can't return. See tokensPage.md.
 *
 * This is Figma Plugin API code, not Node. Run it with the Figma MCP's use_figma
 * tool, appending `return await buildTokensPage(figma);`, or from a development
 * plugin.
 *
 * @param {PluginAPI} figma The Plugin API global.
 * @returns {Promise<Object>} The page ID and how many layers were written.
 */
async function buildTokensPage(figma) {
  const PAGE_NAME = "Tokens";
  const LABEL_FONT = { family: "IBM Plex Sans", style: "Regular" };
  const HEADING_FONT = { family: "IBM Plex Sans", style: "Medium" };
  // Figma's cloud runtime can't load DRAFT PAPER. Display samples are typed in
  // this face first, then given their style.
  const STAND_IN_FONT = { family: "IBM Plex Sans", style: "Light" };
  const GREY = { r: 0.42, g: 0.45, b: 0.5 };
  const SUPPORTED_TYPES = ["COLOR", "FLOAT", "STRING"];

  const [collections, variables, textStyles, effectStyles] = await Promise.all([
    figma.variables.getLocalVariableCollectionsAsync(),
    figma.variables.getLocalVariablesAsync(),
    figma.getLocalTextStylesAsync(),
    figma.getLocalEffectStylesAsync(),
  ]);
  const variableById = new Map(variables.map((v) => [v.id, v]));

  const multiMode = collections.filter((c) => c.modes.length !== 1);
  if (multiMode.length) {
    throw new Error(
      `The Tokens page supports one mode per collection: ${multiMode.map((c) => c.name).join(", ")}`,
    );
  }
  const unsupported = variables.filter(
    (v) => !SUPPORTED_TYPES.includes(v.resolvedType),
  );
  if (unsupported.length) {
    throw new Error(
      `Unsupported variable types: ${unsupported.map((v) => `${v.name} (${v.resolvedType})`).join(", ")}`,
    );
  }

  const isDraft = (style) => style.fontName.family === "DRAFT PAPER";
  const fonts = new Map(
    [
      LABEL_FONT,
      HEADING_FONT,
      STAND_IN_FONT,
      ...textStyles.filter((s) => !isDraft(s)).map((s) => s.fontName),
    ].map((f) => [`${f.family}/${f.style}`, f]),
  );
  await Promise.all([...fonts.values()].map((f) => figma.loadFontAsync(f)));

  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!page) {
    page = figma.createPage();
    page.name = PAGE_NAME;
  }
  await figma.setCurrentPageAsync(page);
  for (const node of [...page.children]) node.remove();

  // Every node gets an explicit name. Names that look like `group/name` in
  // lowercase would be read as token layers by TokenService if this file were
  // ever synced the old way.
  const text = (characters, name, { font = LABEL_FONT, size = 12 } = {}) => {
    const node = figma.createText();
    node.fontName = font;
    node.fontSize = size;
    node.characters = characters;
    node.name = name;
    return node;
  };
  const caption = (characters, name) => {
    const node = text(characters, name, { size: 10 });
    node.fills = [{ type: "SOLID", color: GREY }];
    return node;
  };
  const meta = (data) => {
    const node = text(JSON.stringify(data), "meta");
    node.visible = false;
    return node;
  };
  const stack = (direction, name, spacing) => {
    const frame = figma.createFrame();
    frame.name = name;
    frame.layoutMode = direction;
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = spacing;
    frame.fills = [];
    frame.clipsContent = false;
    return frame;
  };
  const grid = (name, spacing) => {
    const frame = stack("HORIZONTAL", name, spacing);
    frame.layoutWrap = "WRAP";
    frame.counterAxisSpacing = spacing;
    frame.resize(1440, 100);
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "AUTO";
    return frame;
  };
  const row = (layer, title, detail) => {
    const frame = stack("HORIZONTAL", `Row · ${title}`, 8);
    frame.counterAxisAlignItems = "CENTER";
    const label = stack("VERTICAL", "Label", 2);
    label.appendChild(text(title, "Name"));
    if (detail) label.appendChild(caption(detail, "Detail"));
    frame.appendChild(layer);
    frame.appendChild(label);
    return frame;
  };
  const wrap = (node, width) => {
    node.resize(width, node.height);
    node.textAutoResize = "HEIGHT";
    return node;
  };

  /** The bound layer for one variable, named `{Collection}/{variable}`. */
  const tokenLayer = (variable, collection) => {
    let layer;
    if (variable.resolvedType === "COLOR") {
      layer = figma.createFrame();
      layer.resize(32, 32);
      layer.fills = [
        figma.variables.setBoundVariableForPaint(
          { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
          "color",
          variable,
        ),
      ];
      layer.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.82, b: 0.84 } }];
    } else if (variable.resolvedType === "FLOAT") {
      // Gap takes any number, including the negative tracking values.
      layer = figma.createFrame();
      layer.layoutMode = "HORIZONTAL";
      layer.resize(32, 32);
      layer.fills = [{ type: "SOLID", color: { r: 0.94, g: 0.95, b: 0.96 } }];
      layer.setBoundVariable("itemSpacing", variable);
    } else {
      layer = stack("HORIZONTAL", "", 0);
      const value = text("", "value");
      value.setBoundVariable("characters", variable);
      layer.appendChild(value);
    }
    layer.name = `${collection.name}/${variable.name}`;
    layer.appendChild(
      meta({
        kind: "variable",
        id: variable.id,
        name: variable.name,
        key: variable.key,
        variableCollectionId: variable.variableCollectionId,
        resolvedType: variable.resolvedType,
        description: variable.description,
        hiddenFromPublishing: variable.hiddenFromPublishing,
        scopes: [...variable.scopes],
        codeSyntax: { ...variable.codeSyntax },
      }),
    );
    return layer;
  };

  const root = stack("VERTICAL", "Tokens", 64);
  root.paddingTop =
    root.paddingRight =
    root.paddingBottom =
    root.paddingLeft =
      64;
  root.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  page.appendChild(root);
  root.appendChild(text("Tokens", "Title", { font: HEADING_FONT, size: 32 }));
  root.appendChild(
    wrap(
      text(
        "Generated by figma/generators/tokensPage.js in the frontend repo. Don't edit this page by hand. Re-run the generator after adding, renaming or deleting a variable or style. " +
          "Each layer named Collection/variable is bound to its variable, so the REST file endpoint reports the live value, and its hidden meta text holds what REST can't return. " +
          "npm run build:design reads this page to write styles/colors.css, styles/tokens.css and figma/exports/variables.local.json.",
        "About",
        { size: 14 },
      ),
      720,
    ),
  );

  let tokenCount = 0;
  for (const collection of collections) {
    const section = stack("VERTICAL", collection.name, 16);
    root.appendChild(section);
    section.appendChild(
      text(collection.name, "Heading", { font: HEADING_FONT, size: 20 }),
    );
    section.appendChild(
      meta({
        kind: "collection",
        id: collection.id,
        name: collection.name,
        key: collection.key,
        modes: collection.modes.map(({ modeId, name }) => ({ modeId, name })),
        defaultModeId: collection.defaultModeId,
        hiddenFromPublishing: collection.hiddenFromPublishing,
        variableIds: [...collection.variableIds],
      }),
    );
    const tokens = grid("Grid", 12);
    section.appendChild(tokens);
    for (const id of collection.variableIds) {
      const variable = variableById.get(id);
      tokens.appendChild(
        row(
          tokenLayer(variable, collection),
          variable.name,
          variable.codeSyntax.WEB,
        ),
      );
      tokenCount += 1;
    }
  }

  // One sample per style, so the REST `styles` map lists every style.
  const styles = stack("VERTICAL", "Styles", 16);
  root.appendChild(styles);
  styles.appendChild(
    text("Styles", "Heading", { font: HEADING_FONT, size: 20 }),
  );
  const textGrid = grid("Text styles", 16);
  const effectGrid = grid("Effect styles", 32);
  styles.appendChild(textGrid);
  styles.appendChild(effectGrid);

  // Display styles bind their family to font/display (DRAFT PAPER). Unbind them
  // while the samples take their style, then restore each binding.
  const rebind = textStyles
    .filter((s) => isDraft(s) && s.boundVariables?.fontFamily)
    .map((s) => [s, s.boundVariables.fontFamily.id]);
  for (const [style] of rebind) style.setBoundVariable("fontFamily", null);
  try {
    for (const style of textStyles) {
      const sample = text("Aa", `TextStyle/${style.name}`, {
        font: isDraft(style) ? STAND_IN_FONT : style.fontName,
      });
      await sample.setTextStyleIdAsync(style.id);
      textGrid.appendChild(row(sample, style.name));
    }
  } finally {
    for (const [style, id] of rebind) {
      style.setBoundVariable("fontFamily", variableById.get(id));
    }
  }

  for (const style of effectStyles) {
    const sample = figma.createFrame();
    sample.name = `EffectStyle/${style.name}`;
    sample.resize(48, 48);
    sample.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    await sample.setEffectStyleIdAsync(style.id);
    effectGrid.appendChild(row(sample, style.name));
  }

  return {
    pageId: page.id,
    rootId: root.id,
    collections: collections.length,
    variables: tokenCount,
    textStyles: textStyles.length,
    effectStyles: effectStyles.length,
    rebound: rebind.length,
  };
}
