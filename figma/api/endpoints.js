export const ENDPOINTS = {
  file: (id) => `/files/${id}`,
  pages: (id) => `/files/${id}?depth=1`,
  nodes: (id, nodeIds) => `/files/${id}/nodes?ids=${nodeIds}`,
  styles: (id, styleIds) => `/files/${id}/nodes?ids=${styleIds}`,
  images: (id, imageIds) => `/images/${id}?ids=${imageIds}`,
};
