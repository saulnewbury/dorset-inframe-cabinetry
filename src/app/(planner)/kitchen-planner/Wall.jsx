import { useMemo, useRef, useState, useContext, useEffect } from 'react'
import { Matrix4, Shape, Vector2, Vector3 } from 'three'
import { DragControls } from '@react-three/drei'
import { radToDeg } from '@/lib/helpers/radToDeg.js'

import Length from './Length.jsx'
import DimensionsLines from './DimensionLines.jsx'

import { PerspectiveContext } from '@/app/context.js'

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
  line,
  color,
  hover,
  onHover = noop,
  onDragStart = noop,
  onDrag = noop,
  onDragEnd = noop,
  highlightWalls,
  showMeasurementLines
}) {
  const wrap = (id) => (id + points.length) % points.length

  const wall = useRef()

  // console.log(isDup)
  const { view } = useContext(PerspectiveContext)
  const [dragging, setDragging] = useState(false)
  const [pointerPosition, setPosition] = useState()
  const showHandle = (hover && hover === wall.current) || dragging
  const handleRef = useRef()

  // Wall geometry
  const len = Math.sqrt((to.z - from.z) ** 2 + (to.x - from.x) ** 2) // opp and adj
  const angle = Math.atan2(to.z - from.z, to.x - from.x)
  const pos = [(from.x + to.x) / 2, h, (from.z + to.z) / 2]
  const wallNormal = new Vector3(Math.sin(angle), 0, -Math.cos(angle))

  // Mitre geometry
  const angleNext = Math.atan2(next.z - to.z, next.x - to.x)
  const anglePrev = Math.atan2(from.z - prev.z, from.x - prev.x)
  const mitreEnd = (angleNext - angle) / 2
  const mitreStart = (angle - anglePrev) / 2

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

  const isNinetyDegrees = checkAngle(angle)

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
        <mesh>
          <extrudeGeometry args={[shape, { depth: 1, bevelEnabled: false }]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* {view === '2d' && line && (
          <Length
            offset={0.3}
            end={[len / 2 - (t * Math.tan(mitreEnd)) / 2, t / -2]}
            start={[len / -2 + (t * Math.tan(mitreStart)) / 2, t / -2]}
            color='black'
          />
        )} */}
        {/* {view === '2d' && isNinetyDegrees && ( */}
        {view === '2d' && (
          <DimensionsLines
            moveHandle={() => onDrag({ id: wrap(id - 1), x, z })}
            angle={angle}
            offset={-0.3}
            end={[len / 2 - (t * Math.tan(mitreEnd)) / 2, t / -2]} // inside length
            start={[len / -2 + (t * Math.tan(mitreStart)) / 2, t / -2]}
            color='#6B6B6B'
          />
        )}
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
        <boxGeometry args={[len - t * 4, 0.001, t * 2]} />
        <meshNormalMaterial transparent opacity={0} />
      </mesh>

      {showHandle && view === '2d' && (
        <DragControls
          autoTransform={false}
          matrix={matrix}
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
          <mesh position={handle} ref={handleRef}>
            <boxGeometry args={[t * 2, 0, t * 2]} />
            <meshStandardMaterial color='green' transparent opacity={0.5} />
          </mesh>
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
    v.setFromMatrixPosition(lm)
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
    const pointer = new Vector3(ev.point.x - from.x, 0, ev.point.z - from.z)
    const wallItself = new Vector3(to.x - from.x, 0, to.z - from.z)
    const pt = pointer.projectOnVector(wallItself)
    setPosition([pt.x + from.x, h + 0.1, pt.z + from.z])
  }

  /**
   * Check that angle of wall is 90 degrees.
   */

  function checkAngle(angle) {
    angle = equalizeAngle(angle)

    if (isWithinRange(angle, 0.0) || isWithinRange(angle, Math.PI / 2)) {
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
