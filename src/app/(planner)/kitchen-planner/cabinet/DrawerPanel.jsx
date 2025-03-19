// DrawerPanel.jsx
import React from 'react'
import { Edges } from '@react-three/drei'

export default function DrawerPanel({
  boundary, // Single boundary object
  carcassDepth,
  carcassHeight,
  panelThickness,
  drawerThickness = 0.018, // Thickness of the drawer front in meters
  drawerGap = 0.002, // Gap between drawer and moulding frame in meters
  mouldingSize = 0.004, // Moulding size in meters
  frameInset = 0.004, // Frame inset in meters
  drawerHandleType = 'bar' // Optional handle type
}) {
  // Calculate drawer dimensions with appropriate gaps
  const totalInset = frameInset + mouldingSize + drawerGap
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
          position={[0, -drawerHeight / 4, drawerThickness / 2 + handleOffset]}
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
      position={[
        drawerX,
        drawerY,
        carcassDepth / 2 + drawerThickness / 2 - 0.001
      ]}
    >
      {/* Drawer front */}
      <mesh>
        <boxGeometry args={[drawerWidth, drawerHeight, drawerThickness]} />
        <meshStandardMaterial color='white' />
        <Edges threshold={5} color='gray' />
      </mesh>

      {/* Optional drawer handle */}
      {renderDrawerHandle()}
    </group>
  )
}
