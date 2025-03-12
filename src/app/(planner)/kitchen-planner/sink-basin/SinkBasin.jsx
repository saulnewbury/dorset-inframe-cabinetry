'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

const SinkBasin = ({
  depth,
  carcassInnerWidth,
  carcassHeight,
  cornerRadius = 20 / 1000,
  edgeWidth = 20 / 1000,
  color = '#eeeeee',
  baseColor = '#d3d3d3',
  baseThickness = 18 / 1000,
  baseGap = 9 / 1000,
  metalness = 0.2,
  roughness = 0.5,
  rotation = [-Math.PI / 2, 0, 0],
  doubleBasin = true // Option to create a double basin
}) => {
  // Convert dimensions to meters and apply adjustments
  const width = carcassInnerWidth / 1000 - 0.018

  const height = 200 / 1000
  const y = carcassHeight / 1000

  // Create the sink basin geometry
  const geometry = useMemo(() => {
    const outerShape = new THREE.Shape()

    // Create outer shape with rounded corners
    outerShape.moveTo(cornerRadius, 0)
    outerShape.lineTo(width - cornerRadius, 0)
    outerShape.arc(0, cornerRadius, cornerRadius, -Math.PI / 2, 0, false)
    outerShape.lineTo(width, depth - cornerRadius)
    outerShape.arc(-cornerRadius, 0, cornerRadius, 0, Math.PI / 2, false)
    outerShape.lineTo(cornerRadius, depth)
    outerShape.arc(0, -cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false)
    outerShape.lineTo(0, cornerRadius)
    outerShape.arc(
      cornerRadius,
      0,
      cornerRadius,
      Math.PI,
      (Math.PI * 3) / 2,
      false
    )

    // Function to create a hole with rounded corners
    const createLeftHole = (x, w) => {
      const hole = new THREE.Path()
      hole.moveTo(x + cornerRadius + edgeWidth, edgeWidth)
      hole.lineTo(x + w - cornerRadius - edgeWidth / 2, edgeWidth)
      hole.arc(0, cornerRadius, cornerRadius, -Math.PI / 2, 0, false)
      hole.lineTo(x + w - edgeWidth / 2, depth - cornerRadius - edgeWidth)
      hole.arc(-cornerRadius, 0, cornerRadius, 0, Math.PI / 2, false)
      hole.lineTo(x + cornerRadius + edgeWidth, depth - edgeWidth)
      hole.arc(0, -cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false)
      hole.lineTo(x + edgeWidth, cornerRadius + edgeWidth)
      hole.arc(cornerRadius, 0, cornerRadius, Math.PI, (Math.PI * 3) / 2, false)
      return hole
    }

    const createRightHole = (x, w) => {
      const hole = new THREE.Path()
      hole.moveTo(x + cornerRadius, edgeWidth)
      hole.lineTo(x + w - cornerRadius - edgeWidth, edgeWidth)
      hole.arc(0, cornerRadius, cornerRadius, -Math.PI / 2, 0, false)
      hole.lineTo(x + w - edgeWidth, depth - cornerRadius - edgeWidth)
      hole.arc(-cornerRadius, 0, cornerRadius, 0, Math.PI / 2, false)
      hole.lineTo(x + cornerRadius + edgeWidth / 2, depth - edgeWidth)
      hole.arc(0, -cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false)
      hole.lineTo(x + edgeWidth / 2, cornerRadius + edgeWidth)
      hole.arc(cornerRadius, 0, cornerRadius, Math.PI, (Math.PI * 3) / 2, false)
      return hole
    }

    if (doubleBasin) {
      // Calculate dimensions for two basins in ratio 2:3
      const totalRatio = 2 + 3 // 5 parts total
      const leftBasinWidth = (width * 2) / totalRatio // 2/5 of total width
      const rightBasinWidth = (width * 3) / totalRatio // 3/5 of total width

      // Create left basin hole (smaller basin)
      const leftHole = createLeftHole(0, leftBasinWidth)
      outerShape.holes.push(leftHole)

      // Create right basin hole (larger basin)
      const rightHole = createRightHole(leftBasinWidth, rightBasinWidth)
      outerShape.holes.push(rightHole)
    } else {
      // Create single basin hole
      const singleHole = createHole(0, width)
      outerShape.holes.push(singleHole)
    }

    return new THREE.ExtrudeGeometry(outerShape, {
      depth: height,
      bevelEnabled: false
    })
  }, [width, depth, height, cornerRadius, edgeWidth, doubleBasin, 0])

  // Calculate positions
  const depthOffset = depth * 0.1

  const basinPosition = [-width / 2, y - height, +depth]
  const basePanelPosition = [0, y - (height + baseGap) + 0.03, depth / 2]

  return (
    <group position-z={-depth / 2 + edgeWidth * 2}>
      <mesh rotation={rotation} position={basinPosition} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          side={THREE.DoubleSide}
        />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      <mesh position={basePanelPosition} rotation={rotation}>
        <boxGeometry args={[width, depth - 0.03, baseThickness]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
    </group>
  )
}

export default SinkBasin
