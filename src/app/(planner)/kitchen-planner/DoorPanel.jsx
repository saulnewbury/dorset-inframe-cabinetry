import React, { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export default function DoorPanel({
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles = 4,
  dividerThickness = 18,
  doorThickness = 18, // Thickness of the door front in mm
  doorGap = 2, // Gap between door and moulding frame in mm
  mouldingSize = 4, // Moulding size in mm
  frameInset = 4, // Frame inset in mm
  holeInset = 65, // Distance from edge to hole in mm
  mouldingWidth = 9, // Width of the moulding in mm
  splitDoors = true, // Whether to split each door into two
  splitGap = 2 // Gap between split doors in mm
}) {
  // Convert dimensions from mm to meters
  const frameHeight = carcassHeight + 26.2
  const pt = panelThickness / 1000
  const height = frameHeight / 1000
  const depth = carcassDepth / 1000
  const width = carcassInnerWidth / 1000
  const hOffset = carcassHeight / 1000 - frameHeight / 1000
  const doorThicknessM = doorThickness / 1000
  const doorGapM = doorGap / 1000
  const mouldingSizeM = mouldingSize / 1000
  const frameInsetM = frameInset / 1000
  const dividerThicknessM = dividerThickness / 1000
  const holeInsetM = holeInset / 1000
  const mouldingWidthM = mouldingWidth / 1000
  const splitGapM = splitGap / 1000
  const doorGapAtBottomM = 2 / 1000 // 2mm gap at bottom in meters

  const holeHeight = carcassHeight / 1000 - 9 / 1000
  const holeWidth = carcassInnerWidth / 1000
  const holeYOffset = pt

  // Calculate hole boundaries based on numHoles
  const doorBoundaries = useMemo(() => {
    const boundaries = []

    // Define hole boundaries
    const holeBottom = -holeHeight / 2 + holeYOffset
    const holeTop = holeHeight / 2 + holeYOffset - pt
    const totalHoleHeight = holeTop - holeBottom

    if (numHoles === 1) {
      // Single hole
      boundaries.push({
        bottom: holeBottom,
        top: holeTop,
        left: -holeWidth / 2,
        right: holeWidth / 2
      })
    } else if (numHoles === 3) {
      // Special case for 3 holes with ratio 8321 : 8312 : 4925
      const ratios = [8321, 8312, 4925]
      const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

      // Calculate available height after accounting for dividers
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM

      // Create hole boundaries based on ratios
      let currentBottom = holeBottom

      for (let i = 0; i < numHoles; i++) {
        // Calculate the current hole height based on its ratio
        const currentHoleHeight = (ratios[i] / sumRatios) * availableHeight
        const currentTop = currentBottom + currentHoleHeight

        boundaries.push({
          bottom: currentBottom,
          top: currentTop,
          left: -holeWidth / 2,
          right: holeWidth / 2
        })

        currentBottom = currentTop + dividerThicknessM
      }
    } else {
      // Multiple holes with dividers (equal size)
      const numDividers = numHoles - 1
      const availableHeight = totalHoleHeight - numDividers * dividerThicknessM
      const singleHoleHeight = availableHeight / numHoles

      let currentBottom = holeBottom
      for (let i = 0; i < numHoles; i++) {
        const currentTop =
          i === numHoles - 1 ? holeTop : currentBottom + singleHoleHeight

        boundaries.push({
          bottom: currentBottom,
          top: currentTop,
          left: -holeWidth / 2,
          right: holeWidth / 2
        })

        currentBottom = currentTop + dividerThicknessM
      }
    }

    return boundaries
  }, [holeHeight, holeWidth, holeYOffset, numHoles, dividerThicknessM, pt])

  // Create a door and panel for each hole
  const DoorPanels = () => {
    return doorBoundaries.map((hole, index) => {
      // Calculate door dimensions with appropriate gaps
      // Account for frame inset, moulding size and door gap
      const totalInset = frameInsetM + mouldingSizeM + doorGapM

      const doorWidth = hole.right - hole.left - 2 * totalInset
      const doorHeight = hole.top - hole.bottom - 2 * totalInset

      // Center position of the door
      const doorX = (hole.left + hole.right) / 2
      const doorY = (hole.bottom + hole.top) / 2

      // Calculate panel dimensions (smaller than the door area, accounting for moulding)
      const panelWidth = hole.right - hole.left - 2 * mouldingWidthM
      // Adjust panel height to leave a 2mm gap at the bottom
      const panelHeight =
        hole.top - hole.bottom - 2 * mouldingWidthM - doorGapAtBottomM

      // Create panel and door geometry

      // Create panel and door geometry
      if (splitDoors) {
        // For split doors, create two separate panels and doors

        // Calculate dimensions for split panels
        const panelHalfWidth = panelWidth / 2 - splitGapM / 2

        // Left panel
        const leftPanelShape = new THREE.Shape()
        leftPanelShape.moveTo(
          -panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        leftPanelShape.lineTo(
          panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        leftPanelShape.lineTo(
          panelHalfWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        leftPanelShape.lineTo(
          -panelHalfWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        leftPanelShape.lineTo(
          -panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )

        // Left panel hole - maintain 65mm inset on all sides
        const leftHoleShape = new THREE.Path()
        leftHoleShape.moveTo(
          -panelHalfWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        leftHoleShape.lineTo(
          panelHalfWidth / 2 - holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        leftHoleShape.lineTo(
          panelHalfWidth / 2 - holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        leftHoleShape.lineTo(
          -panelHalfWidth / 2 + holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        leftHoleShape.lineTo(
          -panelHalfWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        leftPanelShape.holes.push(leftHoleShape)

        // Right panel
        const rightPanelShape = new THREE.Shape()
        rightPanelShape.moveTo(
          -panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        rightPanelShape.lineTo(
          panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        rightPanelShape.lineTo(
          panelHalfWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        rightPanelShape.lineTo(
          -panelHalfWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        rightPanelShape.lineTo(
          -panelHalfWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )

        // Right panel hole - maintain 65mm inset on all sides
        const rightHoleShape = new THREE.Path()
        rightHoleShape.moveTo(
          -panelHalfWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        rightHoleShape.lineTo(
          panelHalfWidth / 2 - holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        rightHoleShape.lineTo(
          panelHalfWidth / 2 - holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        rightHoleShape.lineTo(
          -panelHalfWidth / 2 + holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        rightHoleShape.lineTo(
          -panelHalfWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        rightPanelShape.holes.push(rightHoleShape)

        // Extrude settings
        const extrudeSettings = {
          steps: 1,
          depth: pt,
          bevelEnabled: false
        }

        // Positions for split panels and doors
        const leftX = doorX - panelWidth / 4 - splitGapM / 4
        const rightX = doorX + panelWidth / 4 + splitGapM / 4

        // Calculate door dimensions
        const doorHalfWidth = doorWidth / 2 - splitGapM / 2

        return (
          <group key={`door-group-${index}`}>
            {/* Left panel */}
            <mesh
              position={[
                leftX,
                doorY + doorGapAtBottomM / 2,
                depth / 2 - pt + doorThicknessM
              ]}
            >
              <extrudeGeometry args={[leftPanelShape, extrudeSettings]} />
              <meshStandardMaterial color='white' side={THREE.DoubleSide} />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Left door */}
            <mesh
              position={[leftX, doorY, depth / 2 + doorThicknessM / 2 - 0.001]}
            >
              <boxGeometry
                args={[doorHalfWidth, doorHeight, doorThicknessM / 2]}
              />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Right panel */}
            <mesh
              position={[
                rightX,
                doorY + doorGapAtBottomM / 2,
                depth / 2 - pt + doorThicknessM
              ]}
            >
              <extrudeGeometry args={[rightPanelShape, extrudeSettings]} />
              <meshStandardMaterial color='white' side={THREE.DoubleSide} />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Right door */}
            <mesh
              position={[rightX, doorY, depth / 2 + doorThicknessM / 2 - 0.001]}
            >
              <boxGeometry
                args={[doorHalfWidth, doorHeight, doorThicknessM / 2]}
              />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
          </group>
        )
      } else {
        // Standard single panel with hole and door
        // Create panel shape for this specific door
        const panelShape = new THREE.Shape()
        // Position the panel slightly higher to create the gap at the bottom
        panelShape.moveTo(
          -panelWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        panelShape.lineTo(
          panelWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )
        panelShape.lineTo(
          panelWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        panelShape.lineTo(
          -panelWidth / 2,
          panelHeight / 2 + doorGapAtBottomM / 2
        )
        panelShape.lineTo(
          -panelWidth / 2,
          -panelHeight / 2 + doorGapAtBottomM / 2
        )

        // Create hole shape (65mm from the edge)
        const holeShape = new THREE.Path()
        holeShape.moveTo(
          -panelWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        holeShape.lineTo(
          panelWidth / 2 - holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )
        holeShape.lineTo(
          panelWidth / 2 - holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        holeShape.lineTo(
          -panelWidth / 2 + holeInsetM,
          panelHeight / 2 - holeInsetM + doorGapAtBottomM / 2
        )
        holeShape.lineTo(
          -panelWidth / 2 + holeInsetM,
          -panelHeight / 2 + holeInsetM + doorGapAtBottomM / 2
        )

        // Add hole to panel shape
        panelShape.holes.push(holeShape)

        // Extrude settings
        const extrudeSettings = {
          steps: 1,
          depth: pt,
          bevelEnabled: false
        }

        return (
          <group key={`door-group-${index}`}>
            {/* Individual panel with hole */}
            <mesh
              position={[
                doorX,
                doorY + doorGapAtBottomM / 2,
                depth / 2 - pt + doorThicknessM
              ]}
            >
              <extrudeGeometry args={[panelShape, extrudeSettings]} />
              <meshStandardMaterial color='white' side={THREE.DoubleSide} />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Single door front */}
            <mesh
              position={[doorX, doorY, depth / 2 + doorThicknessM / 2 - 0.001]}
            >
              <boxGeometry args={[doorWidth, doorHeight, doorThicknessM / 2]} />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
          </group>
        )
      }
    })
  }

  return (
    <group position={[0, height / 2 + hOffset, 0]}>
      <DoorPanels />
    </group>
  )
}
