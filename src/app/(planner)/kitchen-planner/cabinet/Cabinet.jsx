'use client'

import { Edges } from '@react-three/drei'

// Components
import CabinetFrame from './CabinetFrame'
import CabinetMoulding from './CabinetMoulding'
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

export default function Cabinet({
  baseUnit = true,
  basin = { type: 'belfast', height: 0.22, depth: 0.455, doubleBasin: true },
  // basin = null,
  carcassDepth = 0.575,
  carcassHeight = 0.759,
  carcassInnerWidth = 0.564 * 1.5,
  panelThickness = 0.018,
  panelConfig = [
    // {
    //   type: 'drawer',

    //   ratio: 2,
    //   orientation: 'horizontal',
    //   doorRatio: [1, 2]
    // }
    {
      type: 'oven',
      ovenType: 'compact',
      ratio: 2
    }
  ]
}) {
  // Adapt cabinet height to accommodate basin on top
  if (basin?.type === 'belfast') carcassHeight -= basin.height

  // Carcass
  const backInset = 0.03
  const distance = carcassInnerWidth // inside width

  // Basin
  const basinWidth = distance - 0.018

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  // Base unit position - the distance from carcass to floor
  const baseUnitPositionY = 0.0265 + 0.104

  return (
    <group position-y={baseUnitPositionY}>
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
      <FrontPanels
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        panelConfig={panelConfig}
      />

      {/* Left Side Panel */}
      <mesh position={[-distance / 2, carcassHeight / 2, 0]}>
        <boxGeometry args={[panelThickness, carcassHeight, carcassDepth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Right Side Panel */}
      <mesh position={[distance / 2, carcassHeight / 2, 0]}>
        <boxGeometry args={[panelThickness, carcassHeight, carcassDepth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, panelThickness / 2, backInset / 2]}>
        <boxGeometry
          args={[distance, panelThickness, carcassDepth - backInset]}
        />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Back Panel */}
      <mesh
        rotation-y={Math.PI * 0.5}
        position={[
          0,
          carcassHeight / 2,
          -carcassDepth / 2 + backInset + panelThickness / 2
        ]}
      >
        <boxGeometry
          args={[panelThickness, carcassHeight, distance - panelThickness]}
        />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Top Panel */}
      {(!baseUnit || basin) && (
        <mesh position={[0, carcassHeight - panelThickness / 2, backInset / 2]}>
          <boxGeometry
            args={[
              distance - panelThickness,
              panelThickness,
              carcassDepth - backInset
            ]}
          />
          <meshStandardMaterial color='white' />
          <Edges color='gray' renderOrder={1000} />
        </mesh>
      )}

      {/* Sink */}
      {basin && (
        <SinkBasin
          basin={basin}
          depth={basin.depth}
          height={basin.height}
          width={basinWidth}
          carcassHeight={carcassHeight}
          carcassDepth={carcassDepth}
        />
      )}

      {/* Worktop and Feet*/}
      {baseUnit && (
        <>
          <Worktop
            basin={basin}
            distance={distance}
            thickness={panelThickness}
            depth={carcassDepth}
            height={carcassHeight}
            color={'#777777'}
          />

          <Feet
            carcassInnerWidth={carcassInnerWidth}
            carcassDepth={carcassDepth}
          />
        </>
      )}
    </group>
  )
}
