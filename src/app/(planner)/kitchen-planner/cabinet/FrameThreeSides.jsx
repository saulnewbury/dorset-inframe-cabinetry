'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function FrameThreeSides({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles = 1,
  ratios = null, // Custom ratios
  dividerThickness = 0.018,
  frameThickness = 0.05, // Made this a parameter instead of hardcoded value
  bottomFrameThickness = 0.05 // In meters (default 50mm)
}) {
  // Calculate dimensions EXACTLY as in the original component
  const width = carcassInnerWidth + 0.036
  const height = carcassHeight + 0.0262 + (bottomFrameThickness - 0.045)
  const hOffset = carcassHeight - height
  const zOffset = frameThickness - panelThickness

  const holeHeight = carcassHeight - 0.009
  const holeYOffset = panelThickness + (bottomFrameThickness - 0.045) / 2

  // Create panel shape with holes
  const shape = useMemo(() => {
    // Create the main shape with THREE.js Path API
    const frameShape = new THREE.Shape()

    // Outer line
    // starts at bottom right and goes anti-clockwise
    frameShape.moveTo(width / 2, -height / 2)
    frameShape.lineTo(width / 2, height / 2)
    frameShape.lineTo(-width / 2, height / 2)
    frameShape.lineTo(-width / 2, -height / 2)

    // Inner line
    frameShape.lineTo(-width / 2 + panelThickness, -height / 2)
    frameShape.lineTo(-width / 2 + panelThickness, height / 2 - panelThickness)
    frameShape.lineTo(width / 2 - panelThickness, height / 2 - panelThickness)
    frameShape.lineTo(width / 2 - panelThickness, -height / 2)
    // frameShape.closePath()

    return frameShape
  }, [
    width,
    height,
    // carcassInnerWidth,
    // holeHeight,
    // holeYOffset,
    // numHoles,
    // dividerThickness,
    panelThickness
    // ratios
  ])

  // Use the EXACT same position calculation as the original component
  return (
    <mesh position={[0, height / 2 + hOffset, carcassDepth / 2 - zOffset]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: frameThickness,
            bevelEnabled: false
          }
        ]}
      />
      <meshStandardMaterial color={color} />
      <Edges threshold={5} color={lineColor} renderOrder={1000} />
    </mesh>
  )
}
