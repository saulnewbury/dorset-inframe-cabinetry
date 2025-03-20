'use client'

import { Edges } from '@react-three/drei'

// Components
import Carcass from './Carcass'
import CabinetFrame from './Frame'
import CabinetFrameThreeSided from './FrameThreeSides'
import CabinetMoulding from './Moulding'
import CabinetMouldingThreeSided from './MouldingThreeSides'
import FrontPanels from './FrontPanels'
import SinkBasin from './SinkBasin'
import Worktop from './Worktop'
import Feet from './Feet'

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

// basin options
// {
//   type: 'standard' | 'belfast'
//   doubleBasin: bool
// }

export default function CabinetUnderCounter({
  baseUnit = true,
  underCounter = { door: false },
  carcassDepth = 0.575 * 1,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.564,
  panelThickness = 0.018,
  panelConfig = [
    {
      type: 'door',
      style: 'single'
    }
  ]
}) {
  // 0.050 - 0.018

  // Carcass
  const backInset = 0.03
  const distance = carcassInnerWidth // inside width
  const baseCarcassToFloor = 0.104 + 0.026 // = 0.13

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  // Base unit position - the distance from carcass to floor
  const baseUnitPositionY = 0.0265 + 0.104

  return (
    <group position-y={baseUnitPositionY}>
      <CabinetFrameThreeSided
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
      />

      {!underCounter.door && (
        <CabinetMouldingThreeSided
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          numHoles={panelConfig.length}
          ratios={panelRatios}
        />
      )}

      {underCounter.door && (
        <>
          <CabinetFrame
            carcassDepth={carcassDepth}
            carcassHeight={carcassHeight}
            carcassInnerWidth={carcassInnerWidth}
            panelThickness={panelThickness}
            numHoles={panelConfig.length}
            ratios={panelRatios}
          />
          <CabinetMoulding
            carcassDepth={carcassDepth}
            carcassHeight={carcassHeight}
            carcassInnerWidth={carcassInnerWidth}
            panelThickness={panelThickness}
            numHoles={panelConfig.length}
            ratios={panelRatios}
          />
        </>
      )}

      {(!underCounter || underCounter?.door) && (
        <FrontPanels
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          panelConfig={panelConfig}
        />
      )}

      <Carcass
        underCounter={underCounter}
        distance={distance}
        carcassHeight={carcassHeight}
        carcassDepth={carcassDepth}
        panelThickness={panelThickness}
        baseCarcassToFloor={baseCarcassToFloor}
        backInset={backInset}
        baseUnit={baseUnit}
      />

      {baseUnit && (
        <Worktop
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
