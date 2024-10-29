import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import vertexShader from "./shaders/plot.vert";
import fragmentShader from "./shaders/plot.frag";
import { clamp } from "three/src/math/MathUtils.js";

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
const geometry = new THREE.RingGeometry(0, 10, 50, 50);

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

mesh.rotateX(-Math.PI / 2);
scene.add(mesh);

const config = {
  play: true,
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
  .max(10)
  .step(0.01)
  .name("Inner Radius");

gui.add(config, "play").name("Play");

gui.addColor(material.uniforms.u_color, "value").name("color");

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
camera.position.set(0, 10, 30);
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

const snap = (value, precision = 3) => {
  return Number(value.toPrecision(precision));
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime() / 5;

  if (config.play) {
    gui.controllers[0].setValue(snap(Math.abs(Math.sin(elapsedTime) * 10)));
    gui.controllers[1].setValue(
      snap(Math.abs(Math.sin(elapsedTime + 2) * 9) + 1)
    );
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
