'use client'

import { Edges } from '@react-three/drei'
import React from 'react'

export default function Feet({ carcassInnerWidth, carcassDepth }) {
  const feet = [
    {
      x: carcassInnerWidth / 3.05,
      z: carcassDepth / 2 - 0.12
    },
    {
      x: -carcassInnerWidth / 3.05,
      z: carcassDepth / 2 - 0.12
    },
    {
      x: carcassInnerWidth / 3.05,
      z: -carcassDepth / 2 + 0.1
    },
    {
      x: -carcassInnerWidth / 3.05,
      z: -carcassDepth / 2 + 0.1
    }
  ]

  const baseCarcassToFloor = 0.104 + 0.026 // = 0.13

  return (
    <group position-y={-baseCarcassToFloor / 2 - 0.0002}>
      {feet.map((f, idx) => (
        <group key={idx} position-x={f.x} position-z={f.z}>
          {/* Foot inner shaft */}
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, baseCarcassToFloor, 25]} />
            <meshStandardMaterial color='#777777' />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          {/* Foot shaft upper and lower */}
          <mesh position-y={-0.065 + 0.08}>
            <cylinderGeometry args={[0.02, 0.02, 0.099, 25]} />
            <meshStandardMaterial color='#777777' />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          <mesh position-y={-0.065 + 0.01}>
            <cylinderGeometry args={[0.02, 0.02, 0.02, 25]} />
            <meshStandardMaterial color='#777777' />
            <Edges color='gray' renderOrder={1000} threshold={1} />
          </mesh>
          {/* Foot base */}
          <mesh position-y={-0.065 + 0.01 / 2}>
            <cylinderGeometry args={[0.035, 0.035, 0.01, 32]} />
            <meshStandardMaterial color='#777777' />
            <Edges color='gray' renderOrder={1000} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
