'use client'
import { useMemo } from 'react'
import { MeshStandardMaterial, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'

// Worktop texture:
import wtTexture from '@/assets/textures/iStock-1126970577.jpg'
import UnitFront from './UnitFront'

// Materials for parts of unit:
const carcassMaterial = new MeshStandardMaterial({ color: 'white' })
const footMaterial = new MeshStandardMaterial({ color: 'black' })

/**
 * Parametric component to render a base unit. The 'style' property defines left
 * and (optional) right options for door or drawers, separated by colon (:).
 */
export default function BaseUnit({
  height = 740,
  width = 600,
  depth = 540,
  style = ''
}) {
  const wtMap = useLoader(TextureLoader, wtTexture.src)
  const w = width / 1000
  const h = height / 1000
  const d = depth / 1000

  // Calculate positions of 'feet':
  const feet = useMemo(() => {
    const corners = [
      [0.05 - w / 2, 0.05, 0.05 - d / 2],
      [w / 2 - 0.05, 0.05, 0.05 - d / 2],
      [w / 2 - 0.05, 0.05, d / 2 - 0.05],
      [0.05 - w / 2, 0.05, d / 2 - 0.05]
    ]
    return w < 0.85
      ? corners
      : corners.concat([
          [0, 0.05, 0.05 - d / 2],
          [0, 0.05, d / 2 - 0.05]
        ])
  }, [w, d])

  const shelves = useMemo(() => {
    const dh = h - 0.04
    const heights = {
      door: [dh / 2],
      '2-drawer': [dh / 2],
      '3-drawer': [(3 * dh) / 8, (3 * dh) / 4],
      '4-drawer': [dh / 4, dh / 2, (3 * dh) / 4]
    }
    const s = []
    for (const opt of style.split(':')) {
      s.push(heights[opt]?.map((h) => h + 0.02) ?? [])
    }
    return s
  }, [style])

  return (
    <group>
      {/* Sides */}
      <mesh
        material={carcassMaterial}
        position={[0.005 - w / 2, h / 2 + 0.1, 0]}
      >
        <boxGeometry args={[0.01, h, d]} />
      </mesh>
      <mesh
        material={carcassMaterial}
        position={[w / 2 - 0.005, h / 2 + 0.1, 0]}
      >
        <boxGeometry args={[0.01, h, d]} />
      </mesh>
      {/* Base */}
      <mesh material={carcassMaterial} position={[0, 0.105, 0]}>
        <boxGeometry args={[w, 0.01, d]} />
      </mesh>
      {/* Shelf/shelves */}
      {shelves.map((side, s) => {
        const px = shelves.length > 1 ? [-w / 4, w / 4][s] : 0
        return side.map((y, n) => (
          <mesh
            key={['l-', 'r-'][s] + n}
            material={carcassMaterial}
            position={[px, y + 0.1, -0.05]}
          >
            <boxGeometry args={[w / shelves.length, 0.01, d - 0.1]} />
          </mesh>
        ))
      })}
      {/* Front brace */}
      <mesh
        material={carcassMaterial}
        position={[0, h + 0.1 - 0.005, d / 2 - 0.04]}
      >
        <boxGeometry args={[w, 0.01, 0.08]} />
      </mesh>
      {/* Rear brace */}
      <mesh
        material={carcassMaterial}
        position={[0, h + 0.1 - 0.04, 0.005 - d / 2]}
      >
        <boxGeometry args={[w, 0.08, 0.01]} />
      </mesh>
      {/* Mid brace */}
      {shelves.length > 1 && (
        <mesh material={carcassMaterial} position={[0, h / 2 + 0.1, 0]}>
          <boxGeometry args={[0.01, h, d]} />
        </mesh>
      )}
      {/* Feet */}
      {feet.map((pos, n) => (
        <mesh key={n} material={footMaterial} position={pos}>
          <cylinderGeometry args={[0.01, 0.01, 0.1]} />
        </mesh>
      ))}
      {/* Door(s), drawers & handles */}
      <UnitFront {...{ w, h, d, style }} />
      {/* Worktop */}
      <mesh position={[0, h + 0.1 + 0.015, 0.015]}>
        <boxGeometry args={[w, 0.03, d + 0.03]} />
        <meshStandardMaterial map={wtMap} />
      </mesh>
    </group>
  )
}
