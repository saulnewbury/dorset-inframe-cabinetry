import React from 'react'
import { Edges, Outlines } from '@react-three/drei'

export default function DoorHandle({ len, width, depth, orientation }) {
  const handleShaft = 0.22
  const handleRad = 0.015
  const insertDepth = 0.05
  const handleDepth = handleShaft + handleRad - insertDepth

  return (
    <>
      <group
        position-y={len}
        position-x={orientation === 'left' ? width / 4 - 0.1 : -width / 4 + 0.1}
        position-z={depth / 2 + handleDepth / 4}
        rotation-x={-Math.PI * 0.5}
        rotation-y={orientation === 'left' ? Math.PI : Math.PI * 2}
      >
        {/* Plate */}
        <mesh position-y={0.05}>
          <cylinderGeometry args={[0.05, 0.05, 0.0001]} />
          <meshStandardMaterial color='lightgrey' />
          <Edges linewidth={2} threshold={15} color={'gray'} />
          <Outlines thickness={0.01} color={'gray'} />
        </mesh>
        {/* Lever */}
        <mesh>
          <cylinderGeometry args={[handleRad, handleRad, 0.1]} />
          <meshStandardMaterial color='lightgrey' />
          <Edges linewidth={2} threshold={15} color={'gray'} />
          <Outlines thickness={0.01} color={'gray'} />
        </mesh>
        {/* Shaft */}
        <mesh
          position-y={-insertDepth}
          position-x={0.06}
          rotation-z={Math.PI / 2}
        >
          <cylinderGeometry args={[handleRad, handleRad, handleShaft]} />
          <meshStandardMaterial color='lightgrey' />
          <Edges linewidth={1} threshold={15} color={'gray'} />
          <Outlines thickness={0.01} color={'gray'} />
        </mesh>
      </group>

      <group
        position-y={len}
        position-x={orientation === 'left' ? width / 4 - 0.1 : -width / 4 + 0.1}
        position-z={-depth / 2 - handleDepth / 4}
        rotation-x={Math.PI * 0.5}
        rotation-y={orientation === 'left' ? Math.PI : Math.PI * 2}
      >
        {/* Plate */}
        <mesh position-y={0.05}>
          <cylinderGeometry args={[0.05, 0.05, 0.0001]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Lever */}
        <mesh>
          <cylinderGeometry args={[handleRad, handleRad, 0.1]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Shaft */}
        <mesh
          position-y={-insertDepth}
          position-x={0.06}
          rotation-z={Math.PI / 2}
        >
          <cylinderGeometry args={[handleRad, handleRad, handleShaft]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
      </group>
    </>
  )
}
