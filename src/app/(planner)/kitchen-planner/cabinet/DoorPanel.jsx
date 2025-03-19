// DoorPanel.jsx
import React from 'react'
import { SingleDoor } from './SingleDoor'
import { SplitDoors } from './SplitDoors'
import { FourDoors } from './FourDoors'

export default function DoorPanel({
  boundary, // Single boundary object
  carcassDepth,
  panelThickness,
  doorThickness = 0.018,
  doorGap = 0.002,
  mouldingSize = 0.004,
  frameInset = 0.004,
  holeInset = 0.065,
  mouldingWidth = 0.009,
  doorStyle = 'split', // "single", "split", or "fourDoors"
  splitGap = 0.002,
  doorConfig = {} // Additional door configuration options
}) {
  // Extract door configuration options
  const {
    orientation = 'horizontal',
    ratio = [1, 1],
    verticalRatio = [1, 1],
    horizontalRatio = [1, 1]
  } = doorConfig

  // Convert dimensions from mm to meters
  const pt = panelThickness
  const depth = carcassDepth
  const doorThicknessM = doorThickness
  const doorGapM = doorGap
  const mouldingSizeM = mouldingSize
  const frameInsetM = frameInset
  const holeInsetM = holeInset
  const mouldingWidthM = mouldingWidth
  const splitGapM = splitGap
  const doorGapAtBottomM = 0.002

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
      return (
        <FourDoors
          {...doorProps}
          verticalRatio={verticalRatio}
          horizontalRatio={horizontalRatio}
        />
      )
    case 'split':
      return (
        <SplitDoors {...doorProps} orientation={orientation} ratio={ratio} />
      )
    case 'single':
    default:
      return <SingleDoor {...doorProps} />
  }
}
