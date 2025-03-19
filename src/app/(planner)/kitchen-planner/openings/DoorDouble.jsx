import React from 'react'

import DoorHandle from './DoorHandle'

export default function DoorDouble({ casing, thick, depth }) {
  const width = casing[2].len - thick / 2 - 0.09
  const height = casing[0].len - thick / 2 - 0.065
  return (
    <>
      <group position-x={width / 4 + 0.003} position-y={-0.01}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width / 2, height, depth / 2]} />
          <meshStandardMaterial color='#F9F9F9' />
        </mesh>
        <DoorHandle
          len={-height / 16}
          width={width}
          orientation='right'
          depth={depth + 0.01}
        />
      </group>

      <group position-x={-width / 4 - 0.003} position-y={-0.01}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width / 2, height, depth / 2]} />
          <meshStandardMaterial color='#F9F9F9' />
        </mesh>
        <DoorHandle
          len={-height / 16}
          width={width}
          orientation='left'
          depth={depth + 0.01}
        />
      </group>
    </>
  )
}
