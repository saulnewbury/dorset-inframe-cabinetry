// Oven.jsx
import React, { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { createPanelShape } from '@/utils/doorCalculations'

import { lineColor } from './colors'

export default function Oven({
  boundary, // Single boundary object
  carcassDepth,
  ovenThickness = 0.018, // Thickness of the oven front in meters
  ovenGap = 0.002, // Gap between oven and moulding frame in meters
  mouldingSize = 0.004, // Moulding size in meters
  frameInset = 0.004, // Frame inset in meters
  ovenHandleType = 'bar', // Optional handle type
  type = 'double', // Changed default from 'glass' to 'single'
  compartmentRatio = [2, 3] // Ratio between compartments for double oven (default 1:1)
}) {
  // Calculate oven dimensions with appropriate gaps
  const totalInset = frameInset + mouldingSize + ovenGap
  const ovenWidth = boundary.right - boundary.left - 2 * totalInset
  const ovenHeight = boundary.top - boundary.bottom - 2 * totalInset

  // Center position of the oven
  const ovenX = (boundary.left + boundary.right) / 2
  const ovenY = (boundary.bottom + boundary.top) / 2

  const cpanel = 0.1
  // Calculate compartment heights based on ratio
  const [ratio1, ratio2] = compartmentRatio
  const totalRatio = ratio1 + ratio2

  // Total available height for both compartments
  const totalCompartmentHeight = ovenHeight - cpanel

  // Calculate individual compartment heights based on ratio
  const topCompartmentHeight = (totalCompartmentHeight * ratio1) / totalRatio
  const bottomCompartmentHeight = (totalCompartmentHeight * ratio2) / totalRatio

  const knobs = [
    { x: -ovenWidth / 2 + 0.06 },
    { x: -ovenWidth / 2 + 0.134 },
    { x: ovenWidth / 2 - 0.06 },
    { x: ovenWidth / 2 - 0.134 }
  ]

  // Using createPanelShape from doorCalculations
  const createOvenFrontShape = (width, height, borderWidth) => {
    // Try to use the shared utility function first
    try {
      return createPanelShape({
        THREE,
        width,
        height,
        holeInset: borderWidth,
        doorGapAtBottom: 0 // No bottom gap needed for oven
      })
    } catch (error) {
      // Fallback to custom implementation if the imported function doesn't work
      console.warn('Using fallback shape creation for oven:', error)

      const shape = new THREE.Shape()

      // Outer rectangle (full dimensions)
      shape.moveTo(-width / 2, -height / 2)
      shape.lineTo(width / 2, -height / 2)
      shape.lineTo(width / 2, height / 2)
      shape.lineTo(-width / 2, height / 2)
      shape.lineTo(-width / 2, -height / 2)

      // Inner rectangle (creating the depression)
      const innerShape = new THREE.Path()
      innerShape.moveTo(-width / 2 + borderWidth, -height / 2 + borderWidth)
      innerShape.lineTo(width / 2 - borderWidth, -height / 2 + borderWidth)
      innerShape.lineTo(width / 2 - borderWidth, height / 2 - borderWidth)
      innerShape.lineTo(-width / 2 + borderWidth, height / 2 - borderWidth)
      innerShape.lineTo(-width / 2 + borderWidth, -height / 2 + borderWidth)

      // Add the inner shape as a hole
      shape.holes.push(innerShape)

      return shape
    }
  }

  // Handle rendering based on oven type
  const renderOvenHandle = (compartmentHeight) => {
    // This could be expanded to support different handle types
    if (ovenHandleType === 'bar') {
      // Bar handle dimensions
      const handleWidth = ovenWidth * 0.7
      const handleHeight = 0.01
      const handleDepth = 0.02
      const handleOffset = 0.02

      return (
        <mesh
          receiveShadow
          position={[
            0,
            compartmentHeight / 2 - 0.05,
            ovenThickness / 2 + handleOffset
          ]}
        >
          <meshStandardMaterial color='white' />

          <boxGeometry args={[handleWidth, handleHeight, handleDepth]} />
          <Edges threshold={5} color={lineColor} />
        </mesh>
      )
    }

    // Could add more handle types here
    return null
  }

  return (
    <group
      position={[ovenX, ovenY, carcassDepth / 2 + ovenThickness / 2 - 0.001]}
    >
      {/* Oven front */}
      {type === 'compact' && (
        <group>
          <mesh receiveShadow position-y={-cpanel / 2}>
            <boxGeometry
              args={[ovenWidth, ovenHeight - cpanel, ovenThickness]}
            />
            <meshStandardMaterial color='white' metalness={0.4} roughness={1} />
            <Edges threshold={5} color={lineColor} />
          </mesh>
          {renderOvenHandle(ovenHeight - 0.15)}
        </group>
      )}

      {type === 'double' && (
        <group position-y={-cpanel / 2}>
          {/* Top Compartment */}
          <group
            position-y={(ovenHeight - topCompartmentHeight) / 2 - cpanel / 2}
          >
            <mesh receiveShadow>
              <boxGeometry
                args={[ovenWidth, topCompartmentHeight, ovenThickness]}
              />
              <meshStandardMaterial
                color='white'
                metalness={0.4}
                roughness={1}
              />
              <Edges threshold={5} color={lineColor} />
            </mesh>
            {renderOvenHandle(topCompartmentHeight + 0.05)}
          </group>

          {/* Bottom Compartment */}
          <group
            position-y={
              -(ovenHeight - bottomCompartmentHeight) / 2 + cpanel / 2
            }
          >
            <mesh receiveShadow>
              <boxGeometry
                args={[ovenWidth, bottomCompartmentHeight, ovenThickness]}
              />
              <meshStandardMaterial
                color='white'
                metalness={0.4}
                roughness={1}
              />
              <Edges threshold={5} color={lineColor} />
            </mesh>
            {renderOvenHandle(bottomCompartmentHeight + 0.05)}
          </group>
        </group>
      )}

      {/* Updated 'single' type with box and extruded geometries */}
      {type === 'single' && (
        <group position-y={-cpanel / 2} position-z={-ovenThickness / 2}>
          <mesh
            receiveShadow
            position-y={-cpanel / 2}
            position-z={ovenThickness / 2}
          >
            <boxGeometry
              args={[ovenWidth, ovenHeight - cpanel, ovenThickness / 2]}
            />
            <meshStandardMaterial color='white' metalness={0.4} roughness={1} />
            <Edges threshold={5} color={lineColor} />
          </mesh>
          <mesh receiveShadow>
            <extrudeGeometry
              args={[
                createOvenFrontShape(
                  ovenWidth,
                  ovenHeight - cpanel,
                  0.075 // 75mm border in meters
                ),
                {
                  depth: ovenThickness,
                  bevelEnabled: false
                }
              ]}
            />
            <meshStandardMaterial color='white' metalness={0.4} roughness={1} />
            <Edges threshold={5} color={lineColor} />
          </mesh>
          {renderOvenHandle(ovenHeight - 0.05)}
        </group>
      )}

      {/* cpanel */}
      <group position={[0, ovenHeight / 2 - cpanel / 2, 0]}>
        {/* panel */}
        <mesh receiveShadow>
          <boxGeometry args={[ovenWidth, cpanel, ovenThickness]} />
          <meshStandardMaterial color='white' metalness={0.4} roughness={1} />
          <Edges threshold={5} color={lineColor} />
        </mesh>
        {/* Digital display */}
        <mesh receiveShadow>
          <boxGeometry
            args={[ovenWidth / 5, cpanel / 3, ovenThickness * 1.1]}
          />
          <meshStandardMaterial color='darkgray' />
          <Edges threshold={5} color={lineColor} />
        </mesh>
        {/* Knobs */}
        {knobs.map((knob, idx) => {
          return (
            <mesh
              receiveShadow
              key={idx}
              position={[knob.x, 0, 0.015]}
              rotation-x={Math.PI * 0.5}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.01]} />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color={lineColor} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
