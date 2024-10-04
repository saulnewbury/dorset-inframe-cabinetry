'use client'
import * as THREE from 'three'
import { useContext, useRef, useState, useEffect, useMemo } from 'react'
import { PerspectiveContext } from '@/app/context'
import {
  calculateAdjacent,
  calculateOpposite
} from '@/lib/helpers/calculateAngles'

import Handle from './Handle'
import Flip from './Flip'
import Position from './Position'

export default function Wall({ params }) {
  const { id, w, h, t, x, z, theta } = params

  const { view } = useContext(PerspectiveContext)

  const [dragEnd, setDragEnd] = useState(true)
  const [end, setEnd] = useState(true)
  const [angle, setAngle] = useState(theta)
  const [l, setLength] = useState(w)
  const [px, setPx] = useState(x)
  const [pz, setPz] = useState(z)

  // Stays here
  const [handlePos, setHandlePos] = useState({})
  const group = useRef()
  const handle = useRef()
  const pos = useRef()

  // dims
  const wpz = end ? -l / 2 : l / 2

  // position (world coordinates)
  const gpx = px
  const gpz = pz

  useEffect(() => {
    if (!pos.current) return
    const p = pos.current.getWorldPosition(new THREE.Vector3())
    setHandlePos({ x: p.x, z: p.z })
  }, [end])

  // Used in jsx
  const { a, o } = useMemo(() => {
    const a = calculateAdjacent(l, angle)
    const o = calculateOpposite(l, angle)
    return { a, o }
  }, [dragEnd])

  function handleDrag() {
    // hyp and adj from center of world
    const { x, z } = handle.current.getWorldPosition(new THREE.Vector3())
    const adj = z - gpz // position z of wall
    const opp = x - gpx // position x of group
    const hyp = Math.sqrt(adj * adj + opp * opp)

    const angleDeg = -(Math.atan2(adj, opp) - Math.atan2(wpz, 0))
    setLength(hyp) // local length
    setAngle(angleDeg) // local rotation
  }

  return (
    <>
      {/* Group x: horizontal, y: height, z: length (vertical) */}
      <group rotation-y={angle} ref={group} position={[gpx, h / 2, gpz]}>
        {/* Wall */}
        <mesh position={[-t / 2, 0, wpz]}>
          <boxGeometry args={[t, h, l]} />
          <meshNormalMaterial color='red' side={THREE.DoubleSide} />
        </mesh>
        {/* Container (wireframe for testing, otherwise invisible) */}
        <mesh>
          <boxGeometry args={[t * 2, h, l * 2]} />
          <meshNormalMaterial color='green' wireframe />
        </mesh>
        <Flip
          t={t}
          dpx={0}
          dpz={0}
          end={end}
          flip={() => {
            setEnd(!end)
            if (end) {
              setPx(gpx - o)
              setPz(gpz - a)
            } else {
              setPx(gpx + o)
              setPz(gpz + a)
            }
          }}
        />
        <Position t={t} dpx={0} dpz={end ? -l : l} ref={pos} />
      </group>

      {/* Handle */}
      {view === '2d' && (
        <Handle
          key={end}
          end={end}
          t={t}
          x={handlePos.x}
          z={handlePos.z}
          handleDrag={handleDrag}
          dragEnd={() => {
            setDragEnd(!dragEnd)
          }}
          angle={angle}
          ref={handle}
        />
      )}
    </>
  )
}
