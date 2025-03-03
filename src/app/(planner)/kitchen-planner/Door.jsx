import { useMemo } from 'react'
import { BufferGeometry, Path, Vector2, Shape } from 'three'
import { Edges, Outlines } from '@react-three/drei'

import DoorDouble from './DoorDouble'
import DoorSingle from './DoorSingle'

import { useAppState } from '@/appState'

import { wh, wt } from '@/const'

// Reusable materials
import { wallMaterial, doorMaterial, linesMaterial } from '@/materials'

// Styles:
//   solid_1pane.src
//   glass_1pane.src
//   solid_2pane.src (todo)
//   topGlass_2pane.src (todo)
//   twinGlass_2pane.src (todo)

/**
 * General component to display a door. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Door(props) {
  const { is3D } = useAppState()
  if (is3D) return <Door3D {...props} />
  else return <Door2D {...props} />
}

/**
 * Renders a door for the 2D (plan) view.
 */
function Door2D({ len, offset, width, option, onClick = () => {} }) {
  const [handle, opens] = option.split(':')
  const angle = Math.PI / (opens === 'out' ? 4 : -4)
  const lines = useMemo(
    () =>
      new BufferGeometry().setFromPoints(
        new Path()
          .moveTo(width * (Math.cos(angle) - 0.5), width * Math.sin(angle))
          .lineTo(-width / 2, 0)
          .lineTo(width / 2, 0)
          .arc(-width, 0, width, 0, angle * 1.5, opens === 'in')
          .getPoints()
      ),
    [width, opens]
  )

  return (
    <group position={[offset - len / 2, wh + 0.1, 0]} rotation-x={-Math.PI / 2}>
      <mesh material={doorMaterial} onClick={onClick}>
        <planeGeometry args={[width, wt]} />
      </mesh>
      <line
        geometry={lines}
        material={linesMaterial}
        scale-x={handle === 'left' ? -1 : 1}
      />
    </group>
  )
}

/**
 * Component to render a door in the 3D (elevation) view. Fills in the lintel
 * and then paints both sides of the door, switching handle side (by reversing
 * scale) on the outside.
 */
function Door3D({ style, len, offset, width, option }) {
  console.log(style)
  const height = wh - 0.4

  const cw = 0.05
  const d = wt + wt * 0.4
  const sw = cw / 2
  const sd = wt + wt * 0.3

  const cOpp = cw * Math.tan(45 * (Math.PI / 180))
  const sOpp = sw * Math.tan(45 * (Math.PI / 180))

  const casing = getCasingDimensions(width, height + cOpp)
  const stops = getStopsDimensions(width, height + cOpp)
  const sideLeft = getSideLeft(casing, cw, cOpp)
  const sideRight = getSideRight(casing, cw, cOpp)
  const top = getTop(casing, cw, cOpp)
  const sideStopLeft = getSideStopLeft(stops, sw, sOpp)
  const sideStopRight = getSideStopRight(stops, sw, sOpp)
  const topStop = getTopStop(stops, sw, sOpp)

  return (
    // <group position={[offset - len / 2, 0, 0]}>
    <group position={[offset - len / 2, 0, 0]}>
      {/* Lintel */}
      <mesh
        position={[0, wh - 0.2, 0]}
        material={wallMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, 0.4, wt]} />
      </mesh>
      <group position-y={height / 2 - cOpp / 2}>
        {/* Casing (left, right, top) */}
        {casing.map((f, i) =>
          i < 1 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[sideLeft, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='white' />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          ) : i < 2 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[sideRight, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          ) : (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[top, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          )
        )}
        {/* Stops (left, right, top) */}
        {stops.map((f, i) =>
          i < 1 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[sideStopLeft, { depth: sd, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          ) : i < 2 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[sideStopRight, { depth: sd, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          ) : (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[topStop, { depth: sd, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
              <Edges linewidth={1} threshold={15} color={'gray'} />
              <Outlines thickness={0.01} color={'gray'} />
            </mesh>
          )
        )}
        {/* Door */}
        {style === 'solid-1pane' && (
          <DoorSingle casing={casing} thick={wt} depth={sd} />
        )}
        {style === 'solid-2pane' && (
          <DoorDouble casing={casing} thick={wt} depth={sd} />
        )}
      </group>
    </group>
  )

  function getSideLeft(casing, cw, cOpp) {
    return new Shape([
      new Vector2(-casing[0].len / 2, -cw / 2),
      new Vector2(-casing[0].len / 2 + cOpp, cw / 2),
      new Vector2(casing[0].len / 2 - cw, cw / 2),
      new Vector2(casing[0].len / 2 - cw, -cw / 2)
    ])
  }

  function getSideRight(casing, cw, cOpp) {
    return new Shape([
      new Vector2(-casing[0].len / 2 + cw, -cw / 2),
      new Vector2(-casing[0].len / 2 + cOpp, cw / 2),
      new Vector2(casing[0].len / 2 - cOpp, cw / 2),
      new Vector2(casing[0].len / 2, -cw / 2)
    ])
  }

  function getTop(casing, cw, cOpp) {
    return new Shape([
      new Vector2(-casing[2].len / 2, -cw / 2),
      new Vector2(-casing[2].len / 2 + cOpp, cw / 2),
      new Vector2(casing[2].len / 2 - cOpp, cw / 2),
      new Vector2(casing[2].len / 2, -cw / 2)
    ])
  }

  function getSideStopRight(stops, sw, sOpp) {
    return new Shape([
      new Vector2(-stops[0].len / 2 + sw * 2, -sw / 2),
      new Vector2(-stops[0].len / 2 + sw * 2, sw / 2),
      new Vector2(stops[0].len / 2 - sOpp, sw / 2),
      new Vector2(stops[0].len / 2, -sw / 2)
    ])
  }

  function getSideStopLeft(stops, sw, sOpp) {
    return new Shape([
      new Vector2(-stops[0].len / 2, -sw / 2),
      new Vector2(-stops[0].len / 2 + sOpp, sw / 2),
      new Vector2(stops[0].len / 2 - sw * 2, sw / 2),
      new Vector2(stops[0].len / 2 - sw * 2, -sw / 2)
    ])
  }

  function getTopStop(stops, sw, sOpp) {
    return new Shape([
      new Vector2(-stops[2].len / 2, -sw / 2),
      new Vector2(-stops[2].len / 2 + sOpp, sw / 2),
      new Vector2(stops[2].len / 2 - sOpp, sw / 2),
      new Vector2(stops[2].len / 2, -sw / 2)
    ])
  }

  function getCasingDimensions(width, height) {
    // order: left right top
    return [
      {
        pos: [-width / 2 + cw / 2, 0, -d / 2],
        rotation: [0, 0, -Math.PI / 2],
        len: height
      },
      {
        pos: [width / 2 - cw / 2, 0, -d / 2],
        rotation: [0, 0, Math.PI / 2],
        len: height
      },
      {
        pos: [0, height / 2 - cw / 2, -d / 2],
        rotation: [0, 0, Math.PI],
        len: width
      }
    ]
  }

  function getStopsDimensions(width, height) {
    return [
      {
        pos: [-width / 2 + sw / 2 + cw, -cw / 2, -sd / 2],
        rotation: [0, 0, -Math.PI / 2],
        len: height - cw
      },
      {
        pos: [width / 2 - sw / 2 - cw, -cw / 2, -sd / 2],
        rotation: [0, 0, Math.PI / 2],
        len: height
      },
      {
        pos: [0, height / 2 - sw / 2 - cw, -sd / 2],
        rotation: [0, 0, Math.PI],
        len: width - cw * 2
      }
    ]
  }
}
