import React from 'react'

export default function Worktop({
  shim,
  shimDivisor,
  depth,
  thickness,
  distance,
  color,
  height,
  sink = true
}) {
  const w = distance + thickness * 2
  const d = depth + 0.05

  return (
    <group position-z={shimDivisor / 100 - 0.015}>
      {sink ? (
        <>
          {/* Back */}
          <mesh position={[0, height + 0.015, -d / 2 + shim / 2]}>
            <boxGeometry args={[w, 0.03, shim]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Front */}
          <mesh position={[0, height + 0.015, depth / 2 - 0.015]}>
            <boxGeometry args={[w, 0.03, 0.08]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Sides */}
          <mesh position={[w / 2 - 0.027 / 2, height + 0.015, 0]}>
            <boxGeometry args={[0.027, 0.03, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-w / 2 + 0.027 / 2, height + 0.015, 0]}>
            <boxGeometry args={[0.027, 0.03, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, height + 0.015, 0]}>
          <boxGeometry args={[w, 0.03, depth]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
    </group>
  )
}
