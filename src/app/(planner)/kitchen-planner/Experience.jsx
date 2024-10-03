'use client'
import { useContext } from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

import { PerspectiveContext } from '@/app/context.js'

import FloorPlan from './FloorPlan.jsx'

export default function Experience() {
  const { view } = useContext(PerspectiveContext)

  return (
    <>
      {/* Logic elements */}
      <OrbitControls enableRotate={view === '2d' ? false : true} />
      <axesHelper />

      {/* Environment elements */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* Scene */}
      <FloorPlan />

      {/* Floor */}
      <mesh rotation-x={view === '3d' ? Math.PI * 0.5 : 0}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color='lightblue' side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// Drei: seCursor
