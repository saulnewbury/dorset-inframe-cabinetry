'use client'

import { DragControls, useCursor } from '@react-three/drei'
import { useRef, useState, useMemo, useLayoutEffect, useContext } from 'react'
import { Matrix4, Vector3 } from 'three'
import { t, h } from './const.js'

import { PerspectiveContext } from '@/app/context.js'

export default function Corner({
  id,
  at,
  hover,
  onHover,
  onDrag,
  onDragEnd,
  onDragStart,
  createRadialGrid,
  highlightWalls,
  showMeasurementLines
}) {
  const corner = useRef()
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const showHandle = dragging || hovered || (hover && hover === corner.current)
  const pos = [at.x, h + 0.01, at.z]

  const { view } = useContext(PerspectiveContext)

  useCursor(hovered)

  const cc = document.querySelector('.canvas-container')

  // useLayoutEffect(() => {
  //   cc.style.cursor = hovered ? 'none' : 'default'
  //   return () => {
  //     cc.style.cursor = 'default'
  //   }
  // }, [hovered])

  const { handle, matrix } = useMemo(() => {
    const handle = pos.slice()
    handle[1] += 0.1
    const matrix = new Matrix4()
    return { handle, matrix }
  }, [showHandle, dragging])

  return (
    <>
      <mesh
        ref={corner}
        position={pos}
        onPointerOver={(ev) => {
          if (view !== '2d') return
          onHover(ev, true)
          setHovered(true)
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
          opacity={hovered && view === '2d' ? 0.3 : 0.0}
        />
      </mesh>
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
            onHover(true, corner.current)
            showMeasurementLines(null, 'corner')
            onDragEnd()
            createRadialGrid(null) // dev perposes only.
          }}
        >
          <mesh
            position={handle}
            onPointerOut={() => {
              setHovered(false)
            }}
          >
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
