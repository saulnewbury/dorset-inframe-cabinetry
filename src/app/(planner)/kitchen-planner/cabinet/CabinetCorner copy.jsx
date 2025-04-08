import React from 'react'
import { Edges } from '@react-three/drei'

import { useAppState } from '@/appState'

// Components
import Frame from './Frame'
import Moulding from './Moulding'
import Carcass from './Carcass'
import Feet from './Feet'
import Worktop from './Worktop'
import CornerDoor from './CornerDoor'

import { lineColor } from './colors'

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
  // opening width + carcass depth - carcassOuterWidth =  extra.

  // openingWidth + 36 + 9 + carcassDepth
  const s = carcassInnerWidth - interiorOpeningWidth
  const p = carcassDepth - s
  console.log(s + p)

  // App state
  const { is3D } = useAppState()

  // Frame
  const bottomFrameThickness = 0.045

  // Carcass
  const panelThickness = 0.018
  const backInset = 0.03
  const distance = carcassInnerWidth + p + 0.018 // inside width
  const baseCarcassToFloor = 0.104 + 0.026 // = 0.13

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  // Base unit position - the distance from carcass to floor
  const baseUnitPositionY = 0.0265 + 0.104

  // const coverPanelWidth = interiorOpeningWidth - 0.009 * 20
  const coverPanelWidth = distance - interiorOpeningWidth - 0.018

  const panelOffset =
    openingOrientation === 'left'
      ? -distance / 2 + coverPanelWidth / 2 - panelThickness / 4
      : distance / 2 - coverPanelWidth / 2 + panelThickness / 4

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
        <meshStandardMaterial color='white' />
        <Edges threshold={15} color={lineColor} />
      </mesh>

      <Frame
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        fullInnerWidth={distance}
        openingOrientation={openingOrientation}
      />

      <Moulding
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        numHoles={panelConfig.length}
        ratios={panelRatios}
        fullInnerWidth={distance}
        openingOrientation={openingOrientation}
      />

      <CornerDoor
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={interiorOpeningWidth}
        panelThickness={panelThickness}
        fullInnerWidth={distance}
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
        baseUnit={true}
      />

      <Feet carcassInnerWidth={distance} carcassDepth={carcassDepth} />

      {is3D && (
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
