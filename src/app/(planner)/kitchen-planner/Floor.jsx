'use client'
import { useMemo, useContext } from 'react'
import { DoubleSide, Shape, Vector2 } from 'three'

// Components
import FloorLines from './FloorLines'
import FloorCheckers from './FloorCheckers'

// App state
import { useAppState } from '@/appState'
import { ModelContext } from '@/model/context'
import { initialState } from '@/model/appModel'

export default function Floor({ points, handlePan }) {
  const [model] = useContext(ModelContext)
  const { is3D } = useAppState()

  // Shape for floor
  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  const floor = model.floor || initialState.floor

  const { patterns, id } = floor

  // Directly access the pattern by index
  const pattern = patterns[id] || patterns[0]

  const colorA = pattern.color[0] || '#EEEEEE'
  const colorB = pattern.color[1] || '#000000'
  const type = pattern.svgProps.shape

  // console.log('Floor rendering pattern:', type, 'Colors:', colorA, colorB)

  return (
    <>
      {/* 3D floor */}
      {is3D && type === 'none' && (
        <FloorLines
          points={points}
          handlePan={handlePan}
          showHorizontalLines={true}
          color={colorA}
        />
      )}
      {is3D && type === 'horizontal-lines' && (
        <FloorLines
          points={points}
          handlePan={handlePan}
          showHorizontalLines={true}
          color={colorA}
        />
      )}
      {is3D && type === 'vertical-lines' && (
        <FloorLines
          points={points}
          handlePan={handlePan}
          showVerticalLines={true}
          color={colorA}
        />
      )}
      {is3D && type === 'grid' && (
        <FloorLines
          points={points}
          handlePan={handlePan}
          showHorizontalLines={true}
          showVerticalLines={true}
          color={colorA}
        />
      )}
      {is3D && type === 'checkers' && (
        <FloorCheckers
          points={points}
          handlePan={handlePan}
          colorA={colorA}
          colorB={colorB}
          key={`${colorA}-${colorB}`} // Force re-render on color change
        />
      )}

      {/* 2D floor */}
      {!is3D && (
        <mesh
          receiveShadow
          rotation-x={Math.PI / 2}
          onPointerOver={() => handlePan(true)}
          onPointerOut={() => handlePan(false)}
        >
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial side={DoubleSide} color="white" />
        </mesh>
      )}
    </>
  )
}
