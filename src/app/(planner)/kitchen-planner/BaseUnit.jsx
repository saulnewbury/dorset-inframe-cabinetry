'use client'

import { Edges } from '@react-three/drei'

import CabinetFrame from './CabinetFrame'
import CabinetMoulding from './CabinetMoulding'
import DrawerPanel from './DrawerPanel'
import DoorPanel from './DoorPanel'

// Materials for parts of unit:

/**
 * Parametric component to render a base unit. The 'style' property defines left
 * and (optional) right options for door or drawers, separated by colon (:).
 */

export default function BaseUnit({
  carcassDepth = 575, // carcassDepth is 527 + 30 + 18
  carcassHeight = 759 * 1.5, // 723 + 36
  carcassInnerWidth = 264 * 2,
  panelThickness = 18,
  numHoles = 4,
  type = 'door',
  style = ''
}) {
  const height = carcassHeight / 1000
  const depth = carcassDepth / 1000
  const thickness = panelThickness / 1000
  const distance = carcassInnerWidth / 1000 // inside (300 outside)
  const backInset = 30 / 1000

  return (
    <group position-y={0.1}>
      <CabinetFrame
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={numHoles}
      />
      <CabinetMoulding
        carcassDepth={carcassDepth}
        carcassHeight={carcassHeight}
        carcassInnerWidth={carcassInnerWidth}
        panelThickness={panelThickness}
        numHoles={numHoles}
      />
      {type === 'drawer' && (
        <DrawerPanel
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          numHoles={numHoles}
        />
      )}
      {type === 'door' && (
        <DoorPanel
          carcassDepth={carcassDepth}
          carcassHeight={carcassHeight}
          carcassInnerWidth={carcassInnerWidth}
          panelThickness={panelThickness}
          numHoles={numHoles}
        />
      )}
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
