'use client'

import { DragControls, useCursor, Html } from '@react-three/drei'
import { useRef, useState, useMemo, useContext } from 'react'
import { Matrix4, Vector3 } from 'three'
import { t, h } from './const.js'

import SvgIcon from '@/components/SvgIcon.jsx'

import { PerspectiveContext } from '@/app/context.js'

export default function Corner({
  id,
  at,
  next,
  post,
  prev,
  pro,
  hover,
  onHover,
  onDrag,
  onDragEnd,
  onDragStart,
  createRadialGrid,
  highlightWalls,
  showMeasurementLines,
  removeRedundantPoints
}) {
  const corner = useRef()
  const [dragging, setDragging] = useState(false)
  const hovered = hover && hover === corner.current
  const showHandle = dragging || hovered

  const pos = [at.x, h + 0.01, at.z]

  const { view } = useContext(PerspectiveContext)

  useCursor(hovered)

  const cc = document.querySelector('.canvas-container')

  const { handle, matrix } = useMemo(() => {
    const handle = pos.slice()
    handle[1] += 0.1
    const matrix = new Matrix4()
    return { handle, matrix }
  }, [showHandle, dragging])

  return (
    <>
      <group>
        <mesh
          ref={corner}
          position={pos}
          onPointerOver={(ev) => {
            if (view !== '2d') return
            onHover(ev, true)
            highlightWalls(id, 'corner')
            cc.style.cursor = 'none'
          }}
          onPointerOut={(ev) => {
            if (view !== '2d') return
            onHover(ev, false)
            highlightWalls(null, 'corner')
            cc.style.cursor = 'default'
          }}
        >
          <boxGeometry args={[t * 2, 0, t * 2]} />
          <meshStandardMaterial
            color='blue'
            transparent
            // opacity={hovered && view === '2d' ? 0.3 : 0.0}
            opacity={0.0}
          />
        </mesh>
        {showHandle && view === '2d' && (
          <Html position={pos} center className='pointer-events-none'>
            <SvgIcon shape='corner-handle' classes='scale-125' />
          </Html>
        )}
      </group>
      {showHandle && view === '2d' && (
        <DragControls
          matrix={matrix}
          autoTransform={false}
          onDragStart={() => {
            setDragging(true)
            showMeasurementLines(id, 'corner')
            onDragStart()
            createRadialGrid(id) // dev perposes only.
          }}
          onDrag={moveCorner}
          onDragEnd={() => {
            setDragging(false)
            showMeasurementLines(null, 'corner')
            onDragEnd()
            removeRedundantPoints(id, at, next, post, prev, pro)
            createRadialGrid(null) // dev perposes only.
          }}
        >
          <mesh position={handle}>
            <boxGeometry args={[t * 2, 0, t * 2]} />
            <meshStandardMaterial color='green' transparent opacity={0} />
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

  function moveCorner(lm) {
    const v = new Vector3()
    v.setFromMatrixPosition(lm)
    onDrag({ id, dx: v.x, dz: v.z })
    matrix.copy(lm)
  }
}
