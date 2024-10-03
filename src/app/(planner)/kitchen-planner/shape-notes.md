```
'use client'
import * as THREE from 'three'
import { useContext } from 'react'
import { PerspectiveContext } from '@/app/context'

export default function Shape({ walls = [{ l: 3, o: 0.1, a: 45, b: 45 }] }) {
  const { view } = useContext(PerspectiveContext)

  const shape = new THREE.Shape()
  // outer
  // shape.moveTo(0 - o, 0 - o) // diagonal (out)
  // shape.lineTo(0 - o, w + o) // up (left)
  // shape.lineTo(l + o, w + o) // rigt (top)
  // shape.lineTo(l + o, 0 - o) // down (right)
  // shape.lineTo(0 - o, 0 - o) // left (bottom)

  // Wall
  for (let i = 0; i < walls.length; i++) {
    const { l, o, a, b } = walls[i]
    shape.moveTo(0, 0) // start
    shape.lineTo(l, 0) // down (right)
    shape.lineTo(l, 0 - o) // down (right)
    shape.lineTo(0, 0 - o)
  }

  // shape.lineTo(l, w) // rigt (top)
  // shape.lineTo(0, w) // up (left)
  // shape.lineTo(0, 0) // diagonal

  const extrudeSettings = {
    steps: 2,
    depth: 0.001,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
  }
  return (
    <>
      {/* walls */}
      <group rotation-x={view === '3d' ? -Math.PI * 0.5 : 0}>
        <mesh scale={1} position={[-1.5, -1.5, 0.01]}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial color='red' side={THREE.DoubleSide} />
        </mesh>
        {/* floor */}
        <mesh position-z={-0.99}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color='lightblue' side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  )
}
```

const l = 3,
w = 3,
o = 0.1
const shape = new THREE.Shape()
// outer
shape.moveTo(0 - o, 0 - o) // diagonal (out)
shape.lineTo(0 - o, w + o) // up (left)
shape.lineTo(l + o, w + o) // rigt (top)
shape.lineTo(l + o, 0 - o) // down (right)
shape.lineTo(0 - o, 0 - o) // left (bottom)

// inner
shape.lineTo(0, 0) // start
shape.lineTo(l, 0) // down (right)
shape.lineTo(l, w) // rigt (top)
shape.lineTo(0, w) // up (left)
shape.lineTo(0, 0) // diagonal
