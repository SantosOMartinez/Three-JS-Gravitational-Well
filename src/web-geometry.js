import * as THREE from "three";

const createWeb = (radius = 1, layers = 20, segments = 100) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  // Add center vertex at the origin
  vertices.push(0, 0, 0);
  const centerIndex = 0;

  // Calculate layer spacing and segment angle
  const layerDistance = radius / layers;

  // Generate vertices and indices
  for (let i = 0; i < layers; i++) {
    const currentRadius = (i + 1) * layerDistance;

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;

      // Define vertex position
      const x = currentRadius * Math.cos(angle);
      const y = currentRadius * Math.sin(angle);
      vertices.push(x, y, 0);

      const currentIndex = i * (segments + 1) + j + 1;

      // Connect each vertex to the previous one in the same layer
      if (j > 0) {
        indices.push(currentIndex - 1, currentIndex);
      }

      // Connect each vertex to the center on the first layer
      if (i === 0 && j < segments) {
        indices.push(centerIndex, currentIndex);
      }
    }

    // Connect the last vertex in the layer back to the first to close the ring
    const startOfLayerIndex = i * (segments + 1) + 1;
    const endOfLayerIndex = startOfLayerIndex + segments;
    indices.push(endOfLayerIndex, startOfLayerIndex);
  }

  // Connect layers with radial lines
  for (let i = 0; i < layers - 1; i++) {
    for (let j = 0; j <= segments; j++) {
      const currentIndex = i * (segments + 1) + j + 1;
      const nextLayerIndex = (i + 1) * (segments + 1) + j + 1;
      indices.push(currentIndex, nextLayerIndex);
    }
  }

  // Set vertices and indices to the geometry
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);

  return geometry;
};
export default createWeb;
