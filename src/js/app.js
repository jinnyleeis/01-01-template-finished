import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  //렌더러의 output endcoding을 three.srgbencoding 방식으로 바꾼다. 
  renderer.outputEncoding = THREE.sRGBEncoding;

  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap= cubeTextureLoader.load([
    'assets/environments/px.png',
    'assets/environments/nx.png',
    'assets/environments/py.png',
    'assets/environments/ny.png',
    'assets/environments/pz.png',
    'assets/environments/nz.png']);
  environmentMap.encoding = THREE.sRGBEncoding;

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  scene.background=environmentMap;
  scene.environment=environmentMap;
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
    const light = new THREE.DirectionalLight(0xffffff,1);
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
    const material = new THREE.MeshStandardMaterial({
      emissive:1,emissiveIntensity:1,transparent:true,
      opacity:0.7,
      map:textureLoader.load('assets/earth_nightmap.jpg'),
      roughness : 0.8 ,metalness : 0.8 
    });
    //이렇게 하면 자동으로 public 폴도 밑의 assets 폴더로 
    //지구처럼 둥근 sphere geometry 만든다. 
    const geometry = new THREE.SphereGeometry(1.3,30,30);
    const mesh = new THREE.Mesh(geometry,material);
    return mesh;

  };

  const createEarth2 = () => {
    const material= new THREE.MeshStandardMaterial({
      transparent:true,opacity:0.8,side:THREE.BackSide,
      map:textureLoader.load('assets/earth_nightmap.jpg')
    });
    const geometry=new THREE.SphereGeometry(1.5,30,30);
    const mesh = new THREE.Mesh(geometry,material);
    return mesh;


  }

  const createPoints =() =>{

    const pointMaterial=new THREE.PointsMaterial({
      color:0xffffff,size:0.001,sizeAttenuation:false
    })
    const pointGeometry=new THREE.SphereGeometry(1.5);
    const points=new THREE.Points(pointGeometry,pointMaterial);
    scene.add(points);
//sizeattuen-> 원근에 따른 점의 크기의 차이를 두지 않도록 설정 
  }
  const createStar = (count=500) =>{
   /// const particleGeometry  = new THREE.BufferGeometry();
   /// particleGeometry.setAttribute

  }

  //코드를 더 깔끔하게 관리하기 위함임!
  const create = () => {
    const earth1 = createEarth1();
    const earth2 = createEarth2();
    scene.add(earth1,earth2);
  }
  
 
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
    create();
    createPoints();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
