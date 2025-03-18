import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

export default function CabinetFrame({
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles,
  ratios = null, // New parameter for custom ratios
  dividerThickness = 18
}) {
  // Convert dimensions from mm to meters
  const carcassOuterWidth = carcassInnerWidth + 36
  const frameHeight = carcassHeight + 26.2

  const frameThickness = 50 / 1000
  const width = carcassOuterWidth / 1000

  const height = frameHeight / 1000
  const depth = carcassDepth / 1000
  const hOffset = carcassHeight / 1000 - frameHeight / 1000
  const zOffset = frameThickness - panelThickness
  const dividerThicknessM = dividerThickness / 1000

  const holeHeight = carcassHeight / 1000 - 9 / 1000
  const holeWidth = carcassInnerWidth / 1000
  const holeYOffset = panelThickness

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
      addSingleHole(panelShape, holeWidth, holeBottom, holeTop)
    } else if (ratios && ratios.length === numHoles) {
      // Custom ratios provided
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM

      // Create hole boundaries based on custom ratios
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight = (ratios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThicknessM
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, holeWidth, bottom, top)
      })
    } else if (numHoles === 3) {
      // Special case for 3 holes with ratio 8321 : 8312 : 4925
      const defaultRatios = [8321, 8312, 4925]
      const sumRatios = defaultRatios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM

      // Create hole boundaries based on ratios
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight =
          (defaultRatios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThicknessM
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, holeWidth, bottom, top)
      })
    } else {
      // Calculate dimensions for multiple holes with equal sizes
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM
      const singleHoleHeight = availableHeight / numHoles

      // Create hole boundaries
      const boundaries = []
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        const currentTop = currentBottom + singleHoleHeight
        boundaries.push({ bottom: currentBottom, top: currentTop })
        currentBottom = currentTop + dividerThicknessM
      }

      // Adjust the last top boundary to match exactly
      if (boundaries.length > 0) {
        boundaries[boundaries.length - 1].top = holeTop
      }

      // Create hole for each boundary
      boundaries.forEach(({ bottom, top }) => {
        addHole(panelShape, holeWidth, bottom, top)
      })
    }

    return panelShape
  }, [
    width,
    height,
    holeWidth,
    holeHeight,
    holeYOffset,
    numHoles,
    dividerThicknessM,
    panelThickness,
    ratios
  ])

  // Helper function to add a single hole
  function addSingleHole(shape, width, bottom, top) {
    const holeShape = new THREE.Shape()
    holeShape.moveTo(-width / 2, bottom)
    holeShape.lineTo(width / 2, bottom)
    holeShape.lineTo(width / 2, top)
    holeShape.lineTo(-width / 2, top)
    holeShape.closePath()
    shape.holes.push(holeShape)
  }

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

  return (
    <mesh position={[0, height / 2 + hOffset, depth / 2 - zOffset]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: frameThickness,
            bevelEnabled: false
          }
        ]}
      />
      <meshStandardMaterial color='white' />
      <Edges threshold={5} color='gray' renderOrder={1000} />
    </mesh>
  )
}
