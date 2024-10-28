import { DoubleSide } from 'three'
import { Vector2, Shape } from 'three'
import { casing, dim, frame } from '@/lib/data/features/window.js'

import { t } from '@/app/(planner)/kitchen-planner/const'

const { d, w, totalHeightFromFloor } = dim

export default function Window() {
  const opp = w * Math.tan(45 * (Math.PI / 180))

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
      position-y={totalHeightFromFloor}
      rotation-z={-Math.PI / 2}
      position-z={-1.5 - t / 2}
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
