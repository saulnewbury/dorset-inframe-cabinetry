// OvenPanel.jsx
import React from 'react'
import { Edges } from '@react-three/drei'

export default function Oven({
  boundary, // Single boundary object
  carcassDepth,
  carcassHeight,
  panelThickness,
  ovenThickness = 18, // Thickness of the oven front in mm
  ovenGap = 2, // Gap between oven and moulding frame in mm
  mouldingSize = 4, // Moulding size in mm
  frameInset = 4, // Frame inset in mm
  ovenHandleType = 'bar', // Optional handle type
  type = 'glass'
}) {
  // Convert dimensions from mm to meters
  const pt = panelThickness / 1000
  const depth = carcassDepth / 1000
  const ovenThicknessM = ovenThickness / 1000
  const ovenGapM = ovenGap / 1000
  const mouldingSizeM = mouldingSize / 1000
  const frameInsetM = frameInset / 1000

  // Calculate oven dimensions with appropriate gaps
  const totalInset = frameInsetM + mouldingSizeM + ovenGapM
  const ovenWidth = boundary.right - boundary.left - 2 * totalInset
  const ovenHeight = boundary.top - boundary.bottom - 2 * totalInset

  // Center position of the oven
  const ovenX = (boundary.left + boundary.right) / 2
  const ovenY = (boundary.bottom + boundary.top) / 2

  const cpanel = 0.1
  const doubleOvenCompartments = (ovenHeight - cpanel) / 2

  const knobs = [
    { x: -ovenWidth / 2 + 0.06 },
    { x: -ovenWidth / 2 + 0.134 },
    { x: ovenWidth / 2 - 0.06 },
    { x: ovenWidth / 2 - 0.134 }
  ]

  // Handle rendering based on oven type
  const renderOvenHandle = () => {
    // This could be expanded to support different handle types
    if (ovenHandleType === 'bar') {
      // Bar handle dimensions
      const handleWidth = ovenWidth * 0.7
      const handleHeight = 0.01
      const handleDepth = 0.02
      const handleOffset = 0.02

      return (
        <mesh
          position={[0, ovenHeight - 0.6, ovenThicknessM / 2 + handleOffset]}
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
    <group position={[ovenX, ovenY, depth / 2 + ovenThicknessM / 2 - 0.001]}>
      {/* Oven front */}
      {type === 'compact' && (
        <mesh position-y={-cpanel / 2}>
          <boxGeometry
            args={[ovenWidth, ovenHeight - cpanel, ovenThicknessM]}
          />
          <meshStandardMaterial color='white' />
          <Edges threshold={5} color='gray' />
        </mesh>
      )}

      {type === 'double' && (
        <>
          <group
            position-y={(ovenHeight - doubleOvenCompartments) / 2 - cpanel}
          >
            <mesh>
              <boxGeometry
                args={[ovenWidth, doubleOvenCompartments, ovenThicknessM]}
              />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
            {renderOvenHandle()}
          </group>
          <group
            position-y={(ovenHeight - doubleOvenCompartments * 3) / 2 - cpanel}
          >
            <mesh>
              <boxGeometry
                args={[ovenWidth, doubleOvenCompartments, ovenThicknessM]}
              />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
            {renderOvenHandle()}
          </group>
        </>
      )}

      {type === 'glass' && (
        <mesh position-y={-cpanel / 2}>
          <boxGeometry
            args={[ovenWidth, ovenHeight - cpanel, ovenThicknessM]}
          />
          <meshStandardMaterial color='white' />
          <Edges threshold={5} color='gray' />
        </mesh>
      )}

      {/* cpanel */}
      <group position={[0, ovenHeight / 2 - cpanel / 2, 0]}>
        {/* panel */}
        <mesh>
          <boxGeometry args={[ovenWidth, cpanel, ovenThicknessM]} />
          <meshStandardMaterial color='white' />
          <Edges threshold={5} color='gray' />
        </mesh>
        {/* Digital display */}
        <mesh>
          <boxGeometry args={[ovenWidth / 5, cpanel / 3, ovenThicknessM * 2]} />
          <meshStandardMaterial color='white' />
          <Edges threshold={5} color='gray' />
        </mesh>
        {/* Knobs */}
        {knobs.map((knob, idx) => {
          return (
            <mesh
              key={idx}
              position={[knob.x, 0, 0.015]}
              rotation-x={Math.PI * 0.5}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.01]} />
              <meshStandardMaterial color='white' />
              <Edges threshold={5} color='gray' />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
