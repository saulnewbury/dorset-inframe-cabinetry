'use client'

import { useContext } from 'react'

// Components
import Carcass from './Carcass'
import Frame from './Frame'
import FrameThreeSided from './FrameThreeSides'
import Moulding from './Moulding'
import MouldingThreeSided from './MouldingThreeSides'
import FrontPanels from './FrontPanels'
import Worktop from './Worktop'

import { useAppState } from '@/appState'
import { ModelContext } from '@/model/context'

// Helpers
import deriveLineColor from '@/lib/helpers/deriveLineColor'

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
  // App state
  const { is3D } = useAppState()

  // Model data
  const [model] = useContext(ModelContext)

  // Cabinet color
  const color = model.color || '#eeeeee'

  // Derive line colour from color
  const lineColor = deriveLineColor(color)

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
        color={color}
        lineColor={lineColor}
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
      />

      {panelConfig[0].type !== 'door' && (
        <MouldingThreeSided
          color={color}
          lineColor={lineColor}
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
            color={color}
            lineColor={lineColor}
            carcassDepth={carcassDepth}
            carcassHeight={carcassHeight}
            carcassInnerWidth={carcassInnerWidth}
            panelThickness={panelThickness}
            numHoles={panelConfig.length}
            ratios={panelRatios}
          />
          <Moulding
            color={color}
            lineColor={lineColor}
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
          color={color}
          lineColor={lineColor}
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

      {baseUnit && is3D && (
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
