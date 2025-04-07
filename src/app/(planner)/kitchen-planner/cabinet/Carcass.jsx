import React from 'react'
import { Edges } from '@react-three/drei'

import lineColor from './colors'

import { useAppState } from '@/appState'

export default function Carcass({
  distance,
  carcassHeight,
  carcassDepth,
  panelThickness,
  baseCarcassToFloor,
  backInset,
  baseUnit,
  basin,
  underCounter = false
}) {
  // Undercounter
  const offsetY = underCounter ? baseCarcassToFloor : 0
  const offsetZ = underCounter ? 0.05 - 0.051 : 0

  // App state
  const { is3D } = useAppState()

  return (
    <>
      {/* Left Side Panel */}
      <mesh
        receiveShadow
        position={[
          -distance / 2,
          carcassHeight / 2 - offsetY / 2,
          -offsetZ / 2
        ]}
      >
        <boxGeometry
          args={[
            panelThickness,
            carcassHeight + offsetY,
            carcassDepth - offsetZ
          ]}
        />
        <meshStandardMaterial color={is3D ? 'white' : 'lightgray'} />
        <Edges
          color={is3D ? lineColor : 'darkgray'}
          renderOrder={1000}
          lineWidth={!is3D && 2}
        />
      </mesh>

      {/* Right Side Panel */}
      <mesh
        receiveShadow
        position={[distance / 2, carcassHeight / 2 - offsetY / 2, -offsetZ / 2]}
      >
        <boxGeometry
          args={[
            panelThickness,
            carcassHeight + offsetY,
            carcassDepth + offsetZ
          ]}
        />
        <meshStandardMaterial color={is3D ? 'white' : 'lightgray'} />
        <Edges
          color={is3D ? lineColor : 'darkgray'}
          renderOrder={1000}
          lineWidth={!is3D && 2}
        />
      </mesh>

      {/* Back Panel & Bottom Panel */}
      {!underCounter && (
        <>
          <mesh position={[0, panelThickness / 2, backInset / 2]}>
            <boxGeometry
              args={[distance, panelThickness, carcassDepth - backInset]}
            />
            <meshStandardMaterial color={is3D ? 'white' : 'lightgray'} />
            <Edges
              color='lineColor'
              renderOrder={1000}
              lineWidth={!is3D && 2}
            />
          </mesh>
          <mesh
            rotation-y={Math.PI * 0.5}
            position={[
              0,
              carcassHeight / 2,
              -carcassDepth / 2 + backInset + panelThickness / 2
            ]}
          >
            <boxGeometry
              args={[panelThickness, carcassHeight, distance - panelThickness]}
            />
            <meshStandardMaterial color={is3D ? 'white' : 'lightgray'} />
            <Edges
              color='lineColor'
              renderOrder={1000}
              lineWidth={!is3D && 2}
            />
          </mesh>
        </>
      )}

      {/* Top Panel */}
      {(!baseUnit || basin) && (
        <mesh position={[0, carcassHeight - panelThickness / 2, backInset / 2]}>
          <boxGeometry
            args={[
              distance - panelThickness,
              panelThickness,
              carcassDepth - backInset
            ]}
          />
          <meshStandardMaterial color={is3D ? 'white' : 'lightgray'} />
          <Edges color='lineColor' renderOrder={1000} />
        </mesh>
      )}
    </>
  )
}
