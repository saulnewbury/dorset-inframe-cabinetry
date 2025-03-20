import React from 'react'

// Components
import CabinetFrame from './CabinetFrame'
import CabinetMoulding from './CabinetMoulding'
import Carcass from './Carcass'
import Feet from './Feet'
import Worktop from './Worktop'
import CornerDoor from './CornerDoor'

export default function CabinetCorner({
  baseUnit = true,
  underCounter = false,
  carcassDepth = 0.575 * 1,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.964,
  interiorOpeningWidth = 0.5835,
  panelThickness = 0.018,
  openingOrientation = 'left',
  panelConfig = [
    {
      type: 'door'
    }
  ]
}) {
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
      <CabinetFrame
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        fullInnerWidth={carcassInnerWidth}
        openingOrientation={openingOrientation}
      />

      <CabinetMoulding
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        fullInnerWidth={carcassInnerWidth}
        openingOrientation={openingOrientation}
      />

      <CornerDoor
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth} // width of the door area (interiorCarcass)
        panelThickness={panelThickness}
        fullInnerWidth={carcassInnerWidth}
        openingOrientation={openingOrientation}
      />

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

      <Feet carcassInnerWidth={carcassInnerWidth} carcassDepth={carcassDepth} />

      <Worktop
        distance={distance}
        thickness={panelThickness}
        depth={carcassDepth}
        height={carcassHeight}
        color={'#777777'}
      />
    </group>
  )
}
