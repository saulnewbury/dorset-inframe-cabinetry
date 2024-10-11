'use client'
import * as THREE from 'three'
import { DragControls, useCursor } from '@react-three/drei'
import { useRef, useState, useMemo, useEffect } from 'react'

export default function Corner({
  params,
  t,
  h,
  handleDrag,
  dragging,
  toggleHandle,
  showHandle,
  startPosition
}) {
  const { x, z } = useMemo(() => ({ x: params.x, z: params.z }), [showHandle])

  const { id } = params
  const handle = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const cc = document.querySelector('.canvas-container')

  useEffect(() => {
    cc.style.cursor = hovered ? 'none' : 'default'
    return () => {
      cc.style.cursor = 'default'
    }
  }, [hovered])

  return (
    <DragControls
      onDragStart={() => {
        const { x, z } = handle.current.getWorldPosition(new THREE.Vector3())
        dragging()
        startPosition(x, z)
      }}
      onDragEnd={() => {
        dragging()
      }}
      onDrag={() => {
        const { x, z } = handle.current.getWorldPosition(new THREE.Vector3())
        handleDrag(id, x, z)
      }}
    >
      <mesh
        position={[x, h + 0.3, z]}
        ref={handle}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false)
          toggleHandle()
        }}
      >
        <boxGeometry args={[t * 2, 0, t * 2]} />
        <meshStandardMaterial color='green' transparent opacity={0.3} />
      </mesh>
    </DragControls>
  )
}
