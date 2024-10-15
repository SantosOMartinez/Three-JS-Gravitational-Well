import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import vertexShader from "./shaders/plot.vert";
import fragmentShader from "./shaders/plot.frag";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry();

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  glslVersion: THREE.GLSL3,
  uniforms: {
    u_time: { value: 0 },
    u_delay: { value: 1000},
    u_scale: { value: 4 },
    u_thickness: { value: 0.04},
    u_color: { value: new THREE.Color("#26c955") },
    u_transform: { value: new THREE.Vector2(0, 0) },
  },
});

gui
  .add(material.uniforms.u_delay, "value")
  .min(0.1)
  .max(1000)
  .step(0.1)
  .name("delay");
  
gui
.add(material.uniforms.u_thickness, "value")
.min(0.02)
.max(1)
.step(0.01)
.name("thickness");

gui
  .add(material.uniforms.u_scale, "value")
  .min(1)
  .max(100)
  .step(1)
  .name("scale");

// Add controls for the x and y properties of the Vector2
const transformFolder = gui.addFolder("Transform");
transformFolder
  .add(material.uniforms.u_transform.value, "x")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("X Axis");
transformFolder
  .add(material.uniforms.u_transform.value, "y")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("Y Axis");

gui.addColor(material.uniforms.u_color, "value").name("color");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.u_time.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
