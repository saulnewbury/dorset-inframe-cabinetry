import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function Frame({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles,
  ratios = null, // Custom ratios
  dividerThickness = 0.018,
  frameThickness = 0.05, // Made this a parameter instead of hardcoded value
  bottomFrameThickness = 0.045, // In meters (default 50mm)
  fullInnerWidth = 0, // only applicable to corner cabinet
  openingOrientation = false // only applicable to corner cabinet
}) {
  // Calculate dimensions
  const width = carcassInnerWidth + 0.036
  const height = carcassHeight + 0.0262 + (bottomFrameThickness - 0.045)
  const hOffset = carcassHeight - height
  const zOffset = frameThickness - panelThickness

  const holeHeight = carcassHeight - 0.009
  const holeYOffset = panelThickness + (bottomFrameThickness - 0.045) / 2

  // Create panel shape with holes
  const shape = useMemo(() => {
    const panelShape = new THREE.Shape()

    // Outer panel shape
    panelShape.moveTo(-width / 2, -height / 2)
    panelShape.lineTo(width / 2, -height / 2)
    panelShape.lineTo(width / 2, height / 2)
    panelShape.lineTo(-width / 2, height / 2)
    panelShape.closePath()

    // Define hole boundaries
    const holeBottom = -holeHeight / 2 + holeYOffset
    const holeTop = holeHeight / 2 + holeYOffset - panelThickness
    const totalHoleHeight = holeTop - holeBottom

    // Create holes based on numHoles and ratios
    if (numHoles === 1) {
      addHole(panelShape, carcassInnerWidth, holeBottom, holeTop)
    } else if (ratios && ratios.length === numHoles) {
      // Custom ratios provided
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness

      // Create hole boundaries based on custom ratios
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight = (ratios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThickness
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, carcassInnerWidth, bottom, top)
      })
    } else if (numHoles === 3) {
      // Special case for 3 holes with ratio 8321 : 8312 : 4925
      const defaultRatios = [8321, 8312, 4925]
      const sumRatios = defaultRatios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness

      // Create hole boundaries based on ratios
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight =
          (defaultRatios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThickness
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, carcassInnerWidth, bottom, top)
      })
    } else {
      // Calculate dimensions for multiple holes with equal sizes
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThickness
      const singleHoleHeight = availableHeight / numHoles

      // Create hole boundaries
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        const currentTop = currentBottom + singleHoleHeight
        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThickness
      }

      // Adjust the last top boundary to match exactly
      if (boundaries.length > 0) {
        boundaries[boundaries.length - 1].top = holeTop
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, carcassInnerWidth, bottom, top)
      })
    }

    return panelShape
  }, [
    width,
    height,
    carcassInnerWidth,
    holeHeight,
    holeYOffset,
    numHoles,
    dividerThickness,
    panelThickness,
    ratios
  ])

  // Helper function to add a hole with specified boundaries
  function addHole(shape, width, bottom, top) {
    const holeShape = new THREE.Shape()
    holeShape.moveTo(-width / 2, bottom)
    holeShape.lineTo(width / 2, bottom)
    holeShape.lineTo(width / 2, top)
    holeShape.lineTo(-width / 2, top)
    holeShape.closePath()
    shape.holes.push(holeShape)
  }

  const offset =
    openingOrientation === 'right'
      ? fullInnerWidth / 2 - carcassInnerWidth / 2
      : -fullInnerWidth / 2 + carcassInnerWidth / 2

  return (
    <mesh
      receiveShadow
      position={[
        openingOrientation ? offset : 0,
        height / 2 + hOffset,
        carcassDepth / 2 - zOffset
      ]}
    >
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
