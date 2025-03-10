'use client'

import { Edges } from '@react-three/drei'

import CabinetFrame from './CabinetFrame'
import CabinetMoulding from './CabinetMoulding'
import FrontPanels from './FrontPanels'
import Feet from './Feet'

// panelConfig options
// {
//   type: 'door' | 'drawer', // Required: The type of panel
//   style: 'single' | 'split' | 'fourDoors', // Required for door type only: The door style
//   ratio: 1, // Optional: The relative size ratio of this panel section
//   handleType: 'bar' | 'knob', // Optional: For drawers, specifies handle style
//   color: 'white', // Optional: You could add color options
//   orientation: 'horizontal' | 'vertical', // Optional: For split doors, specifies orientation
//   doorRatio: [1, 1], // Optional: For split doors, specifies the ratio between sections
//   verticalRatio: [1, 1], // Optional: For fourDoors, specifies ratio between top and bottom
//   horizontalRatio: [1, 1], // Optional: For fourDoors, specifies ratio between left and right
//   // Additional properties as needed for future extensions
// }

export default function BaseUnit({
  carcassDepth = 575 * 1, // carcassDepth is 527 + 30 + 18
  carcassHeight = 759, // 723 + 36
  carcassInnerWidth = 264 * 2.3,
  panelThickness = 18,
  panelConfig = [
    {
      type: 'oven'
    }
    // {
    //   type: 'drawer',

    //   ratio: 1
    // }
    // {
    //   type: 'door',
    //   style: 'fourDoors',
    //   ratio: 2,
    //   verticalRatio: [1, 2], // Top section twice as tall as bottom section
    //   horizontalRatio: [1, 1] // Equal left and right widths
    // }
  ]
}) {
  const height = carcassHeight / 1000
  const depth = carcassDepth / 1000
  const thickness = panelThickness / 1000
  const distance = carcassInnerWidth / 1000 // inside (300 outside)
  const backInset = 30 / 1000

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  //  0.0265 is the distance from carcass to the bottom of the frame
  //  0.104 is the distance from the bottom of the frame to floor
  //  0.0265 + 0.104 is the amount to lift the unit up ('Feet' make up the gap).
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
      <mesh position={[-distance / 2, height / 2, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Right Side Panel */}
      <mesh position={[distance / 2, height / 2, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, thickness / 2, backInset / 2]}>
        <boxGeometry args={[distance, thickness, depth - backInset]} />
        <meshStandardMaterial color='white' />
        <Edges color='gray' renderOrder={1000} />
      </mesh>

      <Feet carcassInnerWidth={carcassInnerWidth} carcassDepth={carcassDepth} />
    </group>
  )
}
