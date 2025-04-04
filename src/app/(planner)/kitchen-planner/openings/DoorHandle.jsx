import React from 'react'
import { Edges, Outlines } from '@react-three/drei'

export default function DoorHandle({ len, width, depth, orientation }) {
  const leverLength = 0.18
  const shaftLength = 0.05
  const rad = 0.015

  return (
    <>
      <group
        position-y={len}
        position-x={orientation === 'left' ? width / 4 - 0.1 : -width / 4 + 0.1}
        position-z={depth / 2}
        rotation-x={-Math.PI * 0.5}
        rotation-y={orientation === 'left' ? Math.PI : Math.PI * 2}
      >
        {/* Plate */}
        <mesh position-y={0.05}>
          <cylinderGeometry args={[0.05, 0.05, 0.0001]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Shaft */}
        <mesh position-y={shaftLength / 2}>
          <cylinderGeometry args={[rad, rad, shaftLength]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Lever */}
        <mesh position-x={0.06} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[rad, rad, leverLength]} />
          <meshStandardMaterial color='lightgrey' />
          <Edges linewidth={1} threshold={15} color={'gray'} />
        </mesh>
      </group>

      <group
        position-y={len}
        position-x={orientation === 'left' ? width / 4 - 0.1 : -width / 4 + 0.1}
        position-z={-depth / 2}
        rotation-x={Math.PI * 0.5}
        rotation-y={orientation === 'left' ? Math.PI : Math.PI * 2}
      >
        {/* Plate */}
        <mesh position-y={0.05}>
          <cylinderGeometry args={[0.05, 0.05, 0.0001]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Shaft */}
        <mesh position-y={shaftLength / 2}>
          <cylinderGeometry args={[rad, rad, shaftLength]} />
          <meshStandardMaterial color='lightgrey' />
        </mesh>
        {/* Lever */}
        <mesh position-x={0.06} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[rad, rad, leverLength]} />
          <meshStandardMaterial color='lightgrey' />
          <Edges linewidth={1} threshold={15} color={'gray'} />
        </mesh>
      </group>
    </>
  )
}
