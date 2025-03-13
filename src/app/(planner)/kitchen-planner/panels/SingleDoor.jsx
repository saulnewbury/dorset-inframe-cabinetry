// DoorTypes/SingleDoor.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { createPanelShape } from '@/utils/doorCalculations'

export function SingleDoor({
  doorX,
  doorY,
  depth,
  panelThickness,
  doorGapM,
  doorGapAtBottomM,
  doorWidth,
  doorHeight,
  panelWidth,
  panelHeight,
  holeInsetM
}) {
  // Create panel shape for this specific door
  const panelShape = createPanelShape({
    THREE,
    width: panelWidth,
    height: panelHeight,
    holeInset: holeInsetM,
    doorGapAtBottom: doorGapAtBottomM
  })

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: panelThickness,
    bevelEnabled: false
  }

  return (
    <group>
      {/* Individual panel with hole */}
      <mesh
        position={[doorX, doorY, depth / 2 - panelThickness + panelThickness]}
      >
        <extrudeGeometry args={[panelShape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Single door front */}
      <mesh
        position={[
          doorX,
          doorY - doorGapAtBottomM / 2,
          depth / 2 + panelThickness / 2 - 0.001
        ]}
      >
        <boxGeometry
          args={[doorWidth - 2 * doorGapM, doorHeight, panelThickness / 2]}
        />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>
    </group>
  )
}
