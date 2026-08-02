/**
 * ---
 * aix:
 *   id: frontend.figma.models.fills.pattern
 *   role: Figma tooling module: figma/models/fills/Pattern.js
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
export class Pattern {
    constructor(data) {
        this.blendMode = data.blendMode;
        this.opacity = data.opacity;
        this.type = data.type;
        this.visible = data.visible;
    }
}