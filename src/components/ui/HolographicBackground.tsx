import { Canvas } from '@react-three/fiber';
import { Stars, Sphere, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.3, 128, 16]} />
      <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} wireframe />
    </mesh>
  );
}

export function HolographicBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Stars radius={50} depth={50} count={1500} factor={4} fade />
        <RotatingTorus />
      </Canvas>
    </div>
  );
}