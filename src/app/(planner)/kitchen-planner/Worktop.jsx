import React from 'react'

export default function Worktop({
  depth,
  height,
  thickness,
  distance,
  color,
  overhang = 0.02,
  basin = null
}) {
  const w = distance + thickness * 2
  const d = depth + thickness
  const basinDepth = basin?.depth / 1000
  const basinHeight = basin?.height / 1000

  if (basin?.type === 'belfast') height += basinHeight

  // 0.05 frame depth
  // 0.02 basin wall depth
  // 0.03 worktop thickness

  const backShim =
    basin?.type === 'belfast'
      ? d - 0.05 - basinDepth + 0.02 + 0.05
      : d - 0.05 - basinDepth + 0.02
  const frontShim = 0.05 + 0.02
  const sideShim =
    basin?.type === 'belfast'
      ? thickness + 0.02
      : thickness + 0.02 + thickness / 2

  return (
    <group position-z={thickness / 2}>
      {basin ? (
        <>
          {/* Back */}
          <mesh position={[0, height + 0.015, -d / 2 + backShim / 2]}>
            <boxGeometry args={[w, 0.03, backShim]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Front */}
          {basin.type !== 'belfast' && (
            <mesh
              position={[
                0,
                height + 0.015,
                d / 2 - frontShim / 2 + overhang / 2
              ]}
            >
              <boxGeometry args={[w, 0.03, frontShim + overhang]} />
              <meshStandardMaterial color={color} />
            </mesh>
          )}
          {/* Sides */}
          <mesh position={[w / 2 - sideShim / 2, height + 0.015, overhang / 2]}>
            <boxGeometry args={[sideShim, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh
            position={[-w / 2 + sideShim / 2, height + 0.015, overhang / 2]}
          >
            <boxGeometry args={[sideShim, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, height + 0.015, overhang / 2]}>
            <boxGeometry args={[w, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      )}
    </group>
  )
}
