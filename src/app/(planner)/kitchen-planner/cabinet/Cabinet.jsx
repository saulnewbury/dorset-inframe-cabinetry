'use client'

// Components
import Carcass from './Carcass'
import Frame from './Frame'
import Moulding from './Moulding'
import FrontPanels from './FrontPanels'
import SinkBasin from './SinkBasin'
import Worktop from './Worktop'
import Feet from './Feet'

import { useAppState } from '@/appState'

// panelConfig options
// {
//   type: 'door' | 'drawer' | 'oven', // Required: The type of panel
//   style: 'single' | 'split' | 'fourDoors', // Required for door type only: The door style
//   ovenType: 'single' | 'double' | 'compact', // Required for oven type only: The oven style
//   ratio: 1, // Optional: The relative size ratio of this panel section
//   handleType: 'bar' | 'knob', // Optional: For drawers/ovens, specifies handle style
//   color: 'white', // Optional: You could add color options
//   orientation: 'horizontal' | 'vertical', // Optional: For split doors, specifies orientation
//   doorRatio: [1, 1], // Optional: For split doors, specifies the ratio between sections
//   verticalRatio: [1, 1], // Optional: For fourDoors, specifies ratio between top and bottom
//   horizontalRatio: [1, 1], // Optional: For fourDoors, specifies ratio between left and right
//   compartmentRatio: [2, 3], // Optional: For double ovens, specifies ratio between compartments
//   // Additional properties as needed for future extensions
// }

// basinConfig options
// {
//   type: 'standard' | 'belfast'
//   doubleBasin: bool
// }

export default function Cabinet({
  tall = true,
  baseUnit = true,
  carcassDepth = 0.575,
  carcassHeight = 2.001,
  carcassInnerWidth = 0.764,
  basinConfig = null,
  panelConfig = [
    {
      type: 'door',
      style: 'fourDoors',
      orientation: 'vertical',
      verticalRatio: [60, 40],
      color: 'white'
    }
  ]
}) {
  // App State
  const { is3D } = useAppState()

  // Adapt cabinet height to accommodate basinConfig on top
  if (basinConfig?.type === 'belfast') carcassHeight -= basinConfig.height

  // Carcass
  const panelThickness = 0.018
  const backInset = 0.03
  const distance = carcassInnerWidth // inside width
  const baseCarcassToFloor = 0.104 + 0.026 // = 0.13

  // basinConfig
  const basinWidth = distance - 0.018

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  // Base unit position - the distance from carcass to floor
  const baseUnitPositionY = 0.0265 + 0.104

  return (
    <group position-y={baseUnitPositionY}>
      <Frame
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
      />
      <Moulding
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
      />

      <FrontPanels
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        panelConfig={panelConfig}
      />

      <Carcass
        distance={distance}
        carcassHeight={carcassHeight}
        carcassDepth={carcassDepth}
        panelThickness={panelThickness}
        baseCarcassToFloor={baseCarcassToFloor}
        backInset={backInset}
        baseUnit={!tall}
        basin={basinConfig}
      />

      {/* Sink */}
      {basinConfig && (
        <SinkBasin
          basin={basinConfig}
          depth={basinConfig.depth}
          height={basinConfig.height}
          width={basinWidth}
          carcassHeight={carcassHeight}
          carcassDepth={carcassDepth}
        />
      )}

      {/* Worktop and Feet*/}
      {baseUnit && (
        <Feet
          carcassInnerWidth={carcassInnerWidth}
          carcassDepth={carcassDepth}
        />
      )}

      {!tall && baseUnit && is3D && (
        <Worktop
          basin={basinConfig}
          distance={distance}
          thickness={panelThickness}
          depth={carcassDepth}
          height={carcassHeight}
          color={'#777777'}
        />
      )}
    </group>
  )
}
