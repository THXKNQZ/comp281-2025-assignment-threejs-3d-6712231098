import * as THREE from 'three'; // three จากที่กำหนดใน importmap
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { M3D, createLabel2D, FPS } from './utils-module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", main);

function main() {
	// ใช้ M3D ที่นำเข้ามา
	document.body.appendChild(M3D.renderer.domElement);
	document.body.appendChild(M3D.cssRenderer.domElement);

	M3D.renderer.setClearColor(0x333333); // กำหนดสีพื้นหลังของ renderer (canvas)
	M3D.renderer.setPixelRatio(window.devicePixelRatio); // ปรับความละเอียดของ renderer ให้เหมาะสมกับหน้าจอ
	M3D.renderer.shadowMap.enabled = true; // เปิดใช้งาน shadow map
	M3D.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // กำหนดประเภทของ shadow map
	M3D.renderer.physicallyCorrectLights = true; // เปิดใช้งานการคำนวณแสงแบบฟิสิกส์
	M3D.renderer.outputEncoding = THREE.sRGBEncoding; // กำหนดการเข้ารหัสสีของ renderer
	M3D.renderer.setAnimationLoop(animate); // ตั้งค่า animation loop

	// Prepaire objects here
	// TODO: วาดฉากทิวทัศน์ 3D ด้วย Three.js
	// ต้องมีครบ 6 อย่าง: ภูเขา, พระอาทิตย์, ท้องนา, ต้นไม้, บ้าน/กระท่อม, แม่น้ำ
	// องค์ประกอบอื่น ๆ เพิ่มเติมได้ตามต้องการ (เช่น ท้องฟ้า, ก้อนเมฆ ฯลฯ)

	//สร้างพื้นหินน
	const planegeometry = new THREE.PlaneGeometry(8, 12);
  const planematerial = new THREE.MeshStandardMaterial({ color: 0x898989, side: THREE.DoubleSide,});
  const plane = new THREE.Mesh(planegeometry, planematerial);
	plane.rotation.x = Math.PI / 2;
	plane.receiveShadow = true;
  M3D.scene.add(plane);
	
	//พื้นนาข้าว
	const boxgeo = new THREE.BoxGeometry(1, 0.1, 1);
	const boxmat = new THREE.MeshStandardMaterial( {color: 0x6d4c41} );
	const box = new THREE.Mesh( boxgeo, boxmat );
	box.position.set(3, -0.04, -1);
	box.receiveShadow = true;
	M3D.scene.add( box );


	//ฟังชั่่นสร้างพืช
	function addBox2(position= [0,0,0] ,size = [0.125,0.125,0.125], color= 0x81c784) {
		const boxgeo2 = new THREE.BoxGeometry(...size);
		const boxmat2 = new THREE.MeshStandardMaterial( {color: color} );
		const box2 = new THREE.Mesh( boxgeo2, boxmat2 );
		box2.position.set(...position);
		box2.castShadow = true;
		box2.receiveShadow = true;
		M3D.scene.add(box2);
	}

//เรียกใช้ฟังชั่นสร้างพืช
	addBox2([3,-0.04,-0.7]);
	addBox2([2.6,-0.04,-0.7]);
	addBox2([3.4,-0.04,-0.7]);
	addBox2([3,-0.04,-1]);
	addBox2([2.6,-0.04,-1]);
	addBox2([3.4,-0.04,-1]);
	addBox2([3,-0.04,-1.3]);
	addBox2([2.6,-0.04,-1.3]);
	addBox2([3.4,-0.04,-1.3]);

	//ภูเขา
	const motigeo = new THREE.ConeGeometry( 1.75, 2, 10 ); 
	const motimat = new THREE.MeshStandardMaterial( {color: 0x4caf50} );
	const mountain1 = new THREE.Mesh( motigeo, motimat );
	mountain1.position.set(2.4, 1, -4.5);
	mountain1.castShadow = true;
	M3D.scene.add( mountain1 );

	const motigeo2 = new THREE.ConeGeometry( 2, 3, 10 );
	const motimat2 = new THREE.MeshStandardMaterial( {color: 0x388e3c} );
	const mountain2 = new THREE.Mesh( motigeo2, motimat2 );
	mountain2.position.set(-2.2, 1.5, -4.2);
	mountain2.castShadow = true;
	M3D.scene.add( mountain2 );

	const motigeo3 = new THREE.ConeGeometry( 1.7, 1.5, 10 );
	const motimat3 = new THREE.MeshStandardMaterial( {color: 0x2e7d32} );
	const mountain3 = new THREE.Mesh( motigeo3, motimat3 );
	mountain3.position.set(0, 0.75, -4.5);
	mountain3.castShadow = true;
	M3D.scene.add( mountain3 );

	const grop = new THREE.Group(); //สร้่างกลุ่ม grop
	mountain3.add(grop); //เพิ่ม grop  ไปในภูเขาลูกกลางให้เป็นพ่อโหนดดดดด

	// พระอาทิตย์
	const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
	const sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sun.position.set(4, 3, 0);
	grop.add(sun); //เพิ่มดวงอาทิตย์ไปใน grop เพื่อให้เป็นลูกของภูเขารอทำอนิเมชัน

//  แม่น้ำ 
	const riverGeometry = new THREE.PlaneGeometry(8, 1);
	const riverMaterial = new THREE.MeshStandardMaterial({ color: 0x4fc3f7, side: THREE.DoubleSide });
	const river = new THREE.Mesh(riverGeometry, riverMaterial);
	river.rotation.x = -Math.PI / 2;
	river.position.set(0, 0.02, -2); 
	river.receiveShadow = true;
	M3D.scene.add(river);



//ฟังชั่น โหลดโมเดล 3D
	function addGLTFModel({ path, position, scale, rotationY = 0 }) { //ให้รับพารามิเตอร์เป็น path, position, scale, rotationY 
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      const model = gltf.scene;
      model.position.set(...position);
      model.scale.set(...scale);
      model.rotation.y = rotationY;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      model.castShadow = true;
      M3D.scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error happened while loading the model:', error);
    }
  );
}

