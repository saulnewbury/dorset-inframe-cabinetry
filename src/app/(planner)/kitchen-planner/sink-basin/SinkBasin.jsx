'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

const SinkBasin = ({
  carcassDepth,
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
  rotation = [-Math.PI / 2, 0, 0]
}) => {
  const width = carcassInnerWidth / 1000 - 0.018
  const depth = (carcassDepth * 0.8) / 1000
  const height = 200 / 1000
  const y = carcassHeight / 1000

  // Create the sink basin geometry
  const geometry = useMemo(() => {
    // Create the outer shape with rounded corners
    const outerShape = new THREE.Shape()

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

    // Create the inner hole with rounded corners
    const innerHole = new THREE.Path()

    innerHole.moveTo(cornerRadius + edgeWidth, edgeWidth)
    innerHole.lineTo(width - cornerRadius - edgeWidth, edgeWidth)
    innerHole.arc(0, cornerRadius, cornerRadius, -Math.PI / 2, 0, false)
    innerHole.lineTo(width - edgeWidth, depth - cornerRadius - edgeWidth)
    innerHole.arc(-cornerRadius, 0, cornerRadius, 0, Math.PI / 2, false)
    innerHole.lineTo(cornerRadius + edgeWidth, depth - edgeWidth)
    innerHole.arc(0, -cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false)
    innerHole.lineTo(edgeWidth, cornerRadius + edgeWidth)
    innerHole.arc(
      cornerRadius,
      0,
      cornerRadius,
      Math.PI,
      (Math.PI * 3) / 2,
      false
    )

    // Add the hole to the shape
    outerShape.holes.push(innerHole)

    return new THREE.ExtrudeGeometry(outerShape, {
      depth: height,
      bevelEnabled: false
    })
  }, [width, depth, height, cornerRadius, edgeWidth])

  // Calculate base panel position
  const basePanelPosition = [0, y - (height + baseGap) + 0.03, depth * 0.1]
  const basinPosition = [-width / 2, y - height, depth / 2 + depth * 0.1]

  return (
    <>
      <mesh rotation={rotation} position={basinPosition} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={basePanelPosition} rotation={rotation}>
        <boxGeometry args={[width, depth - 0.03, baseThickness]} />
        <meshStandardMaterial color={baseColor} />
        <Edges color='gray' renderOrder={1000} />
      </mesh>
    </>
  )
}

export default SinkBasin
