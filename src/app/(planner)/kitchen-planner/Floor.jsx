'use client'
import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'

import { t } from '@/app/(planner)/kitchen-planner/const.js'
import {
  DoubleSide,
  RepeatWrapping,
  Shape,
  TextureLoader,
  Vector2
} from 'three'

// import woodFloor from './textures/shutterstock_2408341353.png'
// import tileFloor from './textures/shutterstock_754494433.jpg'

export default function Floor({ points }) {
  // const colourMap = useLoader(TextureLoader, tileFloor)
  const shape = new Shape(points.map((p) => new Vector2(p.x, p.z)))
  shape.closePath()

  // colourMap.wrapS = colourMap.wrapT = RepeatWrapping
  // colourMap.repeat.set(0.1, 0.1)

  return (
    <mesh rotation-x={Math.PI / 2}>
      <shapeGeometry args={[shape]} />
      {/* <meshStandardMaterial map={colourMap} side={DoubleSide} /> */}
      <meshStandardMaterial
        color='lightblue'
        transparent
        opacity={0.3}
        side={DoubleSide}
      />
    </mesh>
  )
}
