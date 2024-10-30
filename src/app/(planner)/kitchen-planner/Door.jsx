import { BufferGeometry, Path, Matrix4, Vector3, Euler } from 'three'
import { DragControls } from '@react-three/drei'
import { useMemo, useState, useRef } from 'react'

import { t, h } from './const'

/**
 * Component to display the symbol for a door, in 'plan' view.
 */

export default function Door({ open, facing, at, length, color, onHover }) {
  // const [pointerPosition, setPosition] = useState()
  const buffer = new BufferGeometry()
  const shape = new Path()
  const angle = Math.PI / (facing === 'out' ? 4 : -4)

  const dragControls = useRef()

  const cc = document.querySelector('.canvas-container')
  // The side on which the door 'opens' is as viewed from the inside of the
  // room - therefore 'right' also equals 'end'.

  if (open === 'right') {
    shape
      .moveTo(length * Math.cos(angle), length * Math.sin(angle))
      .lineTo(0, 0)
      .lineTo(length, 0)
      .absarc(0, 0, length, 0, angle * 1.5, facing === 'in')
  } else {
    shape
      .moveTo(length * (1 - Math.cos(angle)), length * Math.sin(angle))
      .lineTo(length, 0)
      .lineTo(0, 0)
      .absarc(
        length,
        0,
        length,
        -Math.PI,
        -angle * 1.5 - Math.PI,
        facing === 'out'
      )
  }
  buffer.setFromPoints(shape.getPoints())

  // The symbol for the door consists of a (blue) opening overlaid with a
  // triangle/arc shape that shows which way the door opens.

  // Drag state
  const { matrix, feature } = useMemo(() => {
    // const feature = pointerPosition || pos.slice()
    // handle[1] = h + 0.1
    const matrix = new Matrix4()
    return { matrix }
  }, [])

  return (
    <DragControls
      matrix={matrix}
      autoTransform='false'
      onDrag={moveFeature}
      ref={dragControls}
    >
      <group rotation-x={Math.PI} position-z={-0.1} position-x={-length / 2}>
        <mesh position={[length / 2, 0, -0.01]}>
          <planeGeometry args={[length, t]} />
          <meshBasicMaterial color={0xaaaaff} />
        </mesh>
        <mesh
          position={[length / 2, 0, -0.01]}
          onPointerOver={(ev) => {
            onHover(ev, true)
            cc.style.cursor = 'pointer'
          }}
          onPointerOut={(ev) => {
            onHover(ev, false)
            cc.style.cursor = 'default'
          }}
          // onPointerMove={trackMousePosition}
        >
          <planeGeometry args={[length, t * 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <line geometry={buffer}>
          <lineBasicMaterial
            args={[{ color: (color = '#6B6B6B'), linewidth: 1 }]}
          />
        </line>
      </group>
    </DragControls>
  )

  function moveFeature(lm, dlm, wm) {
    // const { z } = dragControls.current.parent.rotation
    // const rM = new Matrix4()
    // rM.makeRotationZ(-z + Math.PI / 2)
    // lm.multiply(rM)
    // matrix.copy(lm)
    // ask the wall what its rotation is
  }

  function trackMousePosition(ev) {
    //  if (dragging) return
    // const pointer = new Vector3(ev.point.x - from.x, 0, ev.point.z - from.z)
    // const windowItself = new Vector3(to.x - from.x, 0, to.z - from.z)
    // const pt = pointer.projectOnVector(windowItself)
    // setPosition([pt.x + from.x, h + 0.1, pt.z + from.z])
  }
}
