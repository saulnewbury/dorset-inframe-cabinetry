import { MeshStandardMaterial } from 'three'
import UnitFront from './UnitFront'

// Materials for parts of unit:
const carcassMaterial = new MeshStandardMaterial({ color: 'white' })

/**
 * Parametric component to render a wall cupboard. These have one door if under 600mm
 * wide, else two doors (left & right).
 */
export default function WallUnit({ height = 650, width = 600, depth = 300 }) {
  const w = width / 1000
  const h = height / 1000
  const d = depth / 1000
  const style = w >= 0.6 ? 'door:door' : 'door'

  const shelves = [(2 * h) / 3, h / 3]

  return (
    <group position-y={0.86 + 0.49}>
      {/* Sides */}
      <mesh
        material={carcassMaterial}
        position={[0.005 - w / 2, h / 2 + 0.1, 0]}
      >
        <boxGeometry args={[0.01, h, d]} />
      </mesh>
      <mesh
        material={carcassMaterial}
        position={[w / 2 - 0.005, h / 2 + 0.1, 0]}
      >
        <boxGeometry args={[0.01, h, d]} />
      </mesh>
      {/* Base */}
      <mesh material={carcassMaterial} position={[0, 0.105, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
      </mesh>
      {/* Shelf/shelves */}
      {shelves.map((y, n) => (
        <mesh
          key={'s-' + n}
          material={carcassMaterial}
          position={[0, y + 0.1, -0.05]}
        >
          <boxGeometry args={[w, 0.01, d - 0.1]} />
        </mesh>
      ))}
      {/* Top */}
      <mesh material={carcassMaterial} position={[0, h + 0.1 - 0.005, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
      </mesh>
      {/* Door(s) & handles */}
      <UnitFront {...{ w, h, d, style }} />
    </group>
  )
}
