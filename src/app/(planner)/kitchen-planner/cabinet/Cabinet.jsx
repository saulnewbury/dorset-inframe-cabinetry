'use client'

import { useContext, useRef } from 'react'

// Components
import Carcass from './Carcass'
import Frame from './Frame'
import Moulding from './Moulding'
import FrontPanels from './FrontPanels'
import SinkBasin from './SinkBasin'
import Worktop from './Worktop'
import Feet from './Feet'

import { useAppState } from '@/appState'

import { ModelContext } from '@/model/context'

import deriveLineColor from '@/lib/helpers/deriveLineColor'

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

  // Model Data
  const [model] = useContext(ModelContext)

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

  // Cabinet colour
  const color = model.color || '#eeeeee'

  // Derive line colour from color
  const lineColor = deriveLineColor(color)

  return (
    <group position-y={baseUnitPositionY}>
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
