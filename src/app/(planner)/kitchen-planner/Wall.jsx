import { Vector2, MathUtils, Shape } from 'three'
import { useMemo } from 'react'

// component takes in 4 points, which are used for creating the walls

export default function Wall({ id, a, b, pre, next, t, h, color }) {
  // Wall geometry
  const len = Math.sqrt((b.z - a.z) ** 2 + (b.x - a.x) ** 2) // opp and adj
  const angle = Math.atan2(b.z - a.z, b.x - a.x)

  const pos = [(a.x + b.x) / 2, h, (a.z + b.z) / 2]

  // mitre end a (add theta of main wall to theta of prev)
  const angleNext = Math.atan2(next.z - b.z, next.x - b.x)
  const anglePrev = Math.atan2(a.z - pre.z, a.x - pre.x)
  const mitreEnd = (angleNext - angle) / 2
  const mitreStart = (angle - anglePrev) / 2

  const clamp = (t) => (Math.abs(t) < 2.5 ? t : 0)
  const te = t * clamp(Math.tan(mitreEnd))
  const ts = t * clamp(Math.tan(mitreStart))

  // Base shape for the wall footprint
  const shape = new Shape([
    new Vector2((len - te) / 2, t / 2),
    new Vector2((len + te) / 2, t / -2),
    new Vector2((len + ts) / -2, t / -2),
    new Vector2((len - ts) / -2, t / 2),
    new Vector2((len - te) / 2, t / 2)
  ])

  return (
    <mesh position={pos} rotation-x={Math.PI * 0.5} rotation-z={angle}>
      <extrudeGeometry args={[shape, { depth: 1, bevelEnabled: false }]} />
      <meshNormalMaterial color={color} />
    </mesh>
  )
}
