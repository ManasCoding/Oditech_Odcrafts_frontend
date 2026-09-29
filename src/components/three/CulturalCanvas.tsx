import { Canvas } from '@react-three/fiber';

export function CulturalCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} frameloop="demand">
        <ambientLight intensity={0.5} />
        {children}
      </Canvas>
    </div>
  );
}
