import { Fragment, useContext, useMemo } from 'react'
import { Shape, MeshStandardMaterial } from 'three'

import { ModelContext } from '@/model/context'

import UnitDrawer from './UnitDrawer'
import UnitDoor from './UnitDoor'

import { Edges } from '@react-three/drei'

/**
 * Component to render appropriate left & right (or only) front for a kitchen
 * unit.
 */
export default function UnitFront({ w, h, d, style }) {
  const opt = style.split(':')
  const px = opt.length > 1 ? [-w / 4, w / 4] : [0]
  const z = d / 2 + 0.005
  const dh = h - 0.04
  const dw = w / px.length - 0.04
  return px.map((x, n) => (
    <Fragment key={n}>
      {/* Surround */}
      <UnitSurround
        w={w / px.length}
        h={h}
        position={[x, h / 2 + 0.1, z - 0.005]}
      />
      {/* Drawers or door */}
      {opt[n] === '2-drawer' ? (
        [(3 * (h - 0.04)) / 4, (h - 0.04) / 4].map((y) => (
          <UnitDrawer key={y} dw={dw} dh={dh / 2} position={[x, y + 0.12, z]} />
        ))
      ) : opt[n] === '3-drawer' ? (
        [(7 * dh) / 8, (9 * dh) / 16, (3 * dh) / 16].map((y, n) => (
          <UnitDrawer
            w={w}
            h={h}
            key={y}
            dw={dw}
            dh={n > 0 ? (3 * dh) / 8 : dh / 4}
            position={[x, y + 0.12, z]}
          />
        ))
      ) : opt[n] === '4-drawer' ? (
        [(7 * dh) / 8, (5 * dh) / 8, (3 * dh) / 8, dh / 8].map((y) => (
          <UnitDrawer key={y} dw={dw} dh={dh / 4} position={[x, y + 0.12, z]} />
        ))
      ) : (
        <UnitDoor
          px={px}
          x={x}
          d={d}
          w={w / px.length}
          h={h}
          dw={dw}
          dh={dh}
          // position={[x, h / 2 + 0.1, z]}
          position={[x, h / 2 + 0.1, z - 0.005]}
          handle={n ? 'left' : 'right'}
        />
      )}
    </Fragment>
  ))
}

// re. 'extra': 26.20mm for the thickness of the lower part of the frame.
// 26.20 - 18 = 8.2
function UnitSurround({ w, h, position }) {
  const extra = 0.0082
  const [model] = useContext(ModelContext)
  const frontMaterial = useMemo(
    () => new MeshStandardMaterial({ color: model.colour }),
    [model.colour]
  )
  const shape = new Shape()
    .moveTo(-w / 2, -h / 2 - extra - 0.018)
    .lineTo(w / 2, -h / 2 - extra - 0.018)
    .lineTo(w / 2, h / 2)
    .lineTo(-w / 2, h / 2)
    .closePath()
  shape.holes.push(
    new Shape()
      .moveTo(0.02 - w / 2, 0.022 - h / 2 - extra - 0.009)
      .lineTo(0.02 - w / 2, h / 2 - 0.02)
      .lineTo(w / 2 - 0.02, h / 2 - 0.02)
      .lineTo(w / 2 - 0.02, 0.022 - h / 2 - extra - 0.009)
      .closePath()
  )

  return (
    <mesh material={frontMaterial} position={position}>
      <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: false }]} />
      <Edges linewidth={1} threshold={15} color={'gray'} />
    </mesh>
  )
}
