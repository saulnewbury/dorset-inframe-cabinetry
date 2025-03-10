'use client'

import { Edges } from '@react-three/drei'

import React from 'react'

// const feet = [
//   {
//     x: 0.2,
//     z: 0.2
//   },
//   {
//     x: -0.2,
//     z: 0.2
//   },
//   {
//     x: 0.2,
//     z: -0.2
//   },
//   {
//     x: -0.2,
//     z: -0.2
//   }
// ]

export default function Feet({ carcassInnerWidth, carcassDepth }) {
  const feet = [
    {
      x: carcassInnerWidth / 2500,
      z: carcassDepth / 1000 / 2 - 0.12
    },
    {
      x: -carcassInnerWidth / 2500,
      z: carcassDepth / 1000 / 2 - 0.12
    },
    {
      x: carcassInnerWidth / 2500,
      z: -carcassDepth / 1000 / 2 + 0.1
    },
    {
      x: -carcassInnerWidth / 2500,
      z: -carcassDepth / 1000 / 2 + 0.1
    }
  ]

  return (
    <group position-y={-0.0652}>
      {feet.map((f, idx) => (
        <group key={idx} position-x={f.x} position-z={f.z}>
          {/* Foot inner shaft */}
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.104 + 0.026, 25]} />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          {/* Foot shaft upper and lower */}
          <mesh position-y={-0.065 + 0.08}>
            <cylinderGeometry args={[0.02, 0.02, 0.099, 25]} />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          <mesh position-y={-0.065 + 0.01}>
            <cylinderGeometry args={[0.02, 0.02, 0.02, 25]} />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          {/* Foot base */}
          <mesh position-y={-0.065 + 0.01 / 2}>
            <cylinderGeometry args={[0.035, 0.035, 0.01, 32]} />
            <Edges color='gray' renderOrder={1000} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
