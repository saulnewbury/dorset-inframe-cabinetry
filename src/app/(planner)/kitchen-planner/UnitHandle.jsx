import {
  DoubleSide,
  LatheGeometry,
  MeshStandardMaterial,
  Path,
  Vector2
} from 'three'

const handleMaterial = new MeshStandardMaterial({
  color: 'lightgray',
  metalness: 0.5,
  roughness: 0,
  side: DoubleSide
})

// Geometry for door/drawer handles:
const handleGeometry = new LatheGeometry(
  new Path()
    .moveTo(0, 0.03)
    .splineThru([new Vector2(0.02, 0.017), new Vector2(0.01, 0.005)])
    .lineTo(0.01, 0)
    .getPoints()
)

export default function UnitHandle({ position }) {
  return (
    <mesh
      geometry={handleGeometry}
      material={handleMaterial}
      rotation-x={Math.PI / 2}
      position={position}
    />
  )
}
