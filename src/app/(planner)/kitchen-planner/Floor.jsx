'use client'
import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import {
  DoubleSide,
  Shape,
  Vector2,
  LineBasicMaterial,
  BufferGeometry,
  Vector3
} from 'three'

// Components
import FloorLines from './FloorLines'
import FloorCheckers from './FloorCheckers'

// App state
import { useAppState } from '@/appState'

export default function Floor({ points, handlePan }) {
  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  const { is3D } = useAppState()
  return (
    <>
      <FloorLines
        points={points}
        handlePan={handlePan}
        // showHorizontalLines={true}
        // showVerticalLines={true}
      />
      <FloorCheckers points={points} handlePan={handlePan} />

      {!is3D && (
        <mesh
          receiveShadow
          rotation-x={Math.PI / 2}
          onPointerOver={() => handlePan(true)}
          onPointerOut={() => handlePan(false)}
        >
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial side={DoubleSide} color='white' />
        </mesh>
      )}
    </>
  )
}
