// DrawerPanel.jsx
import React from 'react'
import { Edges } from '@react-three/drei'

export default function DrawerPanel({
  boundary, // Single boundary object
  carcassDepth,
  panelThickness,
  drawerGap = 2, // Gap between drawer and moulding frame in mm
  mouldingSize = 4, // Moulding size in mm
  frameInset = 4, // Frame inset in mm
  drawerHandleType = 'bar' // Optional handle type
}) {
  // Convert dimensions from mm to meters

  const depth = carcassDepth / 1000
  const drawerGapM = drawerGap / 1000
  const mouldingSizeM = mouldingSize / 1000
  const frameInsetM = frameInset / 1000

  // Calculate drawer dimensions with appropriate gaps
  const totalInset = frameInsetM + mouldingSizeM + drawerGapM
  const drawerWidth = boundary.right - boundary.left - 2 * totalInset
  const drawerHeight = boundary.top - boundary.bottom - 2 * totalInset

  // Center position of the drawer
  const drawerX = (boundary.left + boundary.right) / 2
  const drawerY = (boundary.bottom + boundary.top) / 2

  // Handle rendering based on drawer type
  const renderDrawerHandle = () => {
    // This could be expanded to support different handle types
    if (drawerHandleType === 'bar') {
      // Bar handle dimensions
      const handleWidth = drawerWidth * 0.7
      const handleHeight = 0.01
      const handleDepth = 0.02
      const handleOffset = 0.02

      return (
        <mesh
          position={[0, -drawerHeight / 4, panelThickness / 2 + handleOffset]}
        >
          <boxGeometry args={[handleWidth, handleHeight, handleDepth]} />
          <meshStandardMaterial color='#777777' />
          <Edges threshold={5} color='#555555' />
        </mesh>
      )
    }

    // Could add more handle types here

    return null
  }

  return (
    <group
      position={[drawerX, drawerY, depth / 2 + panelThickness / 2 - 0.001]}
    >
      {/* Drawer front */}
      <mesh>
        <boxGeometry args={[drawerWidth, drawerHeight, panelThickness]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Optional drawer handle */}
      {renderDrawerHandle()}
    </group>
  )
}
