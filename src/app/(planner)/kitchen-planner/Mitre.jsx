import * as THREE from 'three'

export default function Mitre({ a, b, c, t, h }) {
  // the origin (0, 0) is the middle point (b) as defined in the mesh

  const hyp = t / 2

  // Derive point a from wall a
  const aTheta = getTheta(a, b) // theta of wall a
  const az = hyp * Math.sin(aTheta + 90) // opp
  const ax = hyp * Math.cos(aTheta + 90) // adj

  // Derive point b from wall b
  const bTheta = getTheta(b, c) // theta of wall b
  const bz = hyp * Math.sin(bTheta + 90) // opp
  const bx = hyp * Math.cos(bTheta + 90) // adj

  function getTheta(a, b) {
    const adj = b.x - a.x
    const opp = b.z - a.z
    return -Math.atan2(opp, adj) / 2
  }

  // const outerAngle = 180 - theta

  const shape = new THREE.Shape()

  shape.moveTo(0, 0)
  shape.lineTo(az, ax) // adj, opp
  shape.lineTo(bz, bx)
  shape.lineTo(0, 0)

  const extrudeSettings = {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0,
    bevelThickness: 0
  }
  return (
    <mesh position={[b.x, h + 0.1, b.z]} rotation-x={Math.PI * 0.5}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color='red' />
    </mesh>
  )
}
