import { useState, forwardRef, useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { DragControls, useCursor } from '@react-three/drei'

export default forwardRef(function Handle(
  { t, x, z, angle, handleDrag, dragEnd },
  handle
) {
  const [hovered, setHovered] = useState(false)
  const [mousedown, setMousedown] = useState(false)
  useCursor(hovered)

  const cc = document.querySelector('.canvas-container')

  useLayoutEffect(() => {
    cc.style.cursor = hovered || mousedown ? 'none' : 'default'
    return () => {
      cc.style.cursor = 'default'
    }
  }, [hovered, mousedown])

  return (
    <DragControls
      autoTransform={hovered || mousedown}
      onDrag={() => {
        handleDrag()
      }}
      onDragEnd={() => {
        setMousedown(false)
        dragEnd()
      }}
    >
      <group position={[x, 1.5 + 0.05, z]}>
        <group rotation-y={angle}>
          <group position={[0 - t / 2, 2 + 0.05, 0 + t / 2]}>
            <mesh
              rotation-y={-angle}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onPointerDown={() => setMousedown(true)}
            >
              <boxGeometry args={[t * 1.5, t * 1.5, t * 1.5]} />
              <meshStandardMaterial
                color='orange'
                side={THREE.DoubleSide}
                transparent
                opacity={hovered || mousedown ? 1.0 : 0.0}
              />
            </mesh>
          </group>
          <mesh ref={handle}>
            <boxGeometry args={[t * 2, 0, t * 2]} />
            <meshStandardMaterial color='green' wireframe />
          </mesh>
        </group>
      </group>
    </DragControls>
  )
})
