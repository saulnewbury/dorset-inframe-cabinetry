import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function MouldingThreeSides({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  panelThickness,
  mouldingSize = 0.004,
  mouldingRadius = 0.0008, // radius for rounding the moulding
  frameInset = 0.004 // inset for the frame
}) {
  // Calculate dimensions
  const frameHeight = carcassHeight + 0.0262
  const height = frameHeight

  // const offset = 0.0262 - 0.05 + 0.009
  const offset = 0.0148 + 0.0018

  const holeHeight = carcassHeight - 0.009
  const holeWidth = carcassInnerWidth
  const holeYOffset = panelThickness

  // Create U-shaped moulding
  const UShapeMoulding = () => {
    const frameShape = useMemo(() => {
      // Calculate dimensions for the entire frame
      const frameWidth = holeWidth - 2 * frameInset
      const frameHeight = holeHeight - 2 * frameInset

      // Calculate moulding dimensions
      const mouldingWidth = mouldingSize

      // Create U-shaped frame with three sides: top, left, right
      const uShape = new THREE.Shape()

      // Start at bottom left of left vertical bar going clockwise
      uShape.moveTo(0, 0)

      // Left vertical bar - outer edge
      uShape.lineTo(0, frameHeight + offset + 0.0048)

      // Top horizontal bar - outer edge
      uShape.lineTo(frameWidth, frameHeight + offset + 0.0048)

      // Right vertical bar - outer edge
      uShape.lineTo(frameWidth, 0)

      // Right vertical bar - inner edge
      uShape.lineTo(frameWidth - mouldingWidth, 0)

      // Bottom of horizontal bar - inner edge (this creates the U shape)
      uShape.lineTo(
        frameWidth - mouldingWidth,
        frameHeight - mouldingWidth + offset + 0.0048
      )

      // Top horizontal bar - inner edge
      uShape.lineTo(
        mouldingWidth,
        frameHeight - mouldingWidth + offset + 0.0048
      )

      // Left vertical bar - inner edge
      uShape.lineTo(mouldingWidth, 0)

      // Close the shape
      uShape.closePath()

      return uShape
    }, [])

    return (
      <mesh
        receiveShadow
        position={[
          -holeWidth / 2 + frameInset,
          -holeHeight / 2 + holeYOffset + frameInset,
          0
        ]}
      >
        <extrudeGeometry
          args={[
            frameShape,
            {
              depth: 0.018, // 18mm depth
              bevelEnabled: true,
              bevelThickness: mouldingRadius * 6,
              bevelSize: mouldingRadius * 6,
              bevelSegments: 12,
              bevelOffset: 0
            }
          ]}
        />
        <meshStandardMaterial color={color} />
        <Edges threshold={15} color={lineColor} />
      </mesh>
    )
  }

  // Return the U-shaped moulding
  return (
    // <group position={[0, height / 2 + hOffset , carcassDepth / 2 - 0.005]}>
    <group position={[0, height / 2 - offset - 0.05, carcassDepth / 2 - 0.005]}>
      <UShapeMoulding />
    </group>
  )
}
