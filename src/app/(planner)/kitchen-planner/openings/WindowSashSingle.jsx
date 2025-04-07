'use client'

import { Shape, Vector2 } from 'three'
import { Edges } from '@react-three/drei'

export default function WindowSashSingle({
  len,
  width,
  frame,
  w,
  d,
  opp,
  color
}) {
  const sash = sashDimensions(width - w * 2, len - w * 2)
  const sashSide = getSashSideDimensions(frame, w)
  const sashHead = getSashHeadDimensions(sash, w)

  return (
    <group position-z={0}>
      {sash.map((s, i) =>
        i < 2 ? (
          <mesh key={i} position={s.pos} rotation={s.rotation}>
            <extrudeGeometry
              args={[sashSide, { depth: d / 2, bevelEnabled: false }]}
            />
            <meshStandardMaterial color={color} />
            <Edges linewidth={1} threshold={15} color={'#989898'} />
          </mesh>
        ) : (
          <mesh key={i} position={s.pos} rotation={s.rotation}>
            <extrudeGeometry
              args={[sashHead, { depth: d / 2, bevelEnabled: false }]}
            />
            <meshStandardMaterial color={color} />
            <Edges linewidth={1} threshold={15} color={'#989898'} />
          </mesh>
        )
      )}
    </group>
  )

  function getSashSideDimensions(sash, w) {
    const l = sash[2].len
    return new Shape([
      new Vector2(-l / 2 + w, -w / 2),
      new Vector2(-l / 2 + opp * 2, w / 2),
      new Vector2(l / 2 - opp * 2, w / 2),
      new Vector2(l / 2 - w, -w / 2)
    ])
  }
  function getSashHeadDimensions(sash, w) {
    const l = sash[0].len
    return new Shape([
      new Vector2(-l / 2, -w / 2),
      new Vector2(-l / 2 + opp, w / 2),
      new Vector2(l / 2 - opp, w / 2),
      new Vector2(l / 2, -w / 2)
    ])
  }

  function sashDimensions(width, height) {
    // top bottom left right
    return [
      {
        pos: [-width / 2 + w / 2, 0, -d / 4],
        rotation: [0, 0, -Math.PI / 2],
        len: width
      },
      {
        pos: [width / 2 - w / 2, 0, -d / 4],
        rotation: [0, 0, Math.PI / 2],
        len: width
      },
      {
        pos: [0, -height / 2 + w / 2, -d / 4],
        rotation: [0, 0, 0],
        len: height
      },
      {
        pos: [0, height / 2 - w / 2, -d / 4],
        rotation: [0, 0, Math.PI],
        len: height
      }
    ]
  }
}
