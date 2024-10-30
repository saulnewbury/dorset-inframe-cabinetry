import { useMemo, useRef, useState } from 'react'
import { Matrix4, Shape, Vector2, Vector3 } from 'three'
import { DragControls, Html } from '@react-three/drei'
import { radToDeg } from '@/lib/helpers/radToDeg.js'

import SvgIcon from '@/components/SvgIcon.jsx'
import Feature from './Feature.jsx'

import Length from './Length.jsx'
import DimensionsLines from './DimensionLines.jsx'

import { t, h } from './const.js'

import { isWithinRange } from '@/lib/helpers/isWithinRange.js'

const noop = () => {}

// component takes in 4 points, which are used for creating the walls

export default function Wall({
  id,
  from,
  to,
  prev,
  next,
  is3D,
  line,
  color,
  hover,
  onHover = noop,
  onDragStart = noop,
  onDrag = noop,
  onDragEnd = noop,
  onResize = noop,
  features,
  insertPoint,
  highlightWalls,
  showMeasurementLines
}) {
  const wall = useRef()

  const [dragging, setDragging] = useState(false)
  const [pointerPosition, setPosition] = useState()
  let showHandle = (hover && hover === wall.current) || dragging

  const handleRef = useRef()

  // Wall geometry
  const len = Math.sqrt((to.z - from.z) ** 2 + (to.x - from.x) ** 2) // opp and adj
  const angle = Math.atan2(to.z - from.z, to.x - from.x)
  const pos = [(from.x + to.x) / 2, h, (from.z + to.z) / 2]
  const wallNormal = new Vector3(Math.sin(angle), 0, -Math.cos(angle))

  // console.log(angle)

  // Mitre geometry
  const anglePrev = Math.atan2(from.z - prev.z, from.x - prev.x)
  const angleNext = Math.atan2(next.z - to.z, next.x - to.x)
  const mitreStart = (angle - anglePrev) / 2
  const mitreEnd = (angleNext - angle) / 2

  const clamp = (t) => (Math.abs(t) < 3.5 ? t : 0)
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

  const isInRange = checkAngle(angle)

  // Drag state
  const { handle, matrix } = useMemo(() => {
    const handle = pointerPosition || pos.slice()
    handle[1] = h + 0.1
    const matrix = new Matrix4()
    return { handle, matrix }
  }, [showHandle, dragging, pointerPosition])

  return (
    <>
      <group
        name='wall'
        position={pos}
        rotation-x={Math.PI * 0.5}
        rotation-z={angle}
      >
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[shape, { depth: h, bevelEnabled: false }]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* {!is3D && line && (
          <Length
            offset={0.3}
            end={[len / 2 - (t * Math.tan(mitreEnd)) / 2, t / -2]}
            start={[len / -2 + (t * Math.tan(mitreStart)) / 2, t / -2]}
            color='black'
          />
        )} */}
        {/* {!is3D && isNinetyDegrees && ( */}
        {!is3D && (
          <DimensionsLines
            angle={angle}
            offset={-0.3}
            end={[len / 2 - (t * Math.tan(mitreEnd)) / 2, t / -2]} // inside length
            start={[len / -2 + (t * Math.tan(mitreStart)) / 2, t / -2]}
            color='#6B6B6B'
            onChange={(dl) => onResize(id, dl)}
          />
        )}
        {features &&
          features.map((detail, i) => (
            <Feature
              key={i}
              {...detail}
              onHover={onHover}
              anchor={len * detail.offset - len / 2}
              color='#6B6B6B'
            />
          ))}
      </group>
      <mesh
        position={pos}
        rotation-y={-angle}
        ref={wall}
        onPointerOver={(ev) => {
          onHover(ev, true)
          highlightWalls(id, 'wall')
        }}
        onPointerOut={(ev) => {
          onHover(ev, false)
          highlightWalls(null, 'wall')
        }}
        onPointerMove={trackMousePosition}
      >
        <boxGeometry args={[len - t * 3, 0.001, t * 2]} />
        <meshNormalMaterial transparent opacity={0} />
      </mesh>

      {showHandle && !is3D && (
        <DragControls
          autoTransform={false}
          matrix={matrix}
          onDoubleClick={(ev) => {
            if (ev.delta !== 0 && ev.delta !== 1) return
            insertPoint(id, pointerPosition[0], pointerPosition[2])
          }}
          onDragStart={() => {
            setDragging(true)
            onDragStart()
            showMeasurementLines(id, 'wall')
          }}
          onDrag={moveHandle}
          onDragEnd={() => {
            setDragging(false)
            onDragEnd()
            showMeasurementLines(null, 'wall')
            const { x, z } = handleRef.current.getWorldPosition(new Vector3())
            setPosition([x, h + 0.1, z])
          }}
        >
          <group position={handle} rotation-y={-angle} ref={handleRef}>
            <mesh>
              <boxGeometry args={[t * 2, 0, t * 2]} />
              <meshStandardMaterial color='green' transparent opacity={0} />
            </mesh>
            <group position-z='-0.075'>
              <Html
                center
                as='div'
                position-y='-10'
                className='pointer-events-none'
              >
                <div
                  className='flex items-center justify-center'
                  style={{
                    transform: `rotateZ(${angle + 1.5708}rad) translateX(-80%)`
                  }}
                >
                  <SvgIcon
                    shape='wall-handle-stroke-left'
                    classes=' scale-125'
                  />
                </div>
              </Html>
            </group>
            <group position-z='0.075'>
              <Html
                center
                as='div'
                position-y='-10'
                className='pointer-events-none'
              >
                <div
                  className='flex items-center justify-center'
                  style={{
                    transform: `rotateZ(${angle + 1.5708}rad) translateX(80%)`
                  }}
                >
                  <SvgIcon
                    shape='wall-handle-stroke-right'
                    classes=' scale-125'
                  />
                </div>
              </Html>
            </group>
          </group>
        </DragControls>
      )}
    </>
  )

  /**
   * Callback for drag controls. Derives the relative movement from the start
   * of the drag and notifies the parent of the delta (dx & dz).
   * @param {Matrix4} lm    Local transformation matrix
   */
  function moveHandle(lm) {
    const v = new Vector3()
    v.setFromMatrixPosition(lm) // tranlation part of the matrix
    let { x: dx, z: dz } = v.projectOnVector(wallNormal)
    onDrag({ id, dx, dz })
    matrix.copy(lm)
  }

  /**
   * Callback for mouse move whilst over the wall. Projects the pointer position
   * onto the mid-line of the wall and saves that as a request for drag handle
   * position.
   * @param {*} ev   - Pointer event info
   * @returns {void}
   */
  function trackMousePosition(ev) {
    if (dragging) return
    // Vector from the beginning of the wall to where the mouse is
    const pointer = new Vector3(ev.point.x - from.x, 0, ev.point.z - from.z)
    // Vector from the start to the end of the wal
    const wallItself = new Vector3(to.x - from.x, 0, to.z - from.z)
    // project first vector onto the second which tells me where a perpendicular line from the wall intersects where the mouse is
    // So i get a distance along the wall in the direction of the wall.
    const pt = pointer.projectOnVector(wallItself)
    // I can then map that into world coordinates and setPosition of the handle
    setPosition([pt.x + from.x, h + 0.1, pt.z + from.z])
  }

  /**
   * Check that angle of wall is 90 degrees.
   */

  // function checkAngle(angle) {
  //   angle = equalizeAngle(angle)

  //   if (isWithinRange(angle, 0.0) || isWithinRange(angle, Math.PI / 2)) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  function checkAngle(angle) {
    angle = equalizeAngle(angle)

    if (isWithinRange(angle, Math.PI / 4)) {
      return true
    } else {
      return false
    }
  }

  function equalizeAngle(angle) {
    const piOver2 = Math.PI / 2 // π/2 in radians

    // Check if the angle is a multiple of π/2
    if (angle % piOver2 === 0) {
      return piOver2 // Set to π/2
    }
    return angle // Return the angle unchanged if not a multiple of π/2
  }
}
