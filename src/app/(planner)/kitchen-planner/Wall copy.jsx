import * as THREE from 'three'
import { useEffect } from 'react'

export default function Wall({ a, b, t, h }) {
  const adj = b.x - a.x
  const opp = b.z - a.z
  const hyp = Math.sqrt(adj * adj + opp * opp)
  const theta = -Math.atan2(opp, adj)
  const x = (a.x + b.x) / 2
  const z = (a.z + b.z) / 2

  return (
    <mesh rotation-y={theta} position={[x, h / 2, z]}>
      <boxGeometry args={[hyp, h, t]} />
      <meshNormalMaterial side={THREE.DoubleSide} />
    </mesh>
  )
}
