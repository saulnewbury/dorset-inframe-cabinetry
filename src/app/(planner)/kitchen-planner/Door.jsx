import { useContext, useMemo } from 'react'
import { BufferGeometry, Path, TextureLoader, Vector2, Shape } from 'three'
import { useLoader } from '@react-three/fiber'

import { AppContext } from '@/appState'

import { wh, wt } from '@/const'

// Reusable materials
import { wallMaterial, doorMaterial, linesMaterial } from '@/materials'

// Texture images for door styles:
import solid_2pane from '@/assets/doors/solid-2pane.svg'
import topGlass_2pane from '@/assets/doors/top-glass-2pane.svg'
import twinGlass_2pane from '@/assets/doors/twin-glass-2pane.svg'
import solid_1pane from '@/assets/doors/solid-1pane.svg'
import glass_1pane from '@/assets/doors/glass-1pane.svg'

const pattern = {
  'solid-1pane': solid_1pane.src,
  'glass-1pane': glass_1pane.src,
  'solid-2pane': solid_2pane.src,
  'top-2pane': topGlass_2pane.src,
  'twin-2pane': twinGlass_2pane.src
}

/**
 * General component to display a door. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Door(props) {
  const { is3D } = useContext(AppContext)
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
  const texture = useLoader(TextureLoader, pattern[style])
  const [handle] = option.split(':')
  const height = wh - 0.4
  const scale = handle === 'left' ? -1 : 1

  const cw = 0.05
  const d = wt + wt * 0.4
  const sw = cw / 2
  const sd = wt + wt * 0.3

  const cOpp = cw * Math.tan(45 * (Math.PI / 180))
  const sOpp = sw * Math.tan(45 * (Math.PI / 180))

  const casing = getCasingDimensions(width, height + cOpp)
  const stops = getStopsDimensions(width, height + cOpp)

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
        {/* Casing */}
        {casing.map((f, i) =>
          i < 2 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[side, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='white' />
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
              <meshStandardMaterial color='white' />
            </mesh>
          )
        )}
        {/* Stops */}
        {stops.map((f, i) =>
          i < 2 ? (
            <mesh
              key={i}
              position={f.pos}
              rotation={f.rotation}
              castShadow
              receiveShadow
            >
              <extrudeGeometry
                args={[sideStop, { depth: sd, bevelEnabled: false }]}
              />
              <meshStandardMaterial />
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
            </mesh>
          )
        )}
        {/* Door */}
        <mesh position-y={-0.01} castShadow receiveShadow>
          <boxGeometry
            args={[
              casing[2].len - wt / 2 - 0.085,
              casing[0].len - wt / 2 - 0.065,
              sd
            ]}
          />
          <meshStandardMaterial color='#F9F9F9' />
        </mesh>
      </group>
    </group>
  )

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
