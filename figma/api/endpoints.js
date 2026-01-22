/**
 * ---
 * aix:
 *   id: frontend.figma.api.endpoints
 *   role: Figma tooling module: figma/api/endpoints.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - api
 * ---
 */
export const ENDPOINTS = {
  file: (id) => `/files/${id}`,
  nodes: (id, nodeIds) => `/files/${id}/nodes?ids=${nodeIds}`,
  styles: (id, styleIds) => `/files/${id}/nodes?ids=${styleIds}`,
  images: (id, imageIds) => `/images/${id}?ids=${imageIds}`
};