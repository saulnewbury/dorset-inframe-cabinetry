'use client'
import { useContext, useMemo } from 'react'
import { BufferGeometry, Vector3, TextureLoader, Vector2, Shape } from 'three'

import { useLoader } from '@react-three/fiber'

import { AppContext } from '@/appState'
import { useAppState } from '@/appState'

import { wh, wt } from '@/const'

// Reusable materials
import { wallMaterial, windowMaterial, linesMaterial } from '@/materials'

// Texture images for door styles:
import window_pane from '@/assets/windows/window-pane.webp'

import WindowSashDouble from './WindowSashDouble'
import WindowSashSingle from './WindowSashSingle'

const w = 0.05
const d = wt * 0.4
const opp = w * Math.tan(45 * (Math.PI / 180))

/**
 * General component to display a window. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Window(props) {
  const { is3D } = useAppState()
  if (is3D) return <Window3D {...props} />
  else return <Window2D {...props} />
}

/**
 * Renders a window for the 2D (plan) view.
 */
function Window2D({ len, offset, width, onClick = () => {} }) {
  const lines = useMemo(
    () =>
      new BufferGeometry().setFromPoints([
        // segment 1
        new Vector3(-width / 2, -wt / 2, 0),
        new Vector3(-width / 2, wt / 2, 0),
        // segment 2
        new Vector3(-width / 2, wt * 0.3, 0),
        new Vector3(width / 2, wt * 0.3, 0),
        // segment 3
        new Vector3(-width / 2, 0, 0),
        new Vector3(width / 2, 0, 0),
        // segment 4
        new Vector3(width / 2, -wt * 0.3, 0),
        new Vector3(-width / 2, -wt * 0.3, 0),
        // segment 4
        new Vector3(width / 2, wt / 2, 0),
        new Vector3(width / 2, -wt / 2, 0)
      ]),
    [width]
  )

  return (
    <group
      position={[offset - len / 2, wh + 0.1, 0]}
      rotation-x={-Math.PI / 2}
      onClick={onClick}
    >
      <mesh material={windowMaterial}>
        <planeGeometry args={[width, wt]} />
      </mesh>
      <lineSegments geometry={lines} material={linesMaterial} />
    </group>
  )
}

/**
 * Component to render a door in the 3D (elevation) view. Fills in the lintel
 * and then paints both sides of the window with the same (symmetrical) image.
 * If the window is not full height, also paints the wall below it.
 */
function Window3D({ style, len, offset, width, option }) {
  const texture = useLoader(TextureLoader, window_pane.src)
  const height = wh - 0.4 - (option === 'full' ? 0 : wh / 2)

  const frame = frameDimensions(width, height)
  const jamb = getJambDimensions(frame, w)
  const head = getHeadDimensions(frame, w)

  return (
    // <group position={[0, -height, 0]}>
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
      <group position={[0, wh - 0.4 - height / 2, 0.05 - wt / 2]}>
        {frame.map((f, i) =>
          i < 2 ? (
            <mesh key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[jamb, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='#eee' />
            </mesh>
          ) : (
            <mesh key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[head, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='#eee' />
            </mesh>
          )
        )}
        {/* Sash */}
        {style === 'single' && (
          <WindowSashSingle
            len={height}
            width={width}
            frame={frame}
            w={w}
            d={d}
            opp={opp}
            color='#eee'
          />
        )}

        {style === 'double' && (
          <>
            <WindowSashDouble
              len={height}
              width={width}
              frame={frame}
              w={w}
              d={d}
              opp={opp}
              color='#eee'
            />
            <mesh>
              <boxGeometry args={[w, height, d]} />
              <meshStandardMaterial color='#eee' />
            </mesh>
          </>
        )}

        {/* Pane */}
        <mesh>
          <boxGeometry args={[width - 0.1, height - 0.1, 0.0001]} />
          <meshStandardMaterial map={texture} transparent opacity={0.5} />
        </mesh>
      </group>
      {/* Wall below */}
      {option !== 'full' && (
        <mesh
          position={[0, wh / 4, 0]}
          castShadow
          receiveShadow
          material={wallMaterial}
        >
          <boxGeometry args={[width, wh / 2, wt]} />
        </mesh>
      )}
    </group>
  )

  function getJambDimensions(frame, w) {
    const l = frame[2].len
    return new Shape([
      new Vector2(-l / 2, -w / 2),
      new Vector2(-l / 2 + opp, w / 2),
      new Vector2(l / 2 - opp, w / 2),
      new Vector2(l / 2, -w / 2)
    ])
  }

  function getHeadDimensions(frame, w) {
    return new Shape([
      new Vector2(-frame[0].len / 2, -w / 2),
      new Vector2(-frame[0].len / 2 + opp, w / 2),
      new Vector2(frame[0].len / 2 - opp, w / 2),
      new Vector2(frame[0].len / 2, -w / 2)
    ])
  }

  function frameDimensions(width, height) {
    // top bottom left right

    return [
      {
        pos: [-width / 2 + w / 2, 0, -d / 2],
        rotation: [0, 0, -Math.PI / 2],
        len: width
      },
      {
        pos: [width / 2 - w / 2, 0, -d / 2],
        rotation: [0, 0, Math.PI / 2],
        len: width
      },
      {
        pos: [0, -height / 2 + w / 2, -d / 2],
        rotation: [0, 0, 0],
        len: height
      },
      {
        // pos: [0, jamb / 2, 0],
        pos: [0, height / 2 - w / 2, -d / 2],
        rotation: [0, 0, Math.PI],
        len: height
      }
    ]
  }
}
