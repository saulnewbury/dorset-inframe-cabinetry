import { BufferGeometry, Path, Matrix4, Vector3, MathUtils } from 'three'
import { DragControls } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'

import { t, h } from './const'

/**
 * Component to display the symbol for a door, in 'plan' view.
 */

export default function Door({
  open,
  facing,
  at,
  max,
  length,
  color,
  onHover,
  onMoved = () => {}
}) {
  const [matrix, setMatrix] = useState(new Matrix4())
  const drag = useRef()
  const spaceBefore = max / 2 + at - length / 2
  const spaceAfter = max / 2 - at - length / 2

  const cc = document.querySelector('.canvas-container')

  const buffer = useMemo(() => {
    const b = new BufferGeometry()
    const shape = new Path()
    const angle = Math.PI / (facing === 'out' ? 4 : -4)
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
    b.setFromPoints(shape.getPoints())
    return b
  }, [length, open, facing])

  // The symbol for the door consists of a (blue) opening overlaid with a
  // triangle/arc shape that shows which way the door opens.

  return (
    <DragControls
      autoTransform={false}
      matrix={matrix}
      onDrag={moveFeature}
      onDragEnd={endDrag}
      ref={drag}
    >
      <group
        rotation-x={Math.PI}
        position-z={-0.1}
        position-x={at - length / 2}
      >
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

  /**
   * Called during drag, whenever the pointer position changes. Maps the pointer
   * movement to 'wall' local coordinate space by reversing the wall's rotation,
   * then clamps movement to just the 'x' direction and limits movement so that
   * the door stays within the length of the wall.
   */

  function moveFeature(lm) {
    const v = new Vector3().setFromMatrixPosition(lm)
    const r = new Matrix4()
      .extractRotation(drag.current.parent.matrixWorld)
      .invert()
    v.applyMatrix4(r)
    v.y = v.z = 0
    v.x = MathUtils.clamp(v.x, -spaceBefore, spaceAfter)
    // console.log(v.x)
    matrix.setPosition(v)
  }

  /**
   * Called at the end of the drag process (on pointer up). Sends the new
   * offset of the door up to the parent (wall) to update the 'at' property.
   * Also resets the drag matrix, in anticipation of this change.
   */

  function endDrag() {
    const v = new Vector3().setFromMatrixPosition(matrix)
    onMoved(at + v.x)
    setMatrix(new Matrix4())
  }
}
