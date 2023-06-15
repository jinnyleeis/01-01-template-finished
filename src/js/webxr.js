import * as THREE from 'three';

let renderer, scene, camera, raycaster;
let mouse = new THREE.Vector2();
let objects = [];

function init() {// 초기화 함수
  renderer = new THREE.WebGLRenderer();// 렌더러 생성
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 씬 생성
  scene = new THREE.Scene();
  // 카메라 생성
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  // Raycaster 생성
  raycaster = new THREE.Raycaster();
  // 클릭 이벤트 처리
  renderer.domElement.addEventListener('click', onClick, false);
  // VR 상호 작용 처리
  renderer.xr.enabled = true;
  renderer.xr.addEventListener('select', onVRSelect);
  // 추가적인 Three.js 객체 및 씬 구성
  // ...

  // 렌더링 시작
  animate();
}

// 클릭 이벤트 핸들러
function onClick(event) {
  // 마우스 좌표를 정규화
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster로 클릭 감지
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  // 클릭된 객체 처리
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    // 클릭된 객체에 대한 동작 수행
    // ...
  }
}

// VR 선택 이벤트 핸들러
function onVRSelect(event) {
  // VR 컨트롤러 위치에서 Raycaster 생성
  const controller = event.target;
  const position = new THREE.Vector3();
  position.setFromMatrixPosition(controller.matrixWorld);
  raycaster.set(position, controller.getWorldDirection());

  const intersects = raycaster.intersectObjects(objects);

  // 선택된 객체 처리
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    // 선택된 객체에 대한 동작 수행
    // ...
  }
}

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  // Three.js 객체 및 씬 업데이트
  // ...
  renderer.render(scene, camera);
}
// 초기화 함수 호출
init();


import * as THREE from 'three';

class Firework {
  constructor({ x, y }) {
    const count = 1000 + Math.round(Math.random() * 5000);
    const velocity = 10 + Math.random() * 10;

    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      particle.theta = Math.random() * Math.PI * 2;
      particle.phi = Math.random() * Math.PI * 2;

      particle.deltaX = velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
      particle.deltaY = velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
      particle.deltaZ = velocity * Math.cos(particle.theta);

      this.particles.push(particle);
    }

    particlesGeometry.setFromPoints(this.particles);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load('./assets/textures/particle.png');

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particlesGeometry, particlesMaterial);

    this.points = points;
  }

  update() {
    const position = this.points.geometry.attributes.position;

    for (let i = 0; i < this.particles.length; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.particles[i].deltaX);
      position.setY(i, y + this.particles[i].deltaY);
      position.setZ(i, z + this.particles[i].deltaZ);
    }

    position.needsUpdate = true;
  }
}

export default Firework;