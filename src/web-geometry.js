import * as THREE from "three";

const createWeb = (radius = 1, layers = 50, segments = 50) => {
   // Create geometry for the spider web
   const geometry = new THREE.BufferGeometry();
   const vertices = [];
   const indices = [];

   // Add center vertex
   vertices.push(0, 0, 0);  // Center point at origin
   const centerIndex = 0;  // Index of the center vertex

   // Calculate the distance between layers and segments
   const layerDistance = radius / layers;  // Distance between each layer
   const segmentAngleIncrement = (Math.PI * 2) / segments; // Angle increment for each segment

   // Generate vertices in a spider-web pattern
   for (let i = 0; i < layers; i++) {
       const currentRadius = (i + 1) * layerDistance;  // Current radius for this layer
       for (let j = 0; j < segments; j++) {
           const angle = j * segmentAngleIncrement;  // Calculate the angle for this segment
           vertices.push(
               currentRadius * Math.cos(angle),  // x
               currentRadius * Math.sin(angle),  // y
               0  // z
           );

           // Connect current ring vertices in a circle
           if (j > 0) {
               indices.push(
                   i * segments + j,
                   i * segments + j - 1
               );
           }

           // If on the innermost ring, connect to the center point
           if (i === 0) {
               indices.push(centerIndex, j + 1);
           }
       }

       // Close the ring for the current layer
       if (segments > 0) {
           indices.push(i * segments, i * segments + (segments - 1)); // Connect last to first in the same layer
       }
   }

   // Create radial connections
   for (let j = 0; j < segments; j++) {
       for (let i = 0; i < layers - 1; i++) {
           indices.push(
               i * segments + j,            // Current layer vertex
               (i + 1) * segments + j       // Next layer vertex
           );
       }
   }

   // Set vertices and indices to geometry
   geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
   geometry.setIndex(indices);

   return geometry;  // Return only the geometry
};
export default createWeb;
