'use client'

import { Edges } from '@react-three/drei'

// Components
import BaseCabinetFrame from './BaseCabinetFrame'
import CabinetMoulding from './CabinetMoulding'
import FrontPanels from './FrontPanels'
import SinkBasin from './sink-basin/SinkBasin'
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

// (574 carcassDepth is 527 + 30 + 18)

export default function Cabinet({
  baseUnit = true,
  basin = { type: 'belfast', height: 220, depth: 455, doubleBasin: true },
  // basin = null,
  carcassDepth = 575, // base
  // carcassDepth = 282, // wall and island units
  // carcassHeight = 759, // base cabinet
  carcassHeight = 720, // wall cabinet
  carcassInnerWidth = 564,
  panelConfig = [
    {
      type: 'door',
      // ovenType: 'compact',
      // ratio: 1,
      // orientation: 'horizontal',
      doorRatio: [1, 1]
    }
  ]
}) {
  // Adapt cabinet height to accomodate basin on top
  if (basin?.type === 'belfast') carcassHeight -= basin.height

  // Carcass
  const height = carcassHeight / 1000
  const depth = carcassDepth / 1000
  const panelThickness = 18 / 1000
  const distance = carcassInnerWidth / 1000 // inside (300 outside)
  const backInset = 30 / 1000

  // Basin
  const basinDepth = 455 / 1000
  const basinHeight = basin?.height / 1000
  const basinWidth = distance - 0.018

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  //  Set height for Base Units and Wall Units
  //  0.0265 is the distance from carcass to the bottom of the frame
  //  0.104 is the distance from the bottom of the frame to floor
  //  0.0265 + 0.104 is the amount to lift the unit up ('Feet' make up the gap).
  const baseUnitPositionY = baseUnit
    ? 0.0265 + 0.104
    : 0.0265 + 0.104 + carcassHeight / 1000 + 0.49

  return (
    <group position-y={baseUnitPositionY}>
      <BaseCabinetFrame
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
      <mesh position={[-distance / 2, height / 2, 0]}>
        <boxGeometry args={[panelThickness, height, depth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Right Side Panel */}
      <mesh position={[distance / 2, height / 2, 0]}>
        <boxGeometry args={[panelThickness, height, depth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, panelThickness / 2, backInset / 2]}>
        <boxGeometry args={[distance, panelThickness, depth - backInset]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Back Panel */}
      <mesh
        rotation-y={Math.PI * 0.5}
        position={[0, height / 2, -depth / 2 + backInset + panelThickness / 2]}
      >
        <boxGeometry
          args={[panelThickness, height, distance - panelThickness]}
        />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Top Panel */}
      {!baseUnit && (
        <mesh position={[0, height - panelThickness / 2, backInset / 2]}>
          <boxGeometry
            args={[
              distance - panelThickness,
              panelThickness,
              depth - backInset
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
          depth={basinDepth}
          height={basinHeight}
          width={basinWidth}
          carcassHeight={carcassHeight}
          carcassDepth={depth}
        />
      )}

      {/* Worktop and Feet*/}
      {baseUnit && (
        <>
          <Worktop
            basin={basin}
            distance={distance}
            thickness={panelThickness}
            depth={depth}
            height={height}
            // color='lightblue'
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
