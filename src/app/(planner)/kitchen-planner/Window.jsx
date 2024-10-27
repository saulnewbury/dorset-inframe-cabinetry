import { DoubleSide } from 'three'
import { casing } from '@/lib/data/features.js'

import { t, h } from './const.js'

export default function Window() {
  return (
    <group position-y={0.8} rotation-y={Math.PI / 2 + 0.5}>
      {casing.map((c, i) => {
        return (
          <mesh key={i} position={c.pos} rotation={c.rotation}>
            <planeGeometry args={[t, c.len]} />
            <meshNormalMaterial side={DoubleSide} />
          </mesh>
        )
      })}
    </group>
  )
}
