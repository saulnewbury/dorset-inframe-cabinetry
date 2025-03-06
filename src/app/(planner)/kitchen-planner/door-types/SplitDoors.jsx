// DoorTypes/SplitDoors.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { createPanelShape } from '@/utils/doorCalculations'

export function SplitDoors({
  doorX,
  doorY,
  depth,
  pt,
  doorThicknessM,
  doorGapAtBottomM,
  doorWidth,
  doorHeight,
  panelWidth,
  panelHeight,
  holeInsetM,
  splitGapM
}) {
  // Calculate dimensions for split panels
  const panelHalfWidth = panelWidth / 2 - splitGapM / 2
  const doorHalfWidth = (doorWidth - 2 * doorGapM) / 2 - splitGapM / 2

  // Positions for split panels and doors
  const leftX = doorX - panelWidth / 4 - splitGapM / 4
  const rightX = doorX + panelWidth / 4 + splitGapM / 4

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: pt,
    bevelEnabled: false
  }

  // Create panel shapes
  const leftPanelShape = createPanelShape({
    THREE,
    width: panelHalfWidth,
    height: panelHeight,
    holeInset: holeInsetM,
    doorGapAtBottom: doorGapAtBottomM
  })

  const rightPanelShape = createPanelShape({
    THREE,
    width: panelHalfWidth,
    height: panelHeight,
    holeInset: holeInsetM,
    doorGapAtBottom: doorGapAtBottomM
  })

  return (
    <group>
      {/* Left panel */}
      <mesh position={[leftX, doorY, depth / 2 - pt + doorThicknessM]}>
        <extrudeGeometry args={[leftPanelShape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Left door */}
      <mesh
        position={[
          leftX,
          doorY - doorGapAtBottomM / 2,
          depth / 2 + doorThicknessM / 2 - 0.001
        ]}
      >
        <boxGeometry args={[doorHalfWidth, doorHeight, doorThicknessM / 2]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Right panel */}
      <mesh position={[rightX, doorY, depth / 2 - pt + doorThicknessM]}>
        <extrudeGeometry args={[rightPanelShape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Right door */}
      <mesh
        position={[
          rightX,
          doorY - doorGapAtBottomM / 2,
          depth / 2 + doorThicknessM / 2 - 0.001
        ]}
      >
        <boxGeometry args={[doorHalfWidth, doorHeight, doorThicknessM / 2]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>
    </group>
  )
}
