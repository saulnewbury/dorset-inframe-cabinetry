import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function CabinetMoulding({
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  carcassOuterWidth = 300,
  panelThickness,
  frameThickness = 50,
  numHoles = 4,
  dividerThickness = 18,
  mouldingSize = 0.001, // 4mm x 4mm default moulding size
  mouldingRadius = 0.8, // radius for rounding the moulding (half of mouldingSize by default)
  frameInset = 4 // 4mm inset for the frame
}) {
  // Convert dimensions from mm to meters
  const frameHeight = carcassHeight + 26.2
  const pt = panelThickness / 1000
  const thickness = frameThickness / 1000
  const height = frameHeight / 1000
  const depth = carcassDepth / 1000
  const hOffset = carcassHeight / 1000 - frameHeight / 1000
  const zOffset = thickness - pt
  const dividerThicknessM = dividerThickness / 1000
  const mouldingSizeM = mouldingSize / 1000
  const mouldingRadiusM = mouldingRadius / 1000
  const frameInsetM = frameInset / 1000 // Convert frame inset from mm to meters

  const holeHeight = carcassHeight / 1000 - 9 / 1000
  const holeWidth = carcassInnerWidth / 1000
  const holeYOffset = pt

  // Calculate hole boundaries based on numHoles
  const holeBoundaries = useMemo(() => {
    const boundaries = []

    // Define hole boundaries
    const holeBottom = -holeHeight / 2 + holeYOffset
    const holeTop = holeHeight / 2 + holeYOffset - pt
    const totalHoleHeight = holeTop - holeBottom

    if (numHoles === 1) {
      // Single hole
      boundaries.push({
        bottom: holeBottom,
        top: holeTop,
        left: -holeWidth / 2,
        right: holeWidth / 2
      })
    } else if (numHoles === 3) {
      // Special case for 3 holes with ratio 8321 : 8312 : 4925
      const ratios = [8321, 8312, 4925]
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM

      // Create hole boundaries based on ratios
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight = (ratios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({
          bottom: currentBottom,
          top: currentTop,
          left: -holeWidth / 2,
          right: holeWidth / 2
        })

        currentBottom = currentTop + dividerThicknessM
      }
    } else {
      // Multiple holes with dividers (equal size)
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM
      const singleHoleHeight = availableHeight / numHoles

      let currentBottom = holeBottom
      for (let i = 0; i < numHoles; i++) {
        const currentTop =
          i === numHoles - 1 ? holeTop : currentBottom + singleHoleHeight

        boundaries.push({
          bottom: currentBottom,
          top: currentTop,
          left: -holeWidth / 2,
          right: holeWidth / 2
        })

        currentBottom = currentTop + dividerThicknessM
      }
    }

    return boundaries
  }, [holeHeight, holeWidth, holeYOffset, numHoles, dividerThicknessM, pt])

  // Frame component for a single hole
  const HoleMoulding = ({ hole }) => {
    const frameShape = useMemo(() => {
      // Calculate dimensions with the 4mm inset applied
      const frameWidth = hole.right - hole.left - 2 * frameInsetM
      const frameHeight = hole.top - hole.bottom - 2 * frameInsetM

      // Create outer shape that's inset by frameInsetM on all sides
      const outerShape = new THREE.Shape()
      outerShape.moveTo(0, 0)
      outerShape.lineTo(frameWidth, 0)
      outerShape.lineTo(frameWidth, frameHeight)
      outerShape.lineTo(0, frameHeight)
      outerShape.closePath()

      // Create inner shape that's inset by mouldingSize
      const innerShape = new THREE.Shape()

      // Draw the inner rectangle with rounded corners
      innerShape.moveTo(mouldingSizeM, mouldingSizeM)

      // Bottom-left to bottom-right
      innerShape.lineTo(frameWidth - mouldingSizeM, mouldingSizeM)

      // Bottom-right to top-right
      innerShape.lineTo(frameWidth - mouldingSizeM, frameHeight - mouldingSizeM)

      // Top-right to top-left
      innerShape.lineTo(mouldingSizeM, frameHeight - mouldingSizeM)

      // Close the shape
      innerShape.closePath()

      // Add inner shape as a hole in the outer shape
      outerShape.holes.push(innerShape)

      return outerShape
    }, [hole, frameInsetM])

    return (
      <mesh position={[hole.left + frameInsetM, hole.bottom + frameInsetM, 0]}>
        <extrudeGeometry
          args={[
            frameShape,
            {
              depth: 0.018, // 18mm depth
              bevelEnabled: true,
              bevelThickness: mouldingRadiusM * 6,
              bevelSize: mouldingRadiusM * 6,
              bevelSegments: 12,
              bevelOffset: 0
            }
          ]}
        />
        <meshStandardMaterial color='#e0e0e0' />
        <Edges threshold={15} color='gray' />
      </mesh>
    )
  }

  // Create all moulding frames
  return (
    <group position={[0, height / 2 + hOffset, depth / 2 - 0.005]}>
      {holeBoundaries.map((hole, holeIndex) => (
        <HoleMoulding key={`frame-${holeIndex}`} hole={hole} />
      ))}
    </group>
  )
}
