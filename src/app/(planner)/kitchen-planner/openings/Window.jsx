'use client'
import { useContext, useMemo } from 'react'
import {
  BufferGeometry,
  Vector3,
  TextureLoader,
  Vector2,
  Shape,
  LineBasicMaterial
} from 'three'
import { Edges } from '@react-three/drei'

import { useLoader } from '@react-three/fiber'

import { AppContext } from '@/appState'
import { useAppState } from '@/appState'
import { ModelContext } from '@/model/context'

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
function Window2D({ len, offset, width, style, onClick = () => {} }) {
  const lines = useMemo(() => {
    const a = new Vector3(-width / 2, 0, 0)
    const b = new Vector3(width / 2, 0, 0)

    const geometry = new BufferGeometry()
    geometry.setFromPoints([a, b])
    return geometry
  }, [width])

  return (
    <group
      position={[offset - len / 2, wh + 0.1, 0]}
      rotation-x={-Math.PI / 2}
      onClick={onClick}
    >
      <mesh>
        <planeGeometry args={[width, wt]} />
        <meshStandardMaterial color='#999999' />
        <Edges threshold={13} lineWidth={0.5} color={'gray'} />
      </mesh>
      <lineSegments
        geometry={lines}
        material={new LineBasicMaterial({ color: 'gray' })}
      />
      {style === 'double' && (
        <mesh>
          <planeGeometry args={[0.018, wt]} />
          <meshStandardMaterial color='lightgray' />
          <Edges threshold={13} lineWidth={0.5} color={'gray'} />
        </mesh>
      )}
    </group>
  )
}

/**
 * Component to render a door in the 3D (elevation) view. Fills in the lintel
 * and then paints both sides of the window with the same (symmetrical) image.
 * If the window is not full height, also paints the wall below it.
 */
function Window3D({ style, len, offset, width, option }) {
  const [model, dispatch] = useContext(ModelContext)

  const texture = useLoader(TextureLoader, window_pane.src)
  const height = wh - 0.4 - (option === 'full' ? 0 : wh / 2)

  const frame = frameDimensions(width, height)
  const jamb = getJambDimensions(frame, w)
  const head = getHeadDimensions(frame, w)

  const wallColor = model.wall || '#BFBFBF'

  return (
    // <group position={[0, -height, 0]}>
    <group position={[offset - len / 2, 0, 0]}>
      {/* Lintel */}
      <mesh receiveShadow position={[0, wh - 0.2, 0]} castShadow>
        <meshStandardMaterial color={wallColor} />
        <boxGeometry args={[width, 0.4, wt]} />
      </mesh>
      <group position={[0, wh - 0.4 - height / 2, 0.05 - wt / 2]}>
        {frame.map((f, i) =>
          i < 2 ? (
            <mesh receiveShadow key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[jamb, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='#eee' />
              <Edges linewidth={1} threshold={15} color={'#989898'} />
            </mesh>
          ) : (
            <mesh receiveShadow key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[head, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial color='#eee' />
              <Edges linewidth={1} threshold={15} color={'#989898'} />
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
          </>
        )}

        {/* Pane */}
        <mesh>
          <boxGeometry args={[width - 0.1, height - 0.1, 0.0001]} />
          <meshStandardMaterial map={texture} transparent opacity={0.3} />
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
          <meshStandardMaterial color={wallColor} />
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
