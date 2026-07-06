import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { View, Platform } from 'react-native';

function SpinningBox() {
  const meshRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export function ThreeDCalendarIcon() {
  // 3D Canvas rendering for React Native and Web
  return (
    <View style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SpinningBox />
      </Canvas>
    </View>
  );
}
