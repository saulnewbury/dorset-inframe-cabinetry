import React, { useMemo, useContext } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function Moulding({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  panelThickness,
  frameThickness = 0.05,
  numHoles = 4,
  ratios = null, // Parameter for custom ratios
  dividerThickness = 0.018,
  mouldingSize = 0.004,
  mouldingRadius = 0.0008, // radius for rounding the moulding
  frameInset = 0.004, // inset for the frame
  openingOrientation = false, // Only applies to corner cabinets
  fullInnerWidth = 0 // Only applies to corner cabinets
}) {
  // Calculate dimensions
  const frameHeight = carcassHeight + 0.0262
  const height = frameHeight
  const hOffset = carcassHeight - frameHeight
  const zOffset = frameThickness - panelThickness

  const holeHeight = carcassHeight - 0.009
  const holeWidth = carcassInnerWidth
  const holeYOffset = panelThickness

  // Calculate hole boundaries based on numHoles and ratios
  const holeBoundaries = useMemo(() => {
    const boundaries = []

    // Define hole boundaries
    const holeBottom = -holeHeight / 2 + holeYOffset
    const holeTop = holeHeight / 2 + holeYOffset - panelThickness
    const totalHoleHeight = holeTop - holeBottom

    if (numHoles === 1) {
      // Single hole
      boundaries.push({
        bottom: holeBottom,
        top: holeTop,
        left: -holeWidth / 2,
        right: holeWidth / 2
      })
    } else if (ratios && ratios.length === numHoles) {
      // Custom ratios provided
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness

      // Create hole boundaries based on custom ratios
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

        currentBottom = currentTop + dividerThickness
      }
    } else if (numHoles === 3) {
      // Special case for 3 holes with ratio 8321 : 8312 : 4925
      const defaultRatios = [8321, 8312, 4925]
      const sumRatios = defaultRatios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness

      // Create hole boundaries based on ratios
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight =
          (defaultRatios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({
          bottom: currentBottom,
          top: currentTop,
          left: -holeWidth / 2,
          right: holeWidth / 2
        })

        currentBottom = currentTop + dividerThickness
      }
    } else {
      // Multiple holes with dividers (equal size)
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness
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

        currentBottom = currentTop + dividerThickness
      }
    }

    return boundaries
  }, [
    holeHeight,
    holeWidth,
    holeYOffset,
    numHoles,
    dividerThickness,
    panelThickness,
    ratios
  ])

  // Frame component for a single hole
  const HoleMoulding = ({ hole }) => {
    const frameShape = useMemo(() => {
      // Calculate dimensions with the inset applied
      const frameWidth = hole.right - hole.left - 2 * frameInset
      const frameHeight = hole.top - hole.bottom - 2 * frameInset

      // Create outer shape that's inset by frameInset on all sides
      const outerShape = new THREE.Shape()
      outerShape.moveTo(0, 0)
      outerShape.lineTo(frameWidth, 0)
      outerShape.lineTo(frameWidth, frameHeight)
      outerShape.lineTo(0, frameHeight)
      outerShape.closePath()

      // Create inner shape that's inset by mouldingSize
      const innerShape = new THREE.Shape()

      // Draw the inner rectangle with rounded corners
      innerShape.moveTo(mouldingSize, mouldingSize)

      // Bottom-left to bottom-right
      innerShape.lineTo(frameWidth - mouldingSize, mouldingSize)

      // Bottom-right to top-right
      innerShape.lineTo(frameWidth - mouldingSize, frameHeight - mouldingSize)

      // Top-right to top-left
      innerShape.lineTo(mouldingSize, frameHeight - mouldingSize)

      // Close the shape
      innerShape.closePath()

      // Add inner shape as a hole in the outer shape
      outerShape.holes.push(innerShape)

      return outerShape
    }, [hole, frameInset])

    return (
      <mesh
        receiveShadow
        position={[hole.left + frameInset, hole.bottom + frameInset, 0]}
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

  const offset =
    openingOrientation === 'left'
      ? fullInnerWidth / 2 - carcassInnerWidth / 2
      : -fullInnerWidth / 2 + carcassInnerWidth / 2

  // Create all moulding frames
  return (
    <group
      position={[
        openingOrientation ? offset : 0,
        height / 2 + hOffset,
        carcassDepth / 2 - 0.005
      ]}
    >
      {holeBoundaries.map((hole, holeIndex) => (
        <HoleMoulding key={`frame-${holeIndex}`} hole={hole} />
      ))}
    </group>
  )
}
