import React, { useContext } from 'react'
import { Edges } from '@react-three/drei'

import { useAppState } from '@/appState'

import { ModelContext } from '@/model/context'

// Components
import Frame from './Frame'
import Moulding from './Moulding'
import Carcass from './Carcass'
import Feet from './Feet'
import Worktop from './Worktop'
import CornerDoor from './CornerDoor'

// Helpers
import deriveLineColor from '@/lib/helpers/deriveLineColor'

export default function CabinetCorner({
  underCounter = false,
  carcassDepth = 0.575,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.964,
  interiorOpeningWidth = 0.5835,
  openingOrientation = 'right',
  panelConfig = [
    {
      type: 'door'
    }
  ]
}) {
  // App state
  const { is3D } = useAppState()

  // Model data
  const [model] = useContext(ModelContext)

  // Fill width including hidden part
  const cornerFullWidth = interiorOpeningWidth + 0.018 + carcassDepth

  // Frame
  const bottomFrameThickness = 0.045

  // Cabinet color
  const color = model.color || '#eeeeee'

  // Derive line color from color
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

  // const coverPanelWidth = interiorOpeningWidth - 0.009 * 20
  const coverPanelWidth = carcassInnerWidth - interiorOpeningWidth - 0.018

  const panelOffset =
    openingOrientation === 'right'
      ? -carcassInnerWidth / 2 + coverPanelWidth / 2 - panelThickness / 4
      : carcassInnerWidth / 2 - coverPanelWidth / 2 + panelThickness / 4

  const yOffset = bottomFrameThickness - 0.0188

  return (
    <group position-y={baseUnitPositionY}>
      {/* cover panel */}
      <mesh
        position={[
          panelOffset,
          carcassHeight / 2 - yOffset / 2,
          carcassDepth / 2 + 0.009
        ]}
      >
        <boxGeometry
          args={[
            coverPanelWidth + panelThickness / 2,
            carcassHeight + yOffset,
            panelThickness
          ]}
        />
        <meshStandardMaterial color={color} />
        <Edges threshold={15} color={lineColor} />
      </mesh>

      <Frame
        color={color}
        lineColor={lineColor}
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        fullInnerWidth={carcassInnerWidth}
        openingOrientation={openingOrientation}
      />

      <Moulding
        color={color}
        lineColor={lineColor}
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
        color={color}
        lineColor={lineColor}
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        fullInnerWidth={carcassInnerWidth}
        openingOrientation={openingOrientation}
      />

      <Carcass
        cornerFullWidth={cornerFullWidth}
        corner={{
          offset: -carcassDepth / 4 - 0.0135,
          orientation: openingOrientation
        }}
        underCounter={underCounter}
        distance={distance}
        carcassHeight={carcassHeight}
        carcassDepth={carcassDepth}
        panelThickness={panelThickness}
        baseCarcassToFloor={baseCarcassToFloor}
        backInset={backInset}
        baseUnit={true}
      />

      <Feet carcassInnerWidth={carcassInnerWidth} carcassDepth={carcassDepth} />

      {is3D && (
        <Worktop
          distance={cornerFullWidth}
          thickness={panelThickness}
          depth={carcassDepth}
          height={carcassHeight}
          color={'#777777'}
          corner={{
            offset: -carcassDepth / 4 - 0.0135,
            orientation: openingOrientation
          }}
        />
      )}
    </group>
  )
}
