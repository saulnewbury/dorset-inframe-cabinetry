'use client'
import { useEffect, useContext } from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { PerspectiveContext } from '@/app/context.js'

import Shape from './Shape'

export default function Experience() {
  const { view } = useContext(PerspectiveContext)

  useEffect(() => {
    console.log(view)
  }, [view])
  return (
    <>
      {/* Logic elements */}
      <OrbitControls enableRotate={view === '2d' ? false : true} />
      <axesHelper />

      {/* Environment elements */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* Scene */}
      <Shape />

      {/* Floor */}
      {/* <mesh rotation-x={view === '3d' ? Math.PI * 0.5 : 0}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color='lightblue' side={THREE.DoubleSide} />
      </mesh> */}
    </>
  )
}

// Drei: seCursor
