import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const CoinFlip = (props: any) => {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    let previous_flip_state = 0;
    let rotation_add = 0;
    let speed = 0;
    let stop_angle: any = null;
    const direction = new THREE.Vector3(0, 1, 0);
    const velocity = new THREE.Vector3();
    const displacement = new THREE.Vector3();
    // Set up the scene
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    renderer.setClearColor(0x000000, 0);
    if (canvasRef.current) {
        canvasRef.current.appendChild(renderer.domElement);
    }

    // Adding ambient lighting
    const ambient_light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient_light);

    // Left point light
    const pointLightLeft = new THREE.PointLight(0xff4422, 1);
    pointLightLeft.position.set(-1, -1, 3);
    scene.add(pointLightLeft);

    // Right point light
    const pointLightRight = new THREE.PointLight(0x44ff88, 1);
    pointLightRight.position.set(1, 2, 3);
    scene.add(pointLightRight);

    // Top point light
    const pointLightTop = new THREE.PointLight(0xdd3311, 1);
    pointLightTop.position.set(0, 3, 2);
    scene.add(pointLightTop);

    THREE.ImageUtils.crossOrigin = "";
    const texture_front = new THREE.TextureLoader().load("/coin-front.svg");
    const texture_back = new THREE.TextureLoader().load("/coin-back.svg");
    const texture_side = new THREE.TextureLoader().load("/coin-side.svg");

    const material_front = new THREE.MeshStandardMaterial({
      map: texture_front,
      metalness: 0.7,
      roughness: 0.3,
    });

    const material_back = new THREE.MeshStandardMaterial({
      map: texture_back,
      metalness: 0.7,
      roughness: 0.3,
    });

    const material_side = new THREE.MeshStandardMaterial({
      map: texture_side,
      metalness: 0.7,
      roughness: 0.3,
    });

    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 40);
    const materials = [material_side, material_front, material_back];

    const mesh = new THREE.Mesh(geometry, materials);

    scene.add(mesh);
    camera.position.set(0, 2, 7);

    mesh.rotation.x = 0.7;
    mesh.rotation.y = 1.5;

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (props.getFlipState() == 1 && previous_flip_state == 0) {
        rotation_add = 1.5;
        speed = 1;
      } else if (props.getFlipState() == 2 && previous_flip_state == 1) {
        stop_angle = 90;
      } else if (props.getFlipState() == 3 && previous_flip_state == 1) {
        stop_angle = 270;
      }
      previous_flip_state = props.getFlipState();

      if (speed != 0) {
        speed -= 0.2 * delta;
        speed = Math.max(speed, 0); // prevent negative speed
        velocity.copy(direction).multiplyScalar(speed);
        displacement.copy(velocity).multiplyScalar(delta);
        mesh.position.add(displacement);
      }

      const offset = 2;
      const degrees = (mesh.rotation.x * (180 / Math.PI)) % 360;
      if (stop_angle && degrees >= stop_angle && degrees <= stop_angle + offset) {
        // ambient_light.color.set(0x2f1073);
        ambient_light.intensity = 1.8;
      } else {
        // Rotate the cube
        mesh.rotation.x += rotation_add * delta;
      }

      // Render the scene with the camera
      renderer.render(scene, camera);
    };

    animate();

    // Clean up Three.js resources
    return () => {
      renderer.dispose();
      geometry.dispose();
      materials[0].dispose();
      materials[1].dispose();
      materials[2].dispose();
    };
  }, []);

  return <div className="items-center" ref={canvasRef} />;
};
