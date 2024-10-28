import { DoubleSide } from 'three'
import { Vector2, Shape } from 'three'
import {
  cw,
  sw,
  getCasingDimensions,
  getStopsDimensions,
  d,
  sd
} from '@/lib/data/features/door.js'
import { t, h } from './const.js'

export default function Door3D({ height = 2.2, width = 1.2 }) {
  const casing = getCasingDimensions(width, height)
  const stops = getStopsDimensions(width, height)
  const cOpp = cw * Math.tan(45 * (Math.PI / 180))
  const sOpp = sw * Math.tan(45 * (Math.PI / 180))
  const offset = (h - casing[0].len) / 2

  const side = new Shape([
    new Vector2(-casing[0].len / 2, -cw / 2),
    new Vector2(-casing[0].len / 2 + cOpp, cw / 2),
    new Vector2(casing[0].len / 2 - cOpp, cw / 2),
    new Vector2(casing[0].len / 2, -cw / 2)
  ])

  const top = new Shape([
    new Vector2(-casing[2].len / 2, -cw / 2),
    new Vector2(-casing[2].len / 2 + cOpp, cw / 2),
    new Vector2(casing[2].len / 2 - cOpp, cw / 2),
    new Vector2(casing[2].len / 2, -cw / 2)
  ])

  const sideStop = new Shape([
    new Vector2(-stops[0].len / 2, -sw / 2),
    new Vector2(-stops[0].len / 2 + sOpp, sw / 2),
    new Vector2(stops[0].len / 2 - sOpp, sw / 2),
    new Vector2(stops[0].len / 2, -sw / 2)
  ])

  const topStop = new Shape([
    new Vector2(-stops[2].len / 2, -sw / 2),
    new Vector2(-stops[2].len / 2 + sOpp, sw / 2),
    new Vector2(stops[2].len / 2 - sOpp, sw / 2),
    new Vector2(stops[2].len / 2, -sw / 2)
  ])

  return (
    <group rotation-x={-Math.PI / 2} position-z={h / 2 + offset + cw}>
      {casing.map((f, i) =>
        i < 2 ? (
          <mesh key={i} position={f.pos} rotation={f.rotation} receiveShadow>
            <extrudeGeometry args={[side, { depth: d, bevelEnabled: false }]} />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        ) : (
          <mesh key={i} position={f.pos} rotation={f.rotation} receiveShadow>
            <extrudeGeometry args={[top, { depth: d, bevelEnabled: false }]} />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        )
      )}
      {stops.map((f, i) =>
        i < 2 ? (
          <mesh key={i} position={f.pos} rotation={f.rotation} receiveShadow>
            <extrudeGeometry
              args={[sideStop, { depth: sd, bevelEnabled: false }]}
            />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        ) : (
          <mesh key={i} position={f.pos} rotation={f.rotation} receiveShadow>
            <extrudeGeometry
              args={[topStop, { depth: sd, bevelEnabled: false }]}
            />
            <meshStandardMaterial side={DoubleSide} />
          </mesh>
        )
      )}
      <mesh position-y={-0.01} receiveShadow>
        <boxGeometry
          args={[casing[2].len - t / 2 - 0.1, casing[0].len - t / 2 - 0.08, sd]}
        />
        <meshStandardMaterial side={DoubleSide} color='white' />
      </mesh>
    </group>
  )
}
