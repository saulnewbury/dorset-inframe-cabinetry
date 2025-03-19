import { DragControls, Html } from '@react-three/drei'
import { useContext, useMemo, useRef, useState } from 'react'
import { Matrix4, Shape, Vector3 } from 'three'

import { AppContext } from '@/context'
import { ModelContext } from '@/model/context'

import { wt, wh } from '@/const'

import DimensionLine from './DimensionLine'
import Opening from './openings/Opening'

import { hoverMaterial } from '@/materials'

// Image for drag handle:
import wallHandleLeft from '@/assets/icons/wall-handle-stroke-left.svg'
import wallHandleRight from '@/assets/icons/wall-handle-stroke-right.svg'

/**
 * Component to paint a 3D wall, with openings. Note that the latter go full
 * height: if a lintel or other wall sections are needed then the 'Opening'
 * component will render them.
 */
export default function Wall({
  from,
  to,
  next,
  prev,
  hover,
  onHover = () => {},
  onDrag = () => {}
}) {
  const is3D = useContext(AppContext)
  const [model, dispatch] = useContext(ModelContext)
  const [dragging, setDragging] = useState(false)
  const [pointerPosition, setPosition] = useState(null)
  const point = useRef(null)
  const openings = useMemo(
    () =>
      model.openings
        .filter((op) => op.wall === from.id)
        .sort((a, b) => a.offset - b.offset),
    [model]
  )

  const showHandle = !is3D && hover?.type === 'wall' && hover.id === from.id
  const highlight =
    !is3D &&
    ((hover?.type === 'wall' && hover.id === from.id) ||
      (hover?.type === 'corner' &&
        (hover.id === from.id || hover.id === to.id)))

  const [handlePos, matrix, origin] = useMemo(
    () => [
      dragging ? pointerPosition?.slice() : null,
      new Matrix4(),
      { ...from, y: 0 }
    ],
    [dragging]
  )

  // Wall geometry
  const pos = new Vector3((from.x + to.x) / 2, 0, (from.z + to.z) / 2)
  const angle = Math.atan2(to.z - from.z, to.x - from.x)
  const len = Math.sqrt((to.z - from.z) ** 2 + (to.x - from.x) ** 2)
  const wallNormal = new Vector3(Math.sin(angle), 0, -Math.cos(angle))

  // Mitre geometry
  const angleNext = next ? Math.atan2(next.z - to.z, next.x - to.x) : angle
  const anglePrev = prev ? Math.atan2(from.z - prev.z, from.x - prev.x) : angle
  const mitreEnd = (angleNext - angle) / 2
  const mitreStart = (angle - anglePrev) / 2

  const innerLength =
    len - (wt * (Math.tan(mitreEnd) + Math.tan(mitreStart))) / 2
  const clamp = (t) => (Math.abs(t) < 3 ? t : 0)
  const te = wt * clamp(Math.tan(mitreEnd))
  const ts = wt * clamp(Math.tan(mitreStart))

  // Base shape for the wall footprint. This is an array of wall segments
  // with 'square end' holes between them for the various openings.
  const base = useMemo(() => {
    const shapes = []
    let ms = ts / 2
    let left = len / -2
    if (is3D) {
      for (const op of openings) {
        const offset = op.offset - (op.width + len) / 2
        shapes.push(
          new Shape()
            .moveTo(left + ms, -wt / 2)
            .lineTo(offset, -wt / 2)
            .lineTo(offset, wt / 2)
            .lineTo(left - ms, wt / 2)
            .closePath()
        )
        ms = 0
        left = offset + op.width
      }
    }
    shapes.push(
      new Shape()
        .moveTo(left + ms, -wt / 2)
        .lineTo((len - te) / 2, -wt / 2)
        .lineTo((len + te) / 2, wt / 2)
        .lineTo(left - ms, wt / 2)
        .closePath()
    )
    return shapes
  }, [len, ts, te, openings, is3D])

  return (
    <>
      <group name={'wall-' + from.id} position={pos} rotation-y={-angle}>
        {/* Hover target */}
        <mesh
          position={[0, wh + 0.01, 0]}
          rotation-x={Math.PI / -2}
          material={hoverMaterial}
          userData={{ type: 'wall', id: from.id }}
          onPointerOver={(ev) => onHover(ev, true)}
          onPointerOut={(ev) => onHover(ev, false)}
          onPointerMove={trackMousePosition}
          onDoubleClick={insertPoint}
        >
          <planeGeometry args={[len, wt * 2]} />
        </mesh>
        {/* Wall segments */}
        <mesh rotation-x={Math.PI / -2} castShadow receiveShadow>
          <extrudeGeometry args={[base, { depth: wh, bevelEnabled: false }]} />
          <meshStandardMaterial color={highlight ? '#8DB3FF' : '#C8C8C8'} />
        </mesh>
        {/* Openings */}
        {openings.map((op) => (
          <Opening
            key={op.id}
            {...op}
            len={len}
            mitre={{ ts, te }}
            hover={hover}
            onHover={onHover}
            onDrag={onDrag}
          />
        ))}
        {/* Dimension line (2D only) */}
        {!is3D && (
          <DimensionLine
            from={-len / 2 + (wt * Math.tan(mitreStart)) / 2}
            to={len / 2 - (wt * Math.tan(mitreEnd)) / 2}
            value={innerLength}
            isFlip={Math.abs(angle) > Math.PI / 2}
            onChange={resizeWall}
          />
        )}
      </group>
      {/* Drag handle */}
      {(showHandle || dragging) && (
        <DragControls
          autoTransform={false}
          matrix={matrix}
          onDragStart={beginDrag}
          onDragEnd={endDrag}
          onDrag={moveWall}
        >
          <group
            position={handlePos ?? pointerPosition ?? pos}
            rotation-y={-angle}
          >
            <mesh>
              <boxGeometry args={[wt * 2, 0, wt * 2]} />
              <meshStandardMaterial color='green' transparent opacity={0} />
            </mesh>
            <group position-z='-0.08'>
              <Html center as='div' className='pointer-events-none'>
                <div
                  className='flex items-center justify-center'
                  style={{
                    transform: `rotateZ(${angle + 1.5708}rad) translateX(-80%)`
                  }}
                >
                  <img
                    src={wallHandleLeft.src}
                    alt=''
                    className='scale-125 max-w-none'
                  />
                </div>
              </Html>
            </group>
            <group position-z='0.08'>
              <Html center as='div' className='pointer-events-none'>
                <div
                  className='flex items-center justify-center'
                  style={{
                    transform: `rotateZ(${angle + 1.5708}rad) translateX(80%)`
                  }}
                >
                  <img
                    src={wallHandleRight.src}
                    alt=''
                    className='scale-125 max-w-none'
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
   * Callback to handle pointer movement, over the wall (2D only). Gets the
   * position of the cursor 'along' the wall and saves it to position the drag
   * handle.
   */
  function trackMousePosition(ev) {
    if (is3D) return
    const pointer = new Vector3(ev.point.x - from.x, 0, ev.point.z - from.z)
    const wallItself = new Vector3(to.x - from.x, 0, to.z - from.z)
    const pt = pointer.projectOnVector(wallItself)
    setPosition([pt.x + from.x, wh + 0.1, pt.z + from.z])
  }

  /**
   * Callback for 'drag start' event. Records the origin of the drag to use in
   * calculating desired position during the drag operation.
   */
  function beginDrag() {
    onDrag(true) // lock hover
    setDragging(true)
    point.current = from
  }

  /**
   * Callback for 'drag end' event. Finalizes movement of the wall and resets
   * ready for next drag.
   */
  function endDrag() {
    onDrag(false) // unlock hover
    setDragging(false)
    dispatch({ id: 'moveWall', from: point.current, dragging: false })
    matrix.copy(new Matrix4())
    point.current = null
  }

  /**
   * Callback for 'drag' event. Calculates the new desired position of the wall
   * and updates the model.
   */
  function moveWall(lm) {
    const { x, z } = new Vector3()
      .setFromMatrixPosition(lm)
      .projectOnVector(wallNormal)
      .add(origin)
    point.current = { ...origin, x, z }
    dispatch({ id: 'moveWall', from: point.current, dragging: true })
    matrix.copy(lm)
  }

  /**
   * Callback for a 'click' event on the wall. Inserts a new vertex at the
   * indicated position.
   */
  function insertPoint(ev) {
    if (ev.delta > 1) return
    const [x, , z] = pointerPosition
    dispatch({ id: 'addPoint', from, at: { x, z } })
    onHover(null, 'force')
  }

  function resizeWall(len) {
    dispatch({
      id: 'resizeWall',
      from: { ...from },
      len: len + (wt * Math.tan(mitreStart)) / 2 + (wt * Math.tan(mitreEnd)) / 2
    })
  }
}
