import { useContext, useMemo } from 'react'
import {
  BufferGeometry,
  Vector3,
  TextureLoader,
  DoubleSide,
  Vector2,
  Shape
} from 'three'

import { useLoader } from '@react-three/fiber'

import { AppContext } from '@/appState'

import { wh, wt } from '@/const'

// Reusable materials
import { wallMaterial, windowMaterial, linesMaterial } from '@/materials'

// Texture images for door styles:
import single_pane from '@/assets/windows/window-pane.webp'
import double_pane from '@/assets/windows/double.svg'
import triple_pane from '@/assets/windows/triple.svg'
import WindowSashDouble from './WindowSashDouble'
import WindowSashSingle from './WindowSashSingle'

const pattern = {
  single: single_pane.src,
  double: double_pane.src,
  triple: triple_pane.src
}

const w = 0.05
const d = wt * 0.4

/**
 * General component to display a window. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Window(props) {
  const { is3D } = useContext(AppContext)
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
  const texture = useLoader(TextureLoader, pattern[style])
  const height = wh - 0.4 - (option === 'full' ? 0 : wh / 2)
  const frame = frameDimensions(width, height)

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
      {/* Window */}
      <group position={[0, wh - 0.4 - height / 2, 0.05 - wt / 2]}>
        <mesh>
          <boxGeometry args={[width, height, 0.02]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        {frame.map((f, i) =>
          i < 2 ? (
            <mesh key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[jamb, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial side={DoubleSide} />
            </mesh>
          ) : (
            <mesh key={i} position={f.pos} rotation={f.rotation}>
              <extrudeGeometry
                args={[head, { depth: d, bevelEnabled: false }]}
              />
              <meshStandardMaterial side={DoubleSide} />
            </mesh>
          )
        )}
      </group>
      {/* Wall below */}
      {option !== 'full' && (
        <mesh
          position={[0, wh / 4, 0]}
          material={wallMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, wh / 2, wt]} />
        </mesh>
      )}
    </group>
  )

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
