import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Firework from '/src/js/Firework';

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
    1,
    10000
  );
  camera.position.set(0, 0, 8000);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

 // const firework = new Firework({x:0,y:0});
  //firework의 points란 변수를 참조할 수 있도록 만들었었다. 
  //장면에 이를 추가한다. 
  //scene.add(firework.points);

  //const createFireWork = () =>{

  const fireworks=[];

  fireworks.update = function (){
    for (let i=0; i<this.length; i++)
    {
      const firework = fireworks[i];
      firework.update();
    }


  };
  
  const firework = new Firework({x:0,y:0});
  //firework의 points란 변수를 참조할 수 있도록 만들었었다. 
  //장면에 이를 추가한다. 
  
  //해당 클래스의 points 객체를 씬에 추가한다. 
  //}
  scene.add(firework.particlesystem);
  fireworks.push(firework);



  const addLight = () =>{
    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(2.65,2.13,1.02);
    scene.add(light);
    const pointLight =new THREE.PointLight(0xffffff,2,2);
    pointLight.position.set(0,0,0);
    scene.add(pointLight);

  }

  const createEarth1 = () => {

    //const ambientLight = new THREE.AmbientLight(0xffffff, 10);
    //scene.add(ambientLight);
   
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
    const geometry = new THREE.SphereGeometry(1.4,30,30);
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

  const createParticles =() =>{

    const count = 10000;
    const positions=new Float32Array(count*3);
    //각 정점의 x,y,z 좌표를 각각 하나의 아이템으로 만든 형태로 표현되기 때문에, 
    //정점의 개수인 count에 *3한 값을 넣어주도록 한다. 

    //이제 이 positions 배열 안에 정점의 위치 좌표를 담아주기 위해, 
    //정점의 개수만큼 반복문을 순회하면서 좌표를 설정해주도록 한다. 
    for(let i=0; i<count; i++){
      positions[i*3]=10*(Math.random()-0.5); //random은 0-1사이의 값 -> -0.5~0.5
      positions[i*3+1]=10*(Math.random()-0.5);
      positions[i*3+2]=10*(Math.random()-0.5);
    }
    //버퍼 geometry의 위치 정보에 위에서 설정한 positions 배열을 담아준다. 
    
    //버퍼 어트리뷰트 속성이란 걸 표현해줄 수 있는 걸로 threejs 내장 객체로 표현해야 
    //3은 positions 배열의 아이템 3개가 모여, 점 하나가 된다라는 의미이다. 

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('assets/particle.png'); 
    const particleMaterial=new THREE.PointsMaterial({
     depthWrite:false,alphaMap:texture,transparent:true,
      color:0xffffff,size:2,sizeAttenuation:false
    })
    const particleGeometry=new THREE.BufferGeometry();
    particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const particles=new THREE.Points(particleGeometry,particleMaterial);
    scene.add(particles);
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

  const hanlemousedown = () =>{
    const firework = new Firework({
      x:THREE.MathUtils.randFloatSpread(8000),
      y:THREE.MathUtils.randFloatSpread(8000)
    });
    scene.add(firework.particlesystem);
    fireworks.push(firework);

  }

  const addEvent = () => {
    window.addEventListener('resize', resize);
    window.addEventListener('mousedown',hanlemousedown);
  };

  const draw = () => {
    controls.update();
   
   
    renderer.render(scene, camera);
    requestAnimationFrame(() => { 
      draw();
    fireworks.update();
      
     
     
    });
  };

  const initialize = () => {
    addLight();
    create();
    scene.add(firework.particlesystem);
    fireworks.push(firework);
   
    //createPoints();
   // createParticles();
   //  createFireWork();
    addEvent();
    resize();
    
    draw();
  };

  initialize();
}
