// DoorPanel.jsx
import React from 'react'
import { SingleDoor } from './door-types/SingleDoor'
import { SplitDoors } from './door-types/SplitDoors'
import { FourDoors } from './door-types/FourDoors'

export default function DoorPanel({
  boundary, // Single boundary object
  carcassDepth,
  panelThickness,
  doorThickness = 18,
  doorGap = 2,
  mouldingSize = 4,
  frameInset = 4,
  holeInset = 65,
  mouldingWidth = 9,
  doorStyle = 'split', // "single", "split", or "fourDoors"
  splitGap = 2
}) {
  // Convert dimensions from mm to meters
  const pt = panelThickness / 1000
  const depth = carcassDepth / 1000
  const doorThicknessM = doorThickness / 1000
  const doorGapM = doorGap / 1000
  const mouldingSizeM = mouldingSize / 1000
  const frameInsetM = frameInset / 1000
  const holeInsetM = holeInset / 1000
  const mouldingWidthM = mouldingWidth / 1000
  const splitGapM = splitGap / 1000
  const doorGapAtBottomM = 2 / 1000 // 2mm gap at bottom in meters

  // Common calculations for all door types
  const totalInset = frameInsetM + mouldingSizeM + doorGapM
  const doorWidth = boundary.right - boundary.left - 2 * totalInset
  const doorHeight =
    boundary.top - boundary.bottom - 2 * totalInset - doorGapAtBottomM
  const doorX = (boundary.left + boundary.right) / 2
  const doorY = (boundary.bottom + boundary.top) / 2
  const panelWidth = boundary.right - boundary.left - 2 * mouldingWidthM
  const panelHeight = boundary.top - boundary.bottom - 2 * mouldingWidthM

  // Common props for all door types
  const doorProps = {
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
}
