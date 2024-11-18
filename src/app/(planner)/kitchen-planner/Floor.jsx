'use client'
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'

import {
  DoubleSide,
  RepeatWrapping,
  Shape,
  TextureLoader,
  Vector2
} from 'three'

// import woodFloor from './textures/shutterstock_2408341353.png'
import tileFloor from '@/assets/textures/shutterstock_754494433.jpg'

export default function Floor({ points, handlePan }) {
  const colourMap = useMemo(() => {
    const texture = useLoader(TextureLoader, tileFloor.src)
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(0.5, 0.5)
    return texture
  }, [])
  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  return (
    <mesh
      receiveShadow
      rotation-x={Math.PI / 2}
      onPointerOver={() => handlePan(true)}
      onPointerOut={() => handlePan(false)}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial map={colourMap} side={DoubleSide} />
      {/* <meshStandardMaterial color='#ffffff' side={DoubleSide} /> */}
    </mesh>
  )
}
