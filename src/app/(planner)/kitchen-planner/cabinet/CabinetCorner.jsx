import React from 'react'
import { Edges } from '@react-three/drei'

// Components
import CabinetFrame from './Frame'
import CabinetMoulding from './Moulding'
import Carcass from './Carcass'
import Feet from './Feet'
import Worktop from './Worktop'
import CornerDoor from './CornerDoor'

export default function CabinetCorner({
  baseUnit = true,
  underCounter = false,
  carcassDepth = 0.575,
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
  // Frame
  const bottomFrameThickness = 0.045

  // Carcass
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
    openingOrientation === 'left'
      ? -carcassInnerWidth / 2 + coverPanelWidth / 2 - panelThickness / 4
      : carcassInnerWidth / 2 - coverPanelWidth / 2 + panelThickness / 4

  const yOffset = bottomFrameThickness - 0.018 + 0.0042

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
        <Edges threshold={15} color='gray' />
      </mesh>

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
        carcassInnerWidth={interiorOpeningWidth}
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
