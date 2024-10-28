import { DoubleSide } from 'three'
import { Vector2, Shape } from 'three'
import {
  casingDimensions,
  frameDimensions,
  dim
} from '@/lib/data/features/window.js'

import { h } from '@/app/(planner)/kitchen-planner/const'

const { d, w } = dim

export default function Window3D({ width = 1.5, height = 0.8 }) {
  const opp = w * Math.tan(45 * (Math.PI / 180))

  const casing = casingDimensions(width, height)
  const frame = frameDimensions(width, height)

  const jamb = new Shape([
    new Vector2(-frame[2].len / 2, -w / 2),
    new Vector2(-frame[2].len / 2 + opp, w / 2),
    new Vector2(frame[2].len / 2 - opp, w / 2),
    new Vector2(frame[2].len / 2, -w / 2)
  ])
  const head = new Shape([
    new Vector2(-frame[0].len / 2, -w / 2),
    new Vector2(-frame[0].len / 2 + opp, w / 2),
    new Vector2(frame[0].len / 2 - opp, w / 2),
    new Vector2(frame[0].len / 2, -w / 2)
  ])

  return (
    <group
      position-z={-frame[0].len / 2 + h - 1.2}
      rotation-z={-Math.PI / 2}
      rotation-x={-Math.PI / 2}
    >
      {casing.map((c, i) => {
        return (
          <mesh key={i} position={c.pos} rotation={c.rotation}>
            <planeGeometry args={[d, c.len]} />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        )
      })}
      {frame.map((f, i) =>
        i < 2 ? (
          <mesh key={i} position={f.pos} rotation={f.rotation}>
            <extrudeGeometry args={[jamb, { depth: d, bevelEnabled: false }]} />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        ) : (
          <mesh key={i} position={f.pos} rotation={f.rotation}>
            <extrudeGeometry args={[head, { depth: d, bevelEnabled: false }]} />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        )
      )}
      <mesh>
        <boxGeometry args={[frame[0].len, w, d - 0.01]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  )
}
