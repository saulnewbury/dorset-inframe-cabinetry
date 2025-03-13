// DoorTypes/FourDoors.jsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export function FourDoors({
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
  verticalRatio = [1, 1], // Default 1:1 ratio for top:bottom sections
  horizontalRatio = [1, 1] // Default 1:1 ratio for left:right sections
}) {
  // Extract ratio values
  const [topRatio, bottomRatio] = verticalRatio
  const [leftRatio, rightRatio] = horizontalRatio
  const verticalTotalRatio = topRatio + bottomRatio
  const horizontalTotalRatio = leftRatio + rightRatio

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: panelThickness,
    bevelEnabled: false
  }

  // Calculate the available width and height after accounting for gaps
  // For the vertical split between top and bottom sections, use zero gap to eliminate the excessive gap
  const availableWidth = panelWidth - splitGapM
  const availableHeight = panelHeight - doorGapAtBottomM // Remove the split gap entirely for height

  // Calculate effective door dimensions accounting for gaps
  // Eliminate the vertical split gap completely
  const effectiveDoorWidth = doorWidth - 2 * doorGapM - splitGapM
  const effectiveDoorHeight = doorHeight - 2 * doorGapM // No split gap for vertical separation

  // Function to create a panel shape with hole for each quadrant
  const createQuarterPanelShape = (quadrant) => {
    // Determine if this is a left or right panel
    const isLeftPanel = quadrant === 0 || quadrant === 2
    // Determine if this is a top or bottom panel
    const isTopPanel = quadrant === 0 || quadrant === 1

    // Calculate dimensions for the quadrant based on ratios
    const widthRatio = isLeftPanel ? leftRatio : rightRatio
    const heightRatio = isTopPanel ? topRatio : bottomRatio

    // Make doors taller by removing the vertical split gap
    const quarterWidth = (availableWidth * widthRatio) / horizontalTotalRatio
    const quarterHeight = (availableHeight * heightRatio) / verticalTotalRatio

    // Create the panel shape
    const panelShape = new THREE.Shape()

    // Create panel outline
    panelShape.moveTo(
      -quarterWidth / 2,
      -quarterHeight / 2 + (!isTopPanel ? doorGapAtBottomM : 0)
    )
    panelShape.lineTo(
      quarterWidth / 2,
      -quarterHeight / 2 + (!isTopPanel ? doorGapAtBottomM : 0)
    )
    panelShape.lineTo(quarterWidth / 2, quarterHeight / 2)
    panelShape.lineTo(-quarterWidth / 2, quarterHeight / 2)
    panelShape.lineTo(
      -quarterWidth / 2,
      -quarterHeight / 2 + (!isTopPanel ? doorGapAtBottomM : 0)
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
        (!isTopPanel ? doorGapAtBottomM : 0)
    )
    holeShape.lineTo(
      quarterWidth / 2 - scaledHoleInset,
      -quarterHeight / 2 +
        scaledHoleInset +
        (!isTopPanel ? doorGapAtBottomM : 0)
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
        (!isTopPanel ? doorGapAtBottomM : 0)
    )

    // Add the hole to the panel shape
    panelShape.holes.push(holeShape)

    return {
      shape: panelShape,
      width: quarterWidth,
      height: quarterHeight,
      isTopPanel
    }
  }

  // Calculate quadrant positions based on ratios
  const getQuadrantPosition = (quadrant) => {
    // Calculate dimensions for top and bottom sections
    const topHeight = (availableHeight * topRatio) / verticalTotalRatio
    const bottomHeight = (availableHeight * bottomRatio) / verticalTotalRatio

    // Calculate dimensions for left and right sections
    const leftWidth = (availableWidth * leftRatio) / horizontalTotalRatio
    const rightWidth = (availableWidth * rightRatio) / horizontalTotalRatio

    // Calculate the vertical adjustment to align with the cabinet frame
    // We need to account for the doorGapAtBottomM at the bottom
    // and eliminate the vertical split gap completely
    const verticalSplitGap = 0 // No gap between top and bottom sections
    const totalHeight = topHeight + bottomHeight + verticalSplitGap
    const verticalOffset = doorGapAtBottomM / 2

    // Calculate center points based on the asymmetric layout
    const leftCenterX = -(leftWidth / 2 + splitGapM / 2)
    const rightCenterX = rightWidth / 2 + splitGapM / 2

    // Adjust the vertical centers - make top and bottom sections directly touch
    const topCenterY = panelHeight / 2 - topHeight / 2 - verticalOffset
    const bottomCenterY = -(panelHeight / 2) + bottomHeight / 2 - verticalOffset

    switch (quadrant) {
      case 0: // top-left
        return {
          x: leftCenterX,
          y: topCenterY
        }
      case 1: // top-right
        return {
          x: rightCenterX,
          y: topCenterY
        }
      case 2: // bottom-left
        return {
          x: leftCenterX,
          y: bottomCenterY
        }
      case 3: // bottom-right
        return {
          x: rightCenterX,
          y: bottomCenterY
        }
      default:
        return { x: 0, y: 0 }
    }
  }

  // Calculate door dimensions for each quadrant
  const getDoorDimensions = (quadrant) => {
    // Determine if this is a left or right door
    const isLeftDoor = quadrant === 0 || quadrant === 2
    // Determine if this is a top or bottom door
    const isTopDoor = quadrant === 0 || quadrant === 1

    // Calculate dimensions based on ratios
    const widthRatio = isLeftDoor ? leftRatio : rightRatio
    const heightRatio = isTopDoor ? topRatio : bottomRatio

    const doorQuarterWidth =
      (effectiveDoorWidth * widthRatio) / horizontalTotalRatio
    const doorQuarterHeight =
      (effectiveDoorHeight * heightRatio) / verticalTotalRatio

    return {
      width: doorQuarterWidth,
      height: doorQuarterHeight
    }
  }

  // Create quadrants array for mapping
  const quadrants = [0, 1, 2, 3]

  return (
    <group>
      {quadrants.map((quadrant) => {
        const panelData = createQuarterPanelShape(quadrant)
        const pos = getQuadrantPosition(quadrant)
        const doorDimensions = getDoorDimensions(quadrant)
        const isBottomPanel = quadrant === 2 || quadrant === 3

        return (
          <group key={`quadrant-${quadrant}`}>
            {/* Panel */}
            <mesh
              position={[
                doorX + pos.x,
                doorY + pos.y,
                depth / 2 - panelThickness + panelThickness
              ]}
            >
              <extrudeGeometry args={[panelData.shape, extrudeSettings]} />
              <meshStandardMaterial color='white' side={THREE.DoubleSide} />
              <Edges threshold={5} color='gray' />
            </mesh>

            {/* Door */}
            <mesh
              position={[
                doorX + pos.x,
                doorY + pos.y - (isBottomPanel ? doorGapAtBottomM / 2 : 0),
                depth / 2 + panelThickness / 2 - 0.001
              ]}
            >
              <boxGeometry
                args={[
                  doorDimensions.width,
                  doorDimensions.height,
                  panelThickness / 2
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
