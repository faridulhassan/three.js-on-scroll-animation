// function init() {
const canvas = document.getElementById("canvas");
let scrollY = window.scrollY;

// create a scene, that will hold all our elements such as objects, cameras and lights.
const scene = new THREE.Scene();
// create a camera, which defines where we're looking at
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
// tell the camera where to look
camera.position.set(0, 0, 6);

cameraGroup.add(camera);
// Camera Helper
/* const helper = new THREE.CameraHelper(camera);
scene.add(helper); */
// create a render and set the size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
// add the output of the render function to the HTML
//   document.body.appendChild(renderer.domElement);

// Material
const material = new THREE.MeshToonMaterial({ color: "#ffcdcd" });
// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

// Testing purpose only
/* mesh1.position.y = 2;
mesh1.scale.set(0.5, 0.5, 0.5);
mesh2.visible = false;
mesh3.position.y = -2;
mesh3.scale.set(0.5, 0.5, 0.5); */

scene.add(mesh1, mesh2, mesh3);

const objectsDistance = 4;

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

const sectionMeshes = [mesh1, mesh2, mesh3];
const sectionMeshesLength = sectionMeshes.length;
for (let i = 0; i < sectionMeshesLength; i++) {
  let posX = i % 2 == 0 ? 1.5 : -1.5;
  sectionMeshes[i].position.x = posX;
}

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/* Particles */
const particlesCount = 200,
  positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = Math.random();
  positions[i * 3 + 1] = Math.random();
  positions[i * 3 + 2] = Math.random();
}
console.log(positions);
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particlesMaterials = new THREE.PointsMaterial({
  color: "#ffcdcd",
  sizeAttenuation: true,
  size: 0.03,
});

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const points = new THREE.Points(particlesGeometry, particlesMaterials);
scene.add(points);
// function for re-rendering/animating the scene
const clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  const elapsedTime = clock.getElapsedTime();
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  const parallaxX = cursor.x,
    parallaxY = -cursor.y;
  console.log(parallaxX, parallaxY);
  cameraGroup.position.x += parallaxX - cameraGroup.position.x;
  cameraGroup.position.y += parallaxY - cameraGroup.position.y;

  renderer.render(scene, camera);
}
tick();

// Events
window.addEventListener("mousemove", (evt) => {
  cursor.x = evt.clientX / sizes.width - 0.5;
  cursor.y = evt.clientY / sizes.height - 0.5;
});

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

window.addEventListener("scroll", function (evt) {
  scrollY = window.scrollY;
  //   camera.position.y = -(scrollY * 0.0037);
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;
});
// }
// init();
