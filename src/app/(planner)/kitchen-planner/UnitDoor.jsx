'use client'

import { useContext, useMemo } from 'react'
import { Edges } from '@react-three/drei'
import {
  BatchedMesh,
  BoxGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Shape,
  MeshStandardMaterial
} from 'three'

import { ModelContext } from '@/model/context'
import UnitHandle from './UnitHandle'

/**
 * Component to render a door with a handle (left or right). Uses a batched
 * mesh to optimise drawing of the various parts, all of which use the same
 * material. Added gray lines using EdgesGeometry for better visual definition.
 */
export default function UnitDoor({
  w,
  h,
  d,
  x,
  px,
  dw,
  dh,
  handle = 'left',
  position
}) {
  const [model] = useContext(ModelContext)

  const t = 0.018
  const bvw = dw >= 0.4 ? 0.08 : 0.05
  const bvh = 0.08

  return (
    <group position={[position[0], position[1], position[2] + t]}>
      <mesh position-z={t}>
        <boxGeometry args={[dw - 0.009, dh - 0.009, t / 2 + 0.003]} />
        <meshStandardMaterial />
        <Edges linewidth={1} threshold={15} color={'gray'} />
      </mesh>
      <DoorPanels
        w={w / px.length}
        h={h}
        position={[x, 0, t - t / 2 + 0.005]}
        t={t}
      />

      <UnitHandle
        position={[
          handle === 'left' ? (bvw - dw) / 2 : (dw - bvw) / 2,
          0,
          0.03
        ]}
      />
    </group>
  )
}

function DoorPanels({ w, h, t, position }) {
  const [model] = useContext(ModelContext)
  const frontMaterial = useMemo(
    () => new MeshStandardMaterial({ color: model.colour }),
    [model.colour]
  )

  const pw = 0.065 // panel width

  const shape = new Shape()
    .moveTo(-w / 2 + t + t / 2, -h / 2 + t * 0.7)
    .lineTo(w / 2 - t - t / 2, -h / 2 + t * 0.7)
    .lineTo(w / 2 - t - t / 2, h / 2 - t - t / 2)
    .lineTo(-w / 2 + t + t / 2, h / 2 - t - t / 2)
    .closePath()
  shape.holes.push(
    new Shape()
      .moveTo(0.02 - w / 2 + pw, 0.022 - h / 2 + pw * 0.8)
      .lineTo(0.02 - w / 2 + pw, h / 2 - 0.02 - pw)
      .lineTo(w / 2 - 0.02 - pw, h / 2 - 0.02 - pw)
      .lineTo(w / 2 - 0.02 - pw, 0.022 - h / 2 + pw * 0.8)
      .closePath()
  )

  return (
    <mesh material={frontMaterial} position={position}>
      <extrudeGeometry args={[shape, { depth: 0.018, bevelEnabled: false }]} />
      <Edges linewidth={1} threshold={15} color={'gray'} />
      {/* <meshNormalMaterial /> */}
    </mesh>
  )
}
