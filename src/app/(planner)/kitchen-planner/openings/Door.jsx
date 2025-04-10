import { useMemo } from 'react'
import {
  BufferGeometry,
  Vector2,
  Vector3,
  LineBasicMaterial,
  Shape
} from 'three'
import { Edges } from '@react-three/drei'

import DoorDouble from './DoorDouble'
import DoorSingle from './DoorSingle'

import { useAppState } from '@/appState'

import { wh, wt } from '@/const'

import { lineColor } from '../cabinet/colors'
import { wallColor } from '../cabinet/colors'

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
function Door2D({ len, offset, width, option, style, onClick = () => {} }) {
  const w = style === 'double-door' ? width / 2 : width
  const [handle, opens] = option.split(':')
  const angle = Math.PI / (opens == 'out' ? 2 : -2)

  // Arcs
  const arcsGeometry = useMemo(() => {
    let vertices = []
    const arcSegments = 20 // Increase for a smoother arc.

    // Double door
    if (style === 'double-door') {
      // Left arc
      const arcPointsA = []
      for (let i = 0; i <= arcSegments; i++) {
        const t = i / arcSegments
        const theta = t * angle
        // Compute arc points then add a vertical offset of 0.072.
        const x = -w + w * Math.cos(theta)
        const y = w * Math.sin(theta)
        arcPointsA.push(new Vector3(x, y, 0))
      }
      // Convert continuous arc into separate line segments.
      for (let i = 0; i < arcPointsA.length - 1; i++) {
        vertices.push(arcPointsA[i], arcPointsA[i + 1])
      }

      // Right arc
      const arcPointsB = []
      for (let i = 0; i <= arcSegments; i++) {
        const t = i / arcSegments
        const theta = t * angle
        // Compute arc points then add a vertical offset of 0.072.
        const x = w - w * Math.cos(theta)
        const y = w * Math.sin(theta)
        arcPointsB.push(new Vector3(x, y, 0))
      }
      // Convert continuous arc into separate line segments.
      for (let i = 0; i < arcPointsB.length - 1; i++) {
        vertices.push(arcPointsB[i], arcPointsB[i + 1])
      }
    }

    // Single door
    if (style === 'single-door') {
      const arcPointsA = []
      for (let i = 0; i <= arcSegments; i++) {
        const t = i / arcSegments
        const theta = t * angle
        // Compute arc points then add a vertical offset of 0.072.
        const x = -width + width * Math.cos(theta) + w / 2
        const y = width * Math.sin(theta)
        arcPointsA.push(new Vector3(x, y, 0))
      }
      // Convert continuous arc into separate line segments.
      for (let i = 0; i < arcPointsA.length - 1; i++) {
        vertices.push(arcPointsA[i], arcPointsA[i + 1])
      }
    }

    const geometry = new BufferGeometry()
    geometry.setFromPoints(vertices)
    return geometry
  }, [width, opens])

  // Doors
  const doorsGeometry = useMemo(() => {
    let vertices = []

    if (style === 'double-door') {
      const pointsA = doorA(width, angle, w) // function (bottom of page)
      const pointsB = doorB(width, angle, w) // function (bottom of page)
      const arr = [...pointsA, ...pointsB]

      for (let i = 0; i < arr.length; i++) {
        vertices.push(arr[i])
      }
    }

    if (style === 'single-door') {
      const pointsA = doorA(width, angle, w) // function (bottom of page)
      for (let i = 0; i < pointsA.length; i++) {
        console.log('loop')
        vertices.push(pointsA[i])
      }
    }

    const geometry = new BufferGeometry()
    geometry.setFromPoints(vertices)
    return geometry
  }, [width, opens])

  return (
    <group position={[offset - len / 2, wh + 0.1, 0]} rotation-x={-Math.PI / 2}>
      <mesh onClick={onClick}>
        <planeGeometry args={[width - 0.001, wt]} />
        <meshStandardMaterial color='#999999' />
        <Edges threshold={15} color='gray' lineWidth={0.5} />
      </mesh>
      {/* Door(s) */}
      <lineSegments
        geometry={doorsGeometry}
        material={new LineBasicMaterial({ color: 'gray' })}
        scale-x={handle === 'left' ? -1 : 1}
      />
      {/* Arc(s) */}
      <lineSegments
        geometry={arcsGeometry}
        material={new LineBasicMaterial({ color: 'lightgray' })}
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
        // material={wallMaterial}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={wallColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
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
              <Edges linewidth={1} threshold={15} color={lineColor} />
            </mesh>
          )
        )}
        {/* Door */}
        {style === 'single-door' && (
          <DoorSingle casing={casing} thick={wt} depth={sd} />
        )}
        {style === 'double-door' && (
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

// 2D door A
const doorA = (width, angle, w) => {
  const a = new Vector3(width * (Math.cos(angle) - 0.5), w * Math.sin(angle))
  const b = new Vector3(-width / 2, 0.072)

  const c = new Vector3(
    width * (Math.cos(angle) - 0.5) + 0.063,
    w * Math.sin(angle)
  )
  const d = new Vector3(-width / 2 + 0.063, 0.072)

  return [a, b, c, d]
}

// 2D door B
const doorB = (width, angle, w) => {
  const a = new Vector3(-width * (Math.cos(angle) - 0.5), w * Math.sin(angle))
  const b = new Vector3(width / 2, 0.072)

  const c = new Vector3(
    -width * (Math.cos(angle) - 0.5) - 0.063,
    w * Math.sin(angle)
  )
  const d = new Vector3(width / 2 - 0.063, 0.072)

  return [a, b, c, d]
}
