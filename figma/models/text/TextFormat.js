/**
 * ---
 * aix:
 *   id: frontend.figma.models.text.textformat
 *   role: Figma tooling module: figma/models/text/TextFormat.js
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
import chalk from 'chalk';

export class TextFormat {
    _fontFamily;
    _fontPostScriptName;
    _fontWeight;
    _fontSize;
    _textAlignHorizontal;
    _textAlignVertical;
    _letterSpacing;
    _lineHeightPx;
    _lineHeightPercent;
    _lineHeightUnit;

    constructor(data) {
        this._name = data.name;
        this._id = data.id;
        this._fontFamily = data.style.fontFamily;
        this._fontPostScriptName = data.style.fontPostScriptName;
        this._fontWeight = data.style.fontWeight;
        this._fontSize = data.style.fontSize;
        this._textAlignHorizontal = data.style.textAlignHorizontal;
        this._textAlignVertical = data.style.textAlignVertical;
        this._letterSpacing = data.style.letterSpacing;
        this._lineHeightPx = data.style.lineHeightPx;
        this._lineHeightPercent = data.style.lineHeightPercent;
        this._lineHeightUnit = data.style.lineHeightUnit;
    }

    get fontFamily() { return this._fontFamily; }
    get fontPostScriptName() { return this._fontPostScriptName; }
    get fontWeight() { return this._fontWeight; }
    get fontSize() { return this._fontSize; }
    get textAlignHorizontal() { return this._textAlignHorizontal; }
    get textAlignVertical() { return this._textAlignVertical; }
    get letterSpacing() { return this._letterSpacing; }
    get lineHeightPx() { return this._lineHeightPx; }
    get lineHeightPercent() { return this._lineHeightPercent; }
    get lineHeightUnit() { return this._lineHeightUnit; }
    get name() { return this._name; }
    get id() { return this._id; }

    get atomicLevel() {
        
    }
    
    get property() {
        // Assume that _name is formatted like 'sizes/text-8xl' or "/families/serif'
        return this._name.split("/")[0];
    }

    get className() {
        return this._name.split("/").pop();
    }

    set fontFamily(value) {
        if (typeof value !== 'string') throw new TypeError('Font family must be a string');
        this._fontFamily = value;
    }

    set fontPostScriptName(value) {
        if (typeof value !== 'string') throw new TypeError('Font PostScript name must be a string');
        this._fontPostScriptName = value;
    }

    set fontWeight(value) {
        if (typeof value !== 'number') throw new TypeError('Font weight must be a number');
        this._fontWeight = value;
    }

    set fontSize(value) {
        if (typeof value !== 'number') throw new TypeError('Font size must be a number');
        this._fontSize = value;
    }

    set textAlignHorizontal(value) {
        const validAligns = ['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'];
        if (!validAligns.includes(value)) throw new Error('Invalid horizontal alignment');
        this._textAlignHorizontal = value;
    }

    set textAlignVertical(value) {
        const validAligns = ['TOP', 'CENTER', 'BOTTOM'];
        if (!validAligns.includes(value)) throw new Error('Invalid vertical alignment');
        this._textAlignVertical = value;
    }

    set letterSpacing(value) {
        if (typeof value !== 'number') throw new TypeError('Letter spacing must be a number');
        this._letterSpacing = value;
    }

    set lineHeightPx(value) {
        if (typeof value !== 'number') throw new TypeError('Line height (px) must be a number');
        this._lineHeightPx = value;
    }

    set lineHeightPercent(value) {
        if (typeof value !== 'number') throw new TypeError('Line height (%) must be a number');
        this._lineHeightPercent = value;
    }

    set lineHeightUnit(value) {
        const validUnits = ['PIXELS', 'PERCENT'];
        if (!validUnits.includes(value)) throw new Error('Invalid line height unit');
        this._lineHeightUnit = value;
    }

    set name(value) {
        if (typeof value !== 'string') throw new TypeError('Name must be a string');
        this._name = value;
    }

    set id(value) {
        if (typeof value !== 'string') throw new TypeError('ID must be a string');
        this._id = value;
    }

    log() {
        console.log('     ' + 
            chalk.cyan(`${this._fontFamily} ${this._fontWeight}`) +
            chalk.gray(` @ ${this._fontSize}px`) +
            chalk.gray(` (${this._lineHeightPx}px line-height)`)
        );
    }
}