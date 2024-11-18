import { useContext, useMemo, useRef, useState } from 'react'
import { DragControls, Html } from '@react-three/drei'
import { Matrix4, Vector3 } from 'three'
import { intersection, radialIntersect } from '@/utils/mathutils'

import { ModelContext } from '@/model/context'

import { wt, wh } from '@/const'

// Image for drag handle:
import cornerHandle from '@/assets/icons/corner-handle-circle.svg'
import { hoverMaterial } from '@/materials'

/**
 * Renders a drag handle for a corner (vertex) between two walls. Dragging this
 * handle moves the corner.
 */
export default function Corner({
  at,
  prev,
  next,
  hover,
  onHover = () => {},
  onDrag = () => {}
}) {
  const [, dispatch] = useContext(ModelContext)
  const [dragging, setDragging] = useState(false)
  const showHandle = hover?.type === 'corner' && hover.id === at.id
  const point = useRef(null)

  const [matrix, origin] = useMemo(
    () => [new Matrix4(), { ...at, y: 0 }],
    [showHandle || dragging]
  )

  return (
    <>
      <mesh
        position={[at.x, wh + 0.02, at.z]}
        rotation-x={Math.PI / -2}
        material={hoverMaterial}
        userData={{ type: 'corner', id: at.id }}
        onPointerOver={(ev) => onHover(ev, true)}
        onPointerOut={(ev) => onHover(ev, false)}
      >
        <circleGeometry args={[wt * 0.8]} />
      </mesh>
      {(showHandle || dragging) && (
        <DragControls
          matrix={matrix}
          autoTransform={false}
          onDragStart={beginDrag}
          onDragEnd={endDrag}
          onDrag={moveCorner}
        >
          <group position={[at.x, wh + 0.05, at.z]}>
            <mesh rotation-x={Math.PI / -2}>
              <circleGeometry args={[wt]} />
              <meshStandardMaterial color='#4080bf' transparent opacity={0} />
            </mesh>
            <Html center className='pointer-events-none select-none'>
              <img
                src={cornerHandle.src}
                alt=''
                className='size-[26px] max-w-none'
                style={{ translate: '-1px 1px' }}
              />
            </Html>
          </group>
        </DragControls>
      )}
    </>
  )

  /**
   * Callback for 'drag start' event. Records the position of the corner, to be
   * used in calculating the new desired position during the drag.
   */
  function beginDrag() {
    onDrag(true) // lock hover
    setDragging(true)
    point.current = at
  }

  /**
   * Callback for 'drag end' event. Updates the model with the final position
   * of the corner, and resets ready for the next drag.
   */
  function endDrag() {
    onDrag(false) // unlock hover
    setDragging(false)
    dispatch({ id: 'moveCorner', to: point.current, dragging: false })
    point.current = null
  }

  /**
   * Callback for 'drag' event. Updates the model with the new desired position
   * of the corner.
   */
  function moveCorner(lm) {
    let pt = new Vector3().setFromMatrixPosition(lm).add(origin)

    const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
    const dsnap = 0.1

    const pp = radialIntersect(pt, prev)
    const pn = radialIntersect(pt, next)
    const is = intersection(prev, pp, next, pn)
    const dpp = dist(pt, pp)
    const dpn = dist(pt, pn)
    const dis = is ? dist(pt, is) : dsnap * 2

    if (dis < dsnap) pt = is
    else if (dpp < dsnap || dpn < dsnap) pt = dpp < dpn ? pp : pn

    point.current = { ...origin, x: pt.x, z: pt.z }
    dispatch({ id: 'moveCorner', to: point.current, dragging: true })
  }
}
