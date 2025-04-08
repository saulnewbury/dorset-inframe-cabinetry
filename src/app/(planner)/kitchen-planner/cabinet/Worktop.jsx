import React from 'react'

export default function Worktop({
  depth,
  height,
  thickness,
  distance,
  color,
  overhang = 0.02,
  basin = null,
  corner = null
}) {
  const w = distance + thickness * 2
  const d = depth + thickness
  const basinDepth = basin?.depth
  const basinHeight = basin?.height

  if (basin?.type === 'belfast') height += basinHeight

  // Calculate shim measurements
  const backShim =
    basin?.type === 'belfast'
      ? d - 0.05 - basinDepth + 0.025 + 0.05
      : d - 0.05 - basinDepth + 0.02
  const frontShim = 0.05 + 0.02
  const sideShim =
    basin?.type === 'belfast'
      ? thickness + 0.01
      : thickness + 0.02 + thickness / 2

  return (
    <group position-z={thickness / 2}>
      {basin ? (
        <>
          {/* Back */}
          <mesh
            receiveShadow
            position={[0, height + 0.015, -d / 2 + backShim / 2]}
          >
            <boxGeometry args={[w, 0.03, backShim]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Front */}
          {basin.type !== 'belfast' && (
            <mesh
              receiveShadow
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
          <mesh
            receiveShadow
            position={[w / 2 - sideShim / 2, height + 0.015, overhang / 2]}
          >
            <boxGeometry args={[sideShim, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh
            receiveShadow
            position={[-w / 2 + sideShim / 2, height + 0.015, overhang / 2]}
          >
            <boxGeometry args={[sideShim, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      ) : corner ? (
        <>
          <mesh
            receiveShadow
            position={[
              corner.orientation === 'left' ? corner.offset : -corner.offset,
              height + 0.015,
              overhang / 2
            ]}
          >
            <boxGeometry args={[w, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      ) : (
        <>
          <mesh receiveShadow position={[0, height + 0.015, overhang / 2]}>
            <boxGeometry args={[w, 0.03, d + overhang]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      )}
    </group>
  )
}
