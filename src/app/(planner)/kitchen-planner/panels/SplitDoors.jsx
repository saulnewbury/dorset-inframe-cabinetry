// DoorTypes/SplitDoors.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { createPanelShape } from '@/utils/doorCalculations'

export function SplitDoors({
  doorX,
  doorY,
  depth,
  panelThickness,
  doorGapAtBottomM,
  doorGapM,
  doorWidth,
  doorHeight,
  panelWidth,
  panelHeight,
  holeInsetM,
  splitGapM,
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  ratio = [1, 1] // Default 1:1 ratio for split doors
}) {
  // panelThickness = 18 / 1000

  // Extract ratio values
  const [ratio1, ratio2] = ratio
  const totalRatio = ratio1 + ratio2

  // Calculate dimensions for split panels based on orientation and ratio
  let panel1Width, panel1Height, panel2Width, panel2Height
  let door1Width, door1Height, door2Width, door2Height
  let pos1X, pos1Y, pos2X, pos2Y

  if (orientation === 'horizontal') {
    // Horizontal split (side by side)
    panel1Width = (panelWidth * ratio1) / totalRatio - splitGapM / 2
    panel1Height = panelHeight
    panel2Width = (panelWidth * ratio2) / totalRatio - splitGapM / 2
    panel2Height = panelHeight

    door1Width =
      ((doorWidth - 2 * doorGapM) * ratio1) / totalRatio - splitGapM / 2
    door1Height = doorHeight
    door2Width =
      ((doorWidth - 2 * doorGapM) * ratio2) / totalRatio - splitGapM / 2
    door2Height = doorHeight

    // Calculate positions
    const midpoint = doorX
    const totalWidth = panelWidth
    const leftPanelCenterOffset = -(totalWidth / 2) + panel1Width / 2
    const rightPanelCenterOffset = totalWidth / 2 - panel2Width / 2

    pos1X = midpoint + leftPanelCenterOffset + splitGapM / 4
    pos1Y = doorY
    pos2X = midpoint + rightPanelCenterOffset - splitGapM / 4
    pos2Y = doorY
  } else {
    // Vertical split (top and bottom)
    panel1Width = panelWidth - doorGapM * 2
    panel1Height = (panelHeight * ratio1) / totalRatio - splitGapM / 2
    panel2Width = panelWidth - doorGapM * 2
    panel2Height = (panelHeight * ratio2) / totalRatio - splitGapM / 2

    door1Width = doorWidth - (2 * doorGapM) / 2
    door1Height =
      ((doorHeight - 2 * doorGapM) * ratio1) / totalRatio - splitGapM / 2
    door2Width = doorWidth - (2 * doorGapM) / 2
    door2Height =
      ((doorHeight - 2 * doorGapM) * ratio2) / totalRatio - splitGapM / 2

    // Calculate positions
    const midpoint = doorY
    const totalHeight = panelHeight
    const topPanelCenterOffset = totalHeight / 2 - panel1Height / 2
    const bottomPanelCenterOffset =
      -(totalHeight / 2) + panel2Height / 2 - splitGapM

    pos1X = doorX
    pos1Y = midpoint + topPanelCenterOffset - splitGapM / 4
    pos2X = doorX
    pos2Y =
      midpoint + bottomPanelCenterOffset + splitGapM / 4 + doorGapAtBottomM / 2
  }

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: panelThickness,
    bevelEnabled: false
  }

  // Create panel shapes for both panels
  const panel1Shape = createPanelShape({
    THREE,
    width: panel1Width,
    height: panel1Height,
    holeInset: holeInsetM,
    doorGapAtBottom: orientation === 'vertical' ? 0 : doorGapAtBottomM
  })

  const panel2Shape = createPanelShape({
    THREE,
    width: panel2Width,
    height: panel2Height,
    holeInset: holeInsetM,
    doorGapAtBottom:
      orientation === 'vertical' ? doorGapAtBottomM : doorGapAtBottomM
  })

  return (
    <group>
      {/* First panel and door */}
      <mesh
        position={[pos1X, pos1Y, depth / 2 - panelThickness + panelThickness]}
      >
        <extrudeGeometry args={[panel1Shape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      <mesh
        position={[
          pos1X,
          pos1Y - (orientation === 'vertical' ? 0 : doorGapAtBottomM / 2),
          depth / 2 + panelThickness / 2 - 0.001
        ]}
      >
        <boxGeometry args={[door1Width, door1Height, panelThickness / 2]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Second panel and door */}
      <mesh
        position={[pos2X, pos2Y, depth / 2 - panelThickness + panelThickness]}
      >
        <extrudeGeometry args={[panel2Shape, extrudeSettings]} />
        <meshStandardMaterial color='white' side={THREE.DoubleSide} />
        <Edges threshold={5} color='gray' />
      </mesh>

      <mesh
        position={[
          pos2X,
          pos2Y - (orientation === 'vertical' ? 0 : doorGapAtBottomM / 2),
          depth / 2 + panelThickness / 2 - 0.001
        ]}
      >
        <boxGeometry args={[door2Width, door2Height, panelThickness / 2]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>
    </group>
  )
}
