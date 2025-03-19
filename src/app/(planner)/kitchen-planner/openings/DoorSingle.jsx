import { Edges, Outlines } from '@react-three/drei'
import React from 'react'
import DoorHandle from './DoorHandle'

export default function DoorDouble({ casing, thick, depth }) {
  const width = casing[2].len - thick / 2 - 0.09
  const height = casing[0].len - thick / 2 - 0.065
  return (
    <group position-y={-0.01}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth / 2]} />
        <meshStandardMaterial color='#F9F9F9' />
        <Edges linewidth={1} threshold={15} color={'gray'} />
        <Outlines thickness={0.01} color={'gray'} />
      </mesh>
      <DoorHandle
        len={-height / 16}
        width={width * 2}
        orientation='left'
        depth={depth + 0.01}
      />
    </group>
  )
}
