import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function P2D() {
  return (
    <Canvas
      orthographic
      camera={{
        zoom: 100,
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 6, 0]
      }}
    >
      <Experience />
    </Canvas>
  )
}
