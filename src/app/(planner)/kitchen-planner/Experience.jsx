import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Wall from './Wall'

export default function Experience() {
  return (
    <>
      {/* Logic elements */}
      <OrbitControls enableRotate={false} />

      {/* Environment elements */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* Scene */}
      <Wall />

      <mesh rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color='lightblue' />
      </mesh>
    </>
  )
}

// Drei: seCursor
