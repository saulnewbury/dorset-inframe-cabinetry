// DoorPanel.jsx
import React, { useMemo } from 'react'
import { SingleDoor } from './door-types/SingleDoor'
import { SplitDoors } from './door-types/SplitDoors'
import { FourDoors } from './door-types/FourDoors'
import { calculateDoorBoundaries } from '@/utils/doorCalculations'

export default function DoorPanel({
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles = 4,
  dividerThickness = 18,
  doorThickness = 18,
  doorGap = 2,
  mouldingSize = 4,
  frameInset = 4,
  holeInset = 65,
  mouldingWidth = 9,
  doorStyle = 'single', // "single", "split", or "fourDoors"
  splitGap = 2
}) {
  // Convert dimensions from mm to meters
  const frameHeight = carcassHeight + 26.2
  const pt = panelThickness / 1000
  const height = frameHeight / 1000
  const depth = carcassDepth / 1000
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

  // Calculate door boundaries for each hole
  const doorBoundaries = useMemo(
    () =>
      calculateDoorBoundaries({
        numHoles,
        holeHeight,
        holeWidth,
        holeYOffset,
        dividerThicknessM,
        pt
      }),
    [numHoles, holeHeight, holeWidth, holeYOffset, dividerThicknessM, pt]
  )

  // Create a door and panel for each hole
  const DoorPanels = () => {
    return doorBoundaries.map((hole, index) => {
      // Common calculations for all door types
      const totalInset = frameInsetM + mouldingSizeM + doorGapM
      const doorWidth = hole.right - hole.left - 2 * totalInset
      const doorHeight =
        hole.top - hole.bottom - 2 * totalInset - doorGapAtBottomM
      const doorX = (hole.left + hole.right) / 2
      const doorY = (hole.bottom + hole.top) / 2
      const panelWidth = hole.right - hole.left - 2 * mouldingWidthM
      const panelHeight = hole.top - hole.bottom - 2 * mouldingWidthM

      // Common props for all door types
      const doorProps = {
        key: `door-group-${index}`,
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
      }

      // Render appropriate door type based on doorStyle
      switch (doorStyle) {
        case 'fourDoors':
          return <FourDoors {...doorProps} />
        case 'split':
          return <SplitDoors {...doorProps} />
        case 'single':
        default:
          return <SingleDoor {...doorProps} />
      }
    })
  }

  return (
    <group position={[0, height / 2 + hOffset, 0]}>
      <DoorPanels />
    </group>
  )
}
