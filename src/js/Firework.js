//new Firework(x:0,y:0);

import * as THREE from 'three';

class Firework
{
    

constructor({x,y}){
    //각 파티클이 퍼지는 속도를 velocity란 변수를 이용 
    const count = 1000 + Math.round(Math.random() * 5000);
    const velocity = 10 + Math.random() * 10;
    //버퍼지오메트리 + 포인츠 머테리얼을 써서 파티클을 생성해주면 될 것임 

    //이번에는 앞서 파티클을 생성했던 방법과 원리는 동일하지만, 
    //또 다른 방식으로 파티클을 생성해보겠다. - 3차원 벡터 클래스의 이용 

    //이전엔 positions 배열의 x,y,z 값을 하나씩 직접 넣어줬는데, 
    //각 파티클의 위치정보? 
    //-> 3차원 벡터를 나타내는 벡터3를 이용하면, 이 값 하나 자체로 x,y,z에 대한 위치정보를 한번에 조정가능 
    const particlesGeometry = new THREE.BufferGeometry();

   // const particles = []; // 파티클을 담을 배열 생성 
   this.particles=[];

    for (let i=0; i<count; i++)
    {
        const particle = new THREE.Vector3(x,y,0);
        //vector3 cls 안에 각 점의 xyz 좌표를 파라미터로 넣어줄 수 있다
        //그런데, 폭죽을 처음 생성할 때는 모든 파티클이 같은 지점에 놓여있다가,
        //-> 점점 위치가 변화하는 효과를 주어야 할 것이다. 
       
        //매 프레임마다 이동시킬 각 좌표의 변환형에 대한 정보를 넣어줄 것임 

     
        particle.theta = Math.random() * Math.PI * 2;
        particle.phi = Math.random() * Math.PI * 2;
  
        particle.deltaX = velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
        particle.deltaY = velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
        particle.deltaZ = velocity * Math.cos(particle.theta);
       
        this.particles.push(particle);

    }

 
        //paritlces 배열에 저장된 정보를 바탕으로, 
        //particlesGeometry에 정점을 세팅해주면 된다. 
        //아까는 particlesGeometry.setAttribute('position'):이렇게 버퍼 attribute를 
        //설정했었다. 
        //3차원 벡터 정보를 담은 저 배열을 이용할거니까, 
        particlesGeometry.setFromPoints(this.particles);
        //적용할 파티클의 텍스처 
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('assets/particle.png');

        //이제 메터리얼을 추가한다. 
        const particlesMaterial = new THREE.PointsMaterial({
            size:1, 
            alphaMap:texture,
            transparent:true,
            depthWrite:false,
            color : new THREE.Color(Math.random(),Math.random(),Math.random()),
            blending: THREE.AdditiveBlending //채도도 좀 더 살아나게 만들어준다 
        });

        const particlesystem = new THREE.Points(particlesGeometry,particlesMaterial);


        //이 값을 해당 클래스의 points 속성으로 등록해서 
        //-> 참조할 수 있게 하려고
        this.particlesystem=particlesystem;
    }

   update() {

        //각 파티클에 저장된 변화량의 정보를 update 메소드에서 읽어와
        //값을 변화시켜주면 될 것이다. 
        //그런데 현재 particles 배열은 생성자함수인 constructor에서만 
        //유용한 값이므로, 이 값을 update 메소드에서 참조할 수 있도록 
        //particles = []가 아니라, this 객체의 particles라는 프로퍼티에 넣어주는 것으로 하겠다.
        //이를 통해 update 메소드에서는 각 particles에 접근할 수 있게 되었다. 
       
        //우선, 모든 particles의 위치를 변화시켜줘야 하므로, 
        //particles 배열을 순회하는 반복문을 추가시켜준다. 

        const position=this.particlesystem.geometry.attributes.position;
        //얘는 모든 파티클이 하나니까. 동일 위치에서 시작하니까. 

        //배열로 센다. 개수는 일단. 
        for(let i=0; i<this.particles.length; i++){
           //위치를 이동시키기 위해 현재 프레임에서 파티클이
           //위치하고 있는 좌표를 얻어와야 할 것이다. 

           //this.points에 저장해둔 atrributes.position에 저장됨. 
           //이를 position이란 변수에 저쟁해둔다. 너무 기니까.-> 그리고 이를 이용한다. 

           const x=position.getX(i);
           const y=position.getY(i);
           const z=position.getZ(i);

           //위의 생성자에서 만들어놓은 배열의 delta x/y/z 값을 이용 
           position.setX(i,x+this.particles[i].deltaX);
           position.setY(i,y+this.particles[i].deltaY);
           position.setZ(i,z+this.particles[i].deltaZ);

           //마지막으로, 이렇게 정점을 업데이트하고 난 뒤에는, position의 업데이트 속성을 true로
           //설정해서 정점의 position의 정보가 업데이트 되어야 함을 알려줘야겠다. 


        }
        //반복문 순회해서 모든 파티클버텍스 어케 변화할건지 지정한 후에 
        //버퍼의 해당 어트리뷰트의 데이터 속성을 true로 해서 업데이트 시켜준다. 
        position.needsUpdate=true;



   }
}


export default Firework;