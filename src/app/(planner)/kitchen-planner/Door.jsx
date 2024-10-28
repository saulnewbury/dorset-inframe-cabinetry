import { BufferGeometry, Path } from 'three'
import { t, h } from './const'

/**
 * Component to display the symbol for a door, in 'plan' view.
 * @param {{
 *   open: 'left' | 'right'
 *   facing: 'out' | 'in'
 *   at: number
 *   length: number
 * }}
 */
export default function Door({ open, facing, at, length }) {
  const buffer = new BufferGeometry()
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
  buffer.setFromPoints(shape.getPoints())

  // The symbol for the door consists of a (blue) opening overlaid with a
  // triangle/arc shape that shows which way the door opens.

  return (
    <group
      position={[at - length / 2, depth + 0.05, 0]}
      rotation-x={Math.PI / -2}
    >
      <mesh position={[length / 2, 0, -0.01]}>
        <planeGeometry args={[length, thick]} />
        <meshBasicMaterial color={0x049ef4} />
      </mesh>
      <line geometry={buffer}>
        <lineBasicMaterial args={[{ color: 0, linewidth: 1 }]} />
      </line>
    </group>
  )
}
