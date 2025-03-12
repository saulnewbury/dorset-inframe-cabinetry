import React from 'react'

export default function Worktop({
  shim,
  depth,
  thickness,
  distance,
  color,
  height,
  sink = true
}) {
  // const shim = depth / 5

  const x = 0
  const y = height + 0.015
  // const z = sink ? -depth / 2 + 0.02 : 0.02
  const z = sink ? 0 : 0.0

  const h = 0.03
  const w = distance + thickness * 2
  const d = sink ? depth / 8 : depth + 0.1

  return (
    <group position-z={0.005}>
      <mesh position={[x, y, -depth / 2 + shim / 2]}>
        <boxGeometry args={[w, h, shim]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[x, y, z]}>
        <boxGeometry args={[w, h, depth]} />
        <meshStandardMaterial color='black' />
      </mesh>
    </group>
  )
}
