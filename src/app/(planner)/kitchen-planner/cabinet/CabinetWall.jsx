'use client'

import { useContext } from 'react'

// Components
import Carcass from './Carcass'
import Frame from './Frame'
import Moulding from './Moulding'
import FrontPanels from './FrontPanels'

import { ModelContext } from '@/model/context'

import deriveLineColor from '@/lib/helpers/deriveLineColor'

export default function CabinetWall({
  carcassDepth = 0.575,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.564,
  panelConfig = [
    {
      type: 'door',
      style: 'single',
      color: 'white'
    }
  ]
}) {
  const [model] = useContext(ModelContext)

  // Frame
  const bottomFrameThickness = 0.05

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
  const footToTop = 0.7892
  const worktopToWallUnit = 0.455

  return (
    <group position-y={baseUnitPositionY + footToTop + worktopToWallUnit}>
      <Frame
        color={color}
        lineColor={lineColor}
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        bottomFrameThickness={bottomFrameThickness}
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

      <FrontPanels
        color={color}
        lineColor={lineColor}
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
        baseUnit={false}
      />
    </group>
  )
}
