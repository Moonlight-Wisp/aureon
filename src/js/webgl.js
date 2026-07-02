import * as THREE from 'three';

export function initWebGL() {
  const container = document.querySelector('.hero-bg');
  if (!container) return;

  // Clear existing CSS blobs
  container.innerHTML = '<canvas id="hero-canvas"></canvas>';
  const canvas = document.getElementById('hero-canvas');

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create a particle system
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);
  
  const cobalt = new THREE.Color('#3157f6');
  const lime = new THREE.Color('#c6f35b');

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  for(let i = 0; i < particlesCount; i++) {
    const mixedColor = cobalt.clone().lerp(lime, Math.random());
    colorArray[i*3] = mixedColor.r;
    colorArray[i*3+1] = mixedColor.g;
    colorArray[i*3+2] = mixedColor.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    // Slight parallax based on mouse
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Wavy effect
    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3+1] += Math.sin(elapsedTime + x) * 0.01;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
