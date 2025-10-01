import chalk from "chalk";

export class Color {
  _id;
  _description;
  _className;
  _group;
  _family;
  _variant;
  _hex;

  constructor(styleDoc) {
    this._id = styleDoc.id;
    let names = styleDoc.name.split("/");
    this._className = names.join("-");
    if (names.length > 2) {
      this._group = names[0];
      names = names.slice(1);
    }
    this._family = names[0];
    this._variant = names[1];
    this.hex = styleDoc.fills[0].color; // {r,g,b,a}
  }

  // Readonly getters
  get id() {
    return this._id;
  }
  get className() {
    return this._className;
  }
  get group() {
    return this._group;
  }

  // Getters and setters
  get description() {
    return this._description;
  }
  set description(value) {
    if (typeof value !== "string")
      throw new TypeError("Description must be a string");
    this._description = value;
  }

  get family() {
    return this._family;
  }
  set family(value) {
    if (typeof value !== "string")
      throw new TypeError("Family must be a string");
    this._family = value;
  }

  get variant() {
    return this._variant;
  }
  set variant(value) {
    if (typeof value !== "string")
      throw new TypeError("Variant must be a string");
    this._variant = value;
  }

  get hex() {
    return this._hex;
  }
  set hex(value) {
    this._hex = this.rgbToHex(value.r, value.g, value.b);
  }

  rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = Math.round(c * 255)
        .toString(16)
        .padStart(2, "0");
      return hex.toUpperCase();
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  log() {
    const swatch = "\t   ███";
    console.log(
      chalk.hex(this.hex)("  " + swatch) +
        "  " +
        chalk.gray(`${this.className}`)
    );
  }
}