addGLTFModel({
  path: './Model/fantasy_house.glb', //เปลี่ยน path เป็นที่เก็บโมเดลบ้าน
  position: [-3, 0, 4],
  scale: [2, 2, 2],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/fantasy_house.glb', //เปลี่ยน path เป็นที่เก็บโมเดลบ้านหลัง 2
  position: [2.5, 0, 4], 
  scale: [2, 2, 2],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/house03.glb', //เปลี่ยน path เป็นที่เก็บโมเดลบ้านหลัง 3
  position: [0, 0, 4],
  scale: [0.15, 0.15, 0.15],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/nampu2.glb', //เปลี่ยน path เป็นที่เก็บโมเดลน้ำพุ
  position: [0, 0.09, 1],
  scale: [0.25, 0.7, 0.25],
  rotationY: Math.PI,
});
addGLTFModel({
	path: './Model/tree.glb', //เปลี่ยน path เป็นที่เก็บโมเดลต้นไม้
	position: [-1.4, 0, 4],
	scale: [0.075, 0.09, 0.075],
})
addGLTFModel({
	path: './Model/tree.glb', //เปลี่ยน path เป็นที่เก็บโมเดลต้นไม้
	position: [1.15, 0, 4],
	scale: [0.075, 0.09, 0.075],
})
addGLTFModel({
	path: './Model/fantasy_house.glb', //เปลี่ยน path เป็นที่เก็บโมเดลบ้าน
	position: [-3, 0, 1],
	scale: [2, 2, 2],
	rotationY: Math.PI/2,
})
addGLTFModel({
	path: './Model/fantasy_house.glb', //เปลี่ยน path เป็นที่เก็บโมเดลบ้าน
	position: [3, 0, 1],
	scale: [2, 2, 2],
	rotationY: -Math.PI/2,
})
addGLTFModel({
	path: './Model/stone_bridge.glb', //เปลี่ยน path เป็นที่เก็บโมเดลสะพานหิน
	position: [0, 0.18, -2],
	scale: [0.6, 0.5, 0.6],
	rotationY: Math.PI/2,
})



//เเสงต่างๆ 

	const amblight = new THREE.AmbientLight(0x404040, 10); //สร้างเเสงรอบทิศท่างหรือเเสงสว่างทั่วไปนั่นเเหละ
	M3D.scene.add(amblight);
	const sunLight = new THREE.DirectionalLight(0xfff7b2, 1); //สร้างเเสงทิศทางให้ใช้กับดวงอาทิตย์
	sunLight.position.set(4, 3, 0);
	sunLight.castShadow = true;
	M3D.scene.add(sunLight);
	grop.add(sunLight); //เพิ่มเเสงไปใน grop เพื่อให้เป็นลูกของภูเขารอทำอนิเมชัน


	// Stats
	const stats = new Stats(); // สร้าง Stats เพื่อตรวจสอบประสิทธิภาพ
	document.body.appendChild(stats.dom); // เพิ่ม Stats ลงใน body ของ HTML

	// GUI
	const gui = new GUI(); // สร้าง GUI สำหรับปรับแต่งค่าต่างๆ 



	const clocks = new THREE.Clock(); // สร้างนาฬิกาเพื่อติดตามเวลา
	function animate() {
		M3D.controls.update(); // อัปเดต controls
		stats.update(); // อัปเดต Stats
		FPS.update(); // อัปเดต FPS

		const deltatime = clocks.getDelta(); // เวลาที่ผ่านไปตั้งแต่เฟรมล่าสุด
		grop.rotation.z += deltatime * Math.PI / 8 ; // หมุนกลุ่มภูเขาและพระอาทิตย์รอบแกน z
		// UPDATE state of objects here
		// TODO: อัปเดตสถานะของวัตถุต่างๆ ที่ต้องการในแต่ละเฟรม (เช่น การเคลื่อนที่, การหมุน ฯลฯ)


		// RENDER scene and camera
		M3D.renderer.render(M3D.scene, M3D.camera); // เรนเดอร์ฉาก
		M3D.cssRenderer.render(M3D.scene, M3D.camera); // เรนเดอร์ CSS2DRenderer
		//console.log(`FPS: ${FPS.fps}`); // แสดงค่า FPS ในคอนโซล
	}
}