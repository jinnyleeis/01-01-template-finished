import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  const textureLoader = new THREE.TextureLoader();

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const addLight = () =>{
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(2.65,2.13,1.02);
    scene.add(light);
  }

  const createEarth1 = () => {

    //const ambientLight = new THREE.AmbientLight(0xffffff, 10);
    //scene.add(ambientLight);
   //const pointLight =new THREE.PointLight(0x1234ff,100,200);
   // scene.add(pointLight);
    //const directionalLight = new THREE.DirectionalLight({color:0xfffff,distance:10,intensity:10});
   // scene.add(directionalLight);
    //지구에 적용할 푸른색상이 머테리얼을 만든다.
    const material = new THREE.MeshStandardMaterial({emissive:1,emissiveIntensity:1,transparent:0.5, map:textureLoader.load('assets/earth_nightmap.jpg')});
    //이렇게 하면 자동으로 public 폴도 밑의 assets 폴더로 
    //지구처럼 둥근 sphere geometry 만든다. 
    const geometry = new THREE.SphereGeometry(1.3,30,30);
    const mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);

  };
 
  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    addLight();
    createEarth1();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
