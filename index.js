import * as THREE from 'three'; // three จากที่กำหนดใน importmap
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
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
	const geometry = new THREE.PlaneGeometry(8, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0x898989, side: THREE.DoubleSide,});
  const plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = Math.PI / 2;
	plane.receiveShadow = true;
  M3D.scene.add(plane);
	

	function addGLTFModel({ path, position, scale, rotationY = 0 }) {
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
  path: './Model/fantasy_house.glb',
  position: [-3, 0, 4],
  scale: [2, 2, 2],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/fantasy_house.glb',
  position: [2.5, 0, 4],
  scale: [2, 2, 2],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/house03.glb',
  position: [0, 0, 4],
  scale: [0.15, 0.15, 0.15],
  rotationY: Math.PI,
});
addGLTFModel({
  path: './Model/nampu2.glb',
  position: [0, 0.09, 1],
  scale: [0.25, 0.7, 0.25],
  rotationY: Math.PI,
});
addGLTFModel({
	path: './Model/tree.glb',
	position: [-1.4, 0, 4],
	scale: [0.075, 0.09, 0.075],
})
addGLTFModel({
	path: './Model/tree.glb',
	position: [1.15, 0, 4],
	scale: [0.075, 0.09, 0.075],
})
addGLTFModel({
	path: './Model/fantasy_house.glb',
	position: [-3, 0, 1],
	scale: [2, 2, 2],
	rotationY: Math.PI/2,
})
addGLTFModel({
	path: './Model/fantasy_house.glb',
	position: [3, 0, 1],
	scale: [2, 2, 2],
	rotationY: -Math.PI/2,
})


const amblight = new THREE.AmbientLight(0x404040,10);
	M3D.scene.add(amblight);
	const light = new THREE.PointLight( 0x404040, 1000);
	light.shadow.normalBias = 1;
	light.position.set( 0, 5, 0 );
	light.castShadow = true;
	M3D.scene.add( light );
	
	// Stats
	const stats = new Stats(); // สร้าง Stats เพื่อตรวจสอบประสิทธิภาพ
	document.body.appendChild(stats.dom); // เพิ่ม Stats ลงใน body ของ HTML

	// GUI
	const gui = new GUI(); // สร้าง GUI สำหรับปรับแต่งค่าต่างๆ 


	function animate() {
		M3D.controls.update(); // อัปเดต controls
		stats.update(); // อัปเดต Stats
		FPS.update(); // อัปเดต FPS

		// UPDATE state of objects here
		// TODO: อัปเดตสถานะของวัตถุต่างๆ ที่ต้องการในแต่ละเฟรม (เช่น การเคลื่อนที่, การหมุน ฯลฯ)


		// RENDER scene and camera
		M3D.renderer.render(M3D.scene, M3D.camera); // เรนเดอร์ฉาก
		M3D.cssRenderer.render(M3D.scene, M3D.camera); // เรนเดอร์ CSS2DRenderer
		console.log(`FPS: ${FPS.fps}`); // แสดงค่า FPS ในคอนโซล
	}
}