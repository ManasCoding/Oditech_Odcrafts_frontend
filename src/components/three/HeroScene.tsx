import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroSceneProps {
  className?: string;
}

export function HeroScene({ className }: HeroSceneProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Odisha / Pattachitra Motifs — Concentric Geometric Rings
    const group = new THREE.Group();
    scene.add(group);

    // Inner Terracotta Ring
    const innerRingGeo = new THREE.RingGeometry(2.0, 2.4, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x8b4513, // Terracotta
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    group.add(innerRing);

    // Middle Gold Filigree Ring
    const midRingGeo = new THREE.RingGeometry(3.6, 3.85, 64);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4a574, // Warm Gold
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    group.add(midRing);

    // Outer Natural Green Ring
    const outerRingGeo = new THREE.RingGeometry(5.2, 5.8, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x5c7a4a, // Forest Moss
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    group.add(outerRing);

    // 3. Floating Craft Spores / Stardust
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 70;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = (Math.random() - 0.5) * 12;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xd4a574,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Subtle ambient lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    // 4. Animation loop with slow graceful rotation
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth slow rotations in opposing directions
      innerRing.rotation.z = elapsedTime * 0.04;
      midRing.rotation.z = -elapsedTime * 0.025;
      outerRing.rotation.z = elapsedTime * 0.015;

      // Gentle floating wobble
      group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;
      group.rotation.y = Math.cos(elapsedTime * 0.2) * 0.05;

      // Particle float
      particles.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!canvas || !container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 5. Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      innerRingGeo.dispose();
      innerRingMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className || "pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-transparent"}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
    </div>
  );
}
