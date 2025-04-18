'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

import { lineColor } from './colors'

const SinkBasin = ({
  basin = null,
  depth,
  width,
  height,
  carcassHeight,
  color
}) => {
  const baseThickness = 0.018
  const baseGap = 0.009
  const metalness = 0.2
  const roughness = 0.5
  const rotation = [-Math.PI / 2, 0, 0]
  const cornerRadius = 0.02
  const edgeWidth = 0.02

  const y = carcassHeight

  // Make belfast sink the entire width of the cabinet
  // ('* 0.5' shaves a little off to improve strange visal effect)
  if (basin.type === 'belfast') width += 0.036 + 0.018 * 0.5

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

    // Function to create a single hole with rounded corners
    const createHole = (x, w) => {
      const hole = new THREE.Path()
      hole.moveTo(x + cornerRadius + edgeWidth, edgeWidth)
      hole.lineTo(x + w - cornerRadius - edgeWidth, edgeWidth)
      hole.arc(0, cornerRadius, cornerRadius, -Math.PI / 2, 0, false)
      hole.lineTo(x + w - edgeWidth, depth - cornerRadius - edgeWidth)
      hole.arc(-cornerRadius, 0, cornerRadius, 0, Math.PI / 2, false)
      hole.lineTo(x + cornerRadius + edgeWidth, depth - edgeWidth)
      hole.arc(0, -cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false)
      hole.lineTo(x + edgeWidth, cornerRadius + edgeWidth)
      hole.arc(cornerRadius, 0, cornerRadius, Math.PI, (Math.PI * 3) / 2, false)
      return hole
    }

    if (basin.doubleBasin) {
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
  }, [width, depth, height, cornerRadius, edgeWidth, basin.doubleBasin])

  // Calculate positions
  const basinPosition = [-width / 2, y - height, +depth / 2]
  const basePanelPosition = [0, y - (height + baseGap) + 0.03, 0]
  const zPosStandard = edgeWidth / 2 + 0.018
  const zPosBelfast = edgeWidth / 2 + 0.018 + 0.05

  return (
    <group
      position-z={basin.type === 'belfast' ? zPosBelfast : zPosStandard}
      position-y={basin.type === 'belfast' ? height : height - basin.height}
    >
      <mesh
        receiveShadow
        rotation={rotation}
        position={basinPosition}
        geometry={geometry}
      >
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          side={THREE.DoubleSide}
        />
        <Edges color={lineColor} renderOrder={1000} />
      </mesh>

      <mesh receiveShadow position={basePanelPosition} rotation={rotation}>
        <boxGeometry args={[width - 0.012, depth - 0.012, baseThickness]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

export default SinkBasin
