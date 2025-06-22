import React, { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export default function CornerDoor({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  panelThickness,
  doorThickness = 0.018,
  doorGap = 0.002,
  mouldingSize = 0.004,
  frameInset = 0.004,
  holeInset = 0.065,
  openingOrientation = false, // only for corner cabinet
  fullInnerWidth = 0 // only for corner cabinet
}) {
  // Calculate frame and door dimensions
  const frameHeight = carcassHeight + 0.0262
  const hOffset = carcassHeight - frameHeight

  // Calculate boundary dimensions for the single hole
  const boundary = useMemo(() => {
    const holeHeight = carcassHeight - 0.009
    const holeWidth = carcassInnerWidth
    const holeYOffset = panelThickness

    const holeBottom = -holeHeight / 2 + holeYOffset
    const holeTop = holeHeight / 2 + holeYOffset - panelThickness

    return {
      bottom: holeBottom,
      top: holeTop,
      left: -holeWidth / 2,
      right: holeWidth / 2
    }
  }, [carcassHeight, carcassInnerWidth, panelThickness])

  // Door gap at bottom
  const doorGapAtBottom = 0.002

  // Calculate dimensions with appropriate gaps
  const totalInset = frameInset + mouldingSize + doorGap
  const doorWidth = boundary.right - boundary.left - 2 * totalInset
  const doorHeight =
    boundary.top - boundary.bottom - 2 * totalInset - doorGapAtBottom

  // Position of the door
  const doorX = (boundary.left + boundary.right) / 2
  const doorY = (boundary.bottom + boundary.top) / 2

  // Panel width and height for panel with hole
  const mouldingWidth = 0.009
  const panelWidth = boundary.right - boundary.left - 2 * mouldingWidth
  const panelHeight = boundary.top - boundary.bottom - 2 * mouldingWidth

  // Create panel shape for the door
  const panelShape = useMemo(() => {
    const shape = new THREE.Shape()

    // Create outer shape with proper gap adjustment
    shape.moveTo(-panelWidth / 2, -panelHeight / 2 + doorGapAtBottom)
    shape.lineTo(panelWidth / 2, -panelHeight / 2 + doorGapAtBottom)
    shape.lineTo(panelWidth / 2, panelHeight / 2)
    shape.lineTo(-panelWidth / 2, panelHeight / 2)
    shape.lineTo(-panelWidth / 2, -panelHeight / 2 + doorGapAtBottom)

    // Create hole with proper gap adjustment
    const holeShape = new THREE.Path()
    holeShape.moveTo(
      -panelWidth / 2 + holeInset,
      -panelHeight / 2 + holeInset + doorGapAtBottom
    )
    holeShape.lineTo(
      panelWidth / 2 - holeInset,
      -panelHeight / 2 + holeInset + doorGapAtBottom
    )
    holeShape.lineTo(panelWidth / 2 - holeInset, panelHeight / 2 - holeInset)
    holeShape.lineTo(-panelWidth / 2 + holeInset, panelHeight / 2 - holeInset)
    holeShape.lineTo(
      -panelWidth / 2 + holeInset,
      -panelHeight / 2 + holeInset + doorGapAtBottom
    )

    // Add hole to panel shape
    shape.holes.push(holeShape)

    return shape
  }, [panelWidth, panelHeight, holeInset, doorGapAtBottom])

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: panelThickness,
    bevelEnabled: false
  }

  const offset =
    openingOrientation === 'right'
      ? fullInnerWidth / 2 - carcassInnerWidth / 2
      : -fullInnerWidth / 2 + carcassInnerWidth / 2

  return (
    <group
      position={[openingOrientation ? offset : 0, frameHeight / 2 + hOffset, 0]}
    >
      {/* Individual panel with hole */}
      <mesh
        position={[
          doorX,
          doorY,
          carcassDepth / 2 - panelThickness + doorThickness
        ]}
      >
        <extrudeGeometry args={[panelShape, extrudeSettings]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        <Edges threshold={5} color={lineColor} />
      </mesh>

      {/* Door front */}
      <mesh
        position={[
          doorX,
          doorY - doorGapAtBottom / 2,
          carcassDepth / 2 + doorThickness / 2 - 0.001
        ]}
      >
        <boxGeometry
          args={[doorWidth - 2 * doorGap, doorHeight, doorThickness / 2]}
        />
        <meshStandardMaterial color={color} />
        <Edges threshold={5} color={lineColor} />
      </mesh>
    </group>
  )
}
