'use client'

import { Edges } from '@react-three/drei'

import CabinetFrame from './CabinetFrame'
import CabinetMoulding from './CabinetMoulding'
import FrontPanels from './FrontPanels'

// const panelConfig = [
//   {
//     type: 'door' | 'drawer', // Required: The type of panel
//     style: 'single' | 'split' | 'fourDoors', // Required for door type only: The door style
//     ratio: 8321, // Optional: The relative size ratio of this panel
//     handleType: 'bar' | 'knob', // Optional: For drawers, specifies handle style
//     color: 'white' // Optional: You could add color options
//     // Additional properties as needed for future extensions
//   }
//   // More panel configurations...
// ]

export default function BaseUnit({
  carcassDepth = 575, // carcassDepth is 527 + 30 + 18
  carcassHeight = 759 * 1.5, // 723 + 36
  carcassInnerWidth = 264 * 2,
  panelThickness = 18,
  panelConfig = [
    { type: 'door', style: 'single', ratio: 2 },
    { type: 'door', style: 'split', ratio: 1 }
  ]
}) {
  const height = carcassHeight / 1000
  const depth = carcassDepth / 1000
  const thickness = panelThickness / 1000
  const distance = carcassInnerWidth / 1000 // inside (300 outside)
  const backInset = 30 / 1000

  // Extract ratios from panelConfig if available
  const panelRatios = panelConfig.map((panel) => panel.ratio || 1)

  return (
    <group position-y={0.1}>
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
    </group>
  )
}
