import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function P3D() {
  return (
    <Canvas
      camera={{
        zoom: 0.5,
        fov: 45,
        near: 0.1,
        far: 200
      }}
    >
      <Experience />
    </Canvas>
  )
}
