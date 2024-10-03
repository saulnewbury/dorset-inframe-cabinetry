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
  const { w, h, t, x, z, theta } = params

  // const theta = Math.PI * 0.2
  const [end, setEnd] = useState(true)
  const [angle, setAngle] = useState(theta)
  const [l, setLength] = useState(w)
  const [px, setPx] = useState(x)
  const [pz, setPz] = useState(z)
  const [handlePos, setHandlePos] = useState({})
  const group = useRef()
  const handle = useRef()
  const pos = useRef()

  // const end = false

  useEffect(() => {
    if (!pos.current) return
    const p = pos.current.getWorldPosition(new THREE.Vector3())
    setHandlePos({ dpx: p.x, dpz: p.z })
  }, [end])

  const { view } = useContext(PerspectiveContext)

  const { a, o } = useMemo(() => {
    const a = calculateAdjacent(l, angle)
    const o = calculateOpposite(l, angle)
    return { a, o }
  }, [end])

  const wpz = end ? -l / 2 : l / 2,
    // gpx = end ? px : px - o,
    // gpz = end ? pz - w / 2 : pz - a - w / 2
    gpx = end ? px : px - o,
    gpz = end ? pz - w / 2 : pz - a - w / 2

  function handleDrag() {
    // hyp and adj from center of world
    const { x, z } = handle.current.getWorldPosition(new THREE.Vector3())
    const adj = z - gpz // position z of wall
    const opp = x - gpx // position x of group

    const hyp = Math.sqrt(adj * adj + opp * opp)

    const angleDeg = -(Math.atan2(adj, opp) - Math.atan2(wpz, 0))
    setLength(hyp)
    setAngle(angleDeg)
  }

  return (
    <>
      {/* Group x: horizontal, y: height, z: length (vertical) */}
      {/* <group ref={group} position={[gpx, h / 2, gpz]}> */}
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
          flip={() => {
            setEnd(!end)
          }}
        />
        <Position t={t} dpx={0} dpz={end ? -l : l} ref={pos} />
      </group>

      {/* Handle */}
      {view === '2d' && (
        <Handle
          key={end}
          t={t}
          dpx={handlePos.dpx}
          dpz={handlePos.dpz}
          handleDrag={handleDrag}
          // end of drag if end is false recalculate px and pz
          dragEnd={() => {
            if (end === false) {
              const wp = group.current.getWorldPosition(new THREE.Vector3())
              setPx(dpx - wp.x)
              setPz(dpz - wp.z)
            }
          }}
          angle={angle}
          ref={handle} // wireframe bit
        />
      )}
      {/* </group> */}
    </>
  )
}
