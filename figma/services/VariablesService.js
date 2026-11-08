import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ENDPOINTS } from "../api/endpoints.js";
import { isTokensPage } from "./TokenService.js";

/** Where `write` puts the export unless told otherwise. */
export const DEFAULT_OUT_FILE = fileURLToPath(
  new URL("../exports/variables.local.json", import.meta.url),
);

/**
 * resolvedType → how to read a variable's value, and the ID it's bound to, from
 * its layer on the Tokens page. figma/generators/tokensPage.js builds the layers.
 */
const READERS = {
  COLOR: (layer) => {
    const paint = layer.fills?.[0];
    if (!paint?.color) return {};
    const { r, g, b, a } = paint.color;
    return {
      boundId: paint.boundVariables?.color?.id,
      value: { r, g, b, a: a * (paint.opacity ?? 1) },
    };
  },
  // REST leaves itemSpacing out when it's 0.
  FLOAT: (layer) => ({
    boundId: layer.boundVariables?.itemSpacing?.id,
    value: layer.itemSpacing ?? 0,
  }),
  STRING: (layer) => {
    const node = layer.children?.find((child) => child.name === "value");
    return {
      boundId: node?.boundVariables?.characters?.id,
      value: node?.characters,
    };
  },
};

/**
 * Reads the Tokens page into the shape Figma's Enterprise-only
 * `GET /v1/files/:key/variables/local` returns as `meta`.
 *
 * Each hidden `meta` text holds JSON written by the generator: `kind:
 * "collection"` for a collection, `kind: "variable"` for the layer it sits in.
 * Values come from the layers' live bound values, everything else from the JSON.
 *
 * @param {Object} pageNode The page's `document` from GET /v1/files/:key/nodes.
 * @returns {{ variables: Object, variableCollections: Object }} Both keyed by ID.
 * @throws When a layer has lost its binding, is bound to a different variable
 *   than its meta names, or a collection lists a variable with no layer.
 */
export function extractVariables(pageNode) {
  const collections = {};
  const entries = [];
  const errors = [];

  const visit = (node, parent) => {
    if (node.type === "TEXT" && node.name === "meta") {
      let data;
      try {
        data = JSON.parse(node.characters);
      } catch {
        errors.push(
          `${parent?.name ?? "A layer"} has a meta text that isn't JSON`,
        );
        return;
      }
      if (data.kind === "collection") collections[data.id] = data;
      if (data.kind === "variable") entries.push({ meta: data, layer: parent });
      return;
    }
    (node.children ?? []).forEach((child) => visit(child, node));
  };
  visit(pageNode, null);

  const variables = {};
  for (const { meta, layer } of entries) {
    const collection = collections[meta.variableCollectionId];
    const read = READERS[meta.resolvedType];
    if (!collection) {
      errors.push(`${layer.name} names a collection that isn't on the page`);
      continue;
    }
    if (!read) {
      errors.push(
        `${layer.name} has an unsupported type, ${meta.resolvedType}`,
      );
      continue;
    }
    const { boundId, value } = read(layer);
    if (!boundId) {
      errors.push(`${layer.name} isn't bound to a variable`);
      continue;
    }
    if (boundId !== meta.id) {
      errors.push(`${layer.name} is bound to ${boundId}, not ${meta.id}`);
      continue;
    }
    variables[meta.id] = {
      id: meta.id,
      name: meta.name,
      key: meta.key,
      variableCollectionId: meta.variableCollectionId,
      resolvedType: meta.resolvedType,
      valuesByMode: { [collection.defaultModeId]: value },
      remote: false,
      description: meta.description ?? "",
      hiddenFromPublishing: meta.hiddenFromPublishing ?? false,
      scopes: meta.scopes ?? [],
      codeSyntax: meta.codeSyntax ?? {},
    };
  }

  const layered = new Set(entries.map(({ meta }) => meta.id));
  const variableCollections = {};
  for (const c of Object.values(collections)) {
    for (const id of c.variableIds.filter((v) => !layered.has(v))) {
      errors.push(`${c.name} lists ${id}, but no layer on the page holds it`);
    }
    variableCollections[c.id] = {
      id: c.id,
      name: c.name,
      key: c.key,
      modes: c.modes,
      defaultModeId: c.defaultModeId,
      remote: false,
      hiddenFromPublishing: c.hiddenFromPublishing ?? false,
      variableIds: c.variableIds,
    };
  }

  if (errors.length) {
    throw new Error(
      `The Tokens page is out of step with the library's variables. Re-run figma/generators/tokensPage.js.\n  - ${errors.join("\n  - ")}`,
    );
  }
  return { variables, variableCollections };
}

/** Throws on a Figma REST error body, which arrives as `{ status, err }`. */
const ok = (body) => {
  if (body?.err) throw new Error(`Figma API ${body.status}: ${body.err}`);
  return body;
};

/**
 * Exports the library's variables, read from its Tokens page, as the JSON the
 * Enterprise Variables API would return. Works with a Pro plan's token.
 */
export class VariablesService {
  constructor(client) {
    this.client = client;
  }

  /** @returns {Promise<Object>} The Tokens page's document node. */
  async fetchTokensPage() {
    const fileId = this.client.FILE_ID;
    const file = ok(await this.client.fetch(ENDPOINTS.pages(fileId)));
    const page = file.document?.children?.find(isTokensPage);
    if (!page) {
      throw new Error(
        `The Figma file ${fileId} has no Tokens page. Run figma/generators/tokensPage.js first.`,
      );
    }
    const nodes = ok(await this.client.fetch(ENDPOINTS.nodes(fileId, page.id)));
    return nodes.nodes[page.id].document;
  }

  /**
   * @param {string} [outFile] Defaults to figma/exports/variables.local.json.
   * @returns {Promise<{ outFile: string, variables: number, collections: number }>}
   */
  async write(outFile = DEFAULT_OUT_FILE) {
    const meta = extractVariables(await this.fetchTokensPage());
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(
      outFile,
      `${JSON.stringify({ status: 200, error: false, meta }, null, 2)}\n`,
    );
    return {
      outFile,
      variables: Object.keys(meta.variables).length,
      collections: Object.keys(meta.variableCollections).length,
    };
  }
}
