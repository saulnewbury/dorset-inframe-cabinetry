// DoorTypes/FourDoors.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export function FourDoors({
  doorX,
  doorY,
  depth,
  pt,
  doorThicknessM,
  doorGapAtBottomM,
  doorGapM,
  doorWidth,
  doorHeight,
  panelWidth,
  panelHeight,
  holeInsetM,
  splitGapM
}) {
  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: pt,
    bevelEnabled: false
  }

  // Function to create a panel shape with hole for each quadrant
  const createQuarterPanelShape = (quadrant) => {
    // Calculate dimensions for the quadrant
    const quarterWidth = panelWidth / 2 - splitGapM / 2
    const quarterHeight = panelHeight / 2 - splitGapM / 2

    // Determine if this is a bottom panel (needs gap adjustment)
    const isBottomPanel = quadrant === 2 || quadrant === 3

    // Create the panel shape
    const panelShape = new THREE.Shape()

    // Create panel outline
    panelShape.moveTo(
      -quarterWidth / 2,
      -quarterHeight / 2 + (isBottomPanel ? doorGapAtBottomM : 0)
    )
    panelShape.lineTo(
      quarterWidth / 2,
      -quarterHeight / 2 + (isBottomPanel ? doorGapAtBottomM : 0)
    )
    panelShape.lineTo(quarterWidth / 2, quarterHeight / 2)
    panelShape.lineTo(-quarterWidth / 2, quarterHeight / 2)
    panelShape.lineTo(
      -quarterWidth / 2,
      -quarterHeight / 2 + (isBottomPanel ? doorGapAtBottomM : 0)
    )

    // Calculate proportionally scaled hole inset (avoid too large insets for small panels)
    const scaledHoleInset = Math.min(
      holeInsetM,
      quarterWidth / 3,
      quarterHeight / 3
    )

    // Create the hole shape
    const holeShape = new THREE.Path()
    holeShape.moveTo(
      -quarterWidth / 2 + scaledHoleInset,
      -quarterHeight / 2 +
        scaledHoleInset +
        (isBottomPanel ? doorGapAtBottomM : 0)
    )
    holeShape.lineTo(
      quarterWidth / 2 - scaledHoleInset,
      -quarterHeight / 2 +
        scaledHoleInset +
        (isBottomPanel ? doorGapAtBottomM : 0)
    )
    holeShape.lineTo(
      quarterWidth / 2 - scaledHoleInset,
      quarterHeight / 2 - scaledHoleInset
    )
    holeShape.lineTo(
      -quarterWidth / 2 + scaledHoleInset,
      quarterHeight / 2 - scaledHoleInset
    )
    holeShape.lineTo(
      -quarterWidth / 2 + scaledHoleInset,
      -quarterHeight / 2 +
        scaledHoleInset +
        (isBottomPanel ? doorGapAtBottomM : 0)
    )

    // Add the hole to the panel shape
    panelShape.holes.push(holeShape)

    return panelShape
  }

  // Define quadrant positions
  // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
  const getQuadrantPosition = (quadrant) => {
    const horizontalOffset = panelWidth / 4 + splitGapM / 4
    const verticalOffset = panelHeight / 4 + splitGapM / 4

    switch (quadrant) {
      case 0: // top-left
        return {
          x: -horizontalOffset,
          y: verticalOffset
        }
      case 1: // top-right
        return {
          x: horizontalOffset,
          y: verticalOffset
        }
      case 2: // bottom-left
        return {
          x: -horizontalOffset,
          y: -verticalOffset
        }
      case 3: // bottom-right
        return {
          x: horizontalOffset,
          y: -verticalOffset
        }
      default:
        return { x: 0, y: 0 }
    }
  }

  // Calculate door dimensions
  const getDoorDimensions = () => {
    // Account for gaps on both sides of the door
    const effectiveDoorWidth = doorWidth - 2 * doorGapM
    const effectiveDoorHeight = doorHeight - 2 * doorGapM

    return {
      quarterWidth: effectiveDoorWidth / 2 - splitGapM / 2,
      quarterHeight: effectiveDoorHeight / 2 - splitGapM / 2
    }
  }

  // Create quadrants array for mapping
  const quadrants = [0, 1, 2, 3]
  const doorDimensions = getDoorDimensions()

  return (
    <group>
      {quadrants.map((quadrant) => {
        const pos = getQuadrantPosition(quadrant)
        const isBottomPanel = quadrant === 2 || quadrant === 3

        return (
          <group key={`quadrant-${quadrant}`}>
            {/* Panel */}
            <mesh
              position={[
                doorX + pos.x,
                doorY + pos.y,
                depth / 2 - pt + doorThicknessM
              ]}
            >
              <extrudeGeometry
                args={[createQuarterPanelShape(quadrant), extrudeSettings]}
              />
              <meshStandardMaterial color='white' side={THREE.DoubleSide} />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Door */}
            <mesh
              position={[
                doorX + pos.x,
                doorY + pos.y - (isBottomPanel ? doorGapAtBottomM / 2 : 0),
                depth / 2 + doorThicknessM / 2 - 0.001
              ]}
            >
              <boxGeometry
                args={[
                  doorDimensions.quarterWidth,
                  doorDimensions.quarterHeight,
                  doorThicknessM / 2
                ]}
              />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
