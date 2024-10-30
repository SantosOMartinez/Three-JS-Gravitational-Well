import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import vertexShader from "./shaders/plot.vert";
import fragmentShader from "./shaders/plot.frag";
import createWeb from "./web-geometry";
import Stats from "three/examples/jsm/libs/stats.module.js";
/**
 * Base
 */
// Debug
const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const config = {
  play: true,
  radius: 10,
  layers: 20,
  segments: 20,
};

const createGeometry = () =>
  createWeb(config.radius, config.layers, config.segments);

/**
 * Test mesh
 */
// Geometry
const geometry = createGeometry();

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    u_time: { value: 0 },
    u_amplitude: { value: 7 },
    u_inner_radius: { value: 4 },
    u_color: { value: new THREE.Color("#8bcaef") },
  },
});

// Mesh
const mesh = new THREE.LineSegments(geometry, material);

mesh.rotation.x = (3 * Math.PI) / 2;
scene.add(mesh);

const updateGeometry = () => {
  mesh.geometry.dispose();
  mesh.geometry = createGeometry();
};

gui
  .add(material.uniforms.u_amplitude, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Amplitude");

gui
  .add(material.uniforms.u_inner_radius, "value")
  .min(0)
  .max(100)
  .step(0.01)
  .name("Inner Radius");

gui.add(config, "play").name("Play");

gui.addColor(material.uniforms.u_color, "value").name("color");

const geometryGui = gui.addFolder("Geometry");

geometryGui
  .add(config, "radius")
  .min(0)
  .max(100)
  .step(1)
  .name("Radius")
  .onChange(updateGeometry);
geometryGui
  .add(config, "layers")
  .min(0)
  .max(1_000)
  .step(1)
  .name("Layers")
  .onChange(updateGeometry);
geometryGui
  .add(config, "segments")
  .min(0)
  .max(1_000)
  .step(1)
  .name("Segments")
  .onChange(updateGeometry);

const translations = gui.addFolder("Translation");
translations.add(mesh.position, "x").min(-10).max(10).step(0.01).name("X");
translations.add(mesh.position, "y").min(-10).max(10).step(0.01).name("Y");
translations.add(mesh.position, "z").min(-10).max(10).step(0.01).name("Z");

const rotations = gui.addFolder("Rotations");
rotations
  .add(mesh.rotation, "x")
  .min(0)
  .max(2 * Math.PI)
  .step(0.01)
  .name("X");
rotations
  .add(mesh.rotation, "y")
  .min(0)
  .max(2 * Math.PI)
  .step(0.01)
  .name("Y");
rotations
  .add(mesh.rotation, "z")
  .min(0)
  .max(2 * Math.PI)
  .step(0.01)
  .name("Z");

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
  2_000
);
camera.position.set(0, 10, 30);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const snap = (value, precision = 3) => {
  return Number(value.toPrecision(precision));
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime() / 5;

  if (config.play) {
    gui.controllers[0].setValue(Math.abs(Math.sin(elapsedTime) * 10));
    gui.controllers[1].setValue(
      Math.abs(Math.sin(elapsedTime + 2) * config.radius) + config.radius * 0.5
    );
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  stats.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
