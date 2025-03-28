'use client'

// Components
import Carcass from './Carcass'
import Frame from './Frame'
import FrameThreeSided from './FrameThreeSides'
import Moulding from './Moulding'
import MouldingThreeSided from './MouldingThreeSides'
import FrontPanels from './FrontPanels'
import Worktop from './Worktop'

export default function CabinetUnderCounter({
  baseUnit = true,
  carcassDepth = 0.575,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.564,
  panelConfig = [
    {
      type: 'none' // door | none
    }
  ]
}) {
  // Carcass
  const panelThickness = 0.018
  const backInset = 0.03
  const distance = carcassInnerWidth // inside width
  const baseCarcassToFloor = 0.104 + 0.026 // = 0.13

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  // Base unit position - the distance from carcass to floor
  const baseUnitPositionY = 0.0265 + 0.104

  return (
    <group position-y={baseUnitPositionY}>
      <FrameThreeSided
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
      />

      {panelConfig[0].type !== 'door' && (
        <MouldingThreeSided
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          numHoles={panelConfig.length}
          ratios={panelRatios}
        />
      )}

      {panelConfig[0].type === 'door' && (
        <>
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
        </>
      )}

      {panelConfig[0].type == 'door' && (
        <FrontPanels
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          panelConfig={panelConfig}
        />
      )}

      <Carcass
        distance={distance}
        carcassHeight={carcassHeight}
        carcassDepth={carcassDepth}
        panelThickness={panelThickness}
        baseCarcassToFloor={baseCarcassToFloor}
        backInset={backInset}
        baseUnit={baseUnit}
        underCounter={true}
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
