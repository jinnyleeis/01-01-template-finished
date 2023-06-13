//new Firework(x:0,y:0);

import * as THREE from 'three';

class Firework
{

constructor({x,y}){
    const count=1000;
    //버퍼지오메트리 + 포인츠 머테리얼을 써서 파티클을 생성해주면 될 것임 

    //이번에는 앞서 파티클을 생성했던 방법과 원리는 동일하지만, 
    //또 다른 방식으로 파티클을 생성해보겠다. - 3차원 벡터 클래스의 이용 

    //이전엔 positions 배열의 x,y,z 값을 하나씩 직접 넣어줬는데, 
    //각 파티클의 위치정보? 
    //-> 3차원 벡터를 나타내는 벡터3를 이용하면, 이 값 하나 자체로 x,y,z에 대한 위치정보를 한번에 조정가능 
    const particlesGeometry = new THREE.BufferGeometry();

    const particles = []; // 파티클을 담을 배열 생성 

    for (let i=0; i<count; i+=1)
    {
        const particle = new THREE.Vector3(x,y,0);
        //vector3 cls 안에 각 점의 xyz 좌표를 파라미터로 넣어줄 수 있다
        //그런데, 폭죽을 처음 생성할 때는 모든 파티클이 같은 지점에 놓여있다가,
        //-> 점점 위치가 변화하는 효과를 주어야 할 것이다. 
        particles.push(particle);
    }
        //paritlces 배열에 저장된 정보를 바탕으로, 
        //particlesGeometry에 정점을 세팅해주면 된다. 
        //아까는 particlesGeometry.setAttribute('position'):이렇게 버퍼 attribute를 
        //설정했었다. 
        //3차원 벡터 정보를 담은 저 배열을 이용할거니까, 
        particlesGeometry.setFromPoints(particles);
        //적용할 파티클의 텍스처 
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('assets/particle.png');

        //이제 메터리얼을 추가한다. 
        const particlesMaterial = new THREE.PointsMaterial({
            size:1, 
            alphaMap:texture,
            transparent:true,
            depthWrite:false
        });

        const points = new THREE.Points(particlesGeometry,particlesMaterial);

        //이 값을 해당 클래스의 points 속성으로 등록해서 
        //-> 참조할 수 있게 하려고
        this.points=points;
    }
}

export default Firework;