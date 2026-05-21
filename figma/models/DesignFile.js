/**
 * ---
 * aix:
 *   id: frontend.figma.models.designfile
 *   role: Figma tooling module: figma/models/DesignFile.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - models
 * ---
 */
import chalk from "chalk";
import { ENDPOINTS } from "../api/endpoints.js";
export class DesignFile {
  _id;
  _endpoint;
  _name;
  _lastModified;
  _thumbnailURL;
  _version;
  _styles;
  _document;
  _componentSets;
  _schemaVersion;
  _linkAccess;

  constructor(figmaDoc, id) {
    this._id = id;
    this._name = figmaDoc.name;
    this._version = figmaDoc.version;
    this._lastModified = figmaDoc.lastModified;
    this._thumbnailURL = figmaDoc.thumbnailURL;
    this._styles = figmaDoc.styles;
    this._document = figmaDoc.document;
    this._componentSets = figmaDoc.componentSets;
    this._schemaVersion = figmaDoc.schemaVersion;
    this._linkAccess = figmaDoc.linkAccess;
  }

  log() {
    console.log(
      chalk.cyan.bold(
        "\n\t📄 " + this.name + chalk.gray(" (" + this.lastModified + ")"),
      ),
    );
    console.log(
      chalk.gray("\t   ↳ fills: ") +
        chalk.cyan(Object.keys(this.fillStyles).length),
    );
    console.log(
      chalk.gray("\t   ↳ text: ") +
        chalk.cyan(Object.keys(this.textStyles).length),
    );
    console.log(
      chalk.gray("\t   ↳ grids: ") +
        chalk.cyan(Object.keys(this.gridStyles).length),
    );
    console.log("\n");
  }

  // Getters
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get lastModified() {
    return new Date(this._lastModified).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
      timeZoneName: "short",
    });
  }
  get thumbnailURL() {
    return this._thumbnailURL;
  }
  get version() {
    return this._version;
  }
  get styles() {
    return this._styles;
  }
  get document() {
    return this._document;
  }
  get componentSets() {
    return this._componentSets;
  }
  get schemaVersion() {
    return this._schemaVersion;
  }
  get linkAccess() {
    return this._linkAccess;
  }

  get styleIDs() {
    return Object.keys(this._styles).join(",");
  }

  get styleTypes() {
    return [
      ...new Set(Object.values(this._styles).map((style) => style.styleType)),
    ];
  }

  get fillStyles() {
    return Object.fromEntries(
      Object.entries(this._styles).filter(
        ([_, style]) => style.styleType === "FILL",
      ),
    );
  }

  get textStyles() {
    return Object.fromEntries(
      Object.entries(this._styles).filter(
        ([_, style]) => style.styleType === "TEXT",
      ),
    );
  }

  get gridStyles() {
    return Object.fromEntries(
      Object.entries(this._styles).filter(
        ([_, style]) => style.styleType === "GRID",
      ),
    );
  }

  // Setters
  set id(value) {
    if (!value) throw new Error("ID cannot be empty");
    this._id = value;
  }

  set name(value) {
    if (!value) throw new Error("Name cannot be empty");
    this._name = value;
  }

  set lastModified(value) {
    if (!value) throw new Error("Last modified date cannot be empty");
    this._lastModified = value;
  }

  set thumbnailURL(value) {
    if (!value) throw new Error("Thumbnail URL cannot be empty");
    this._thumbnailURL = value;
  }

  set version(value) {
    if (!value) throw new Error("Version cannot be empty");
    this._version = value;
  }

  set styles(value) {
    if (!Array.isArray(value)) throw new Error("Styles must be an array");
    this._styles = value;
  }

  set document(value) {
    if (!value) throw new Error("Document cannot be empty");
    this._document = value;
  }

  set componentSets(value) {
    if (!Array.isArray(value))
      throw new Error("ComponentSets must be an array");
    this._componentSets = value;
  }

  set schemaVersion(value) {
    if (!value) throw new Error("Schema version cannot be empty");
    this._schemaVersion = value;
  }

  set linkAccess(value) {
    if (!value) throw new Error("Link access cannot be empty");
    this._linkAccess = value;
  }
}
