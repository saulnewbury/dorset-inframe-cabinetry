// DoorTypes/SingleDoor.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { createPanelShape } from '@/utils/doorCalculations'

export function SingleDoor({
  doorX,
  doorY,
  depth,
  pt,
  doorThickness,
  doorGap,
  doorGapAtBottom,
  doorWidth,
  doorHeight,
  panelWidth,
  panelHeight,
  holeInset
}) {
  // Create panel shape for this specific door
  const panelShape = createPanelShape({
    THREE,
    width: panelWidth,
    height: panelHeight,
    holeInset: holeInset,
    doorGapAtBottom: doorGapAtBottom
  })

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: pt,
    bevelEnabled: false
  }

  return (
    <group>
      {/* Individual panel with hole */}
      <mesh position={[doorX, doorY, depth / 2 - pt + doorThickness]}>
        <extrudeGeometry args={[panelShape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Single door front */}
      <mesh
        position={[
          doorX,
          doorY - doorGapAtBottom / 2,
          depth / 2 + doorThickness / 2 - 0.001
        ]}
      >
        <boxGeometry
          args={[doorWidth - 2 * doorGap, doorHeight, doorThickness / 2]}
        />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>
    </group>
  )
}
