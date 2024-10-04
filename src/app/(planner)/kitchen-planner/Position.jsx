import * as THREE from 'three'
import { forwardRef } from 'react'
export default forwardRef(function Position({ t, dpx, dpz, angle }, pos) {
  return (
    <group position={[dpx, 1.5 + 0.05, dpz]}>
      <group rotation-y={angle}>
        <group position={[0 - t / 2, 2 + 0.05, 0 + t / 2]}>
          <mesh>
            <boxGeometry args={[t * 1.5, t * 1.5, t * 1.5]} />
            <meshStandardMaterial
              color='red'
              side={THREE.DoubleSide}
              transparent
              opacity={0}
            />
          </mesh>
        </group>
        <mesh ref={pos}>
          <boxGeometry args={[t * 2, 0, t * 2]} />
          <meshStandardMaterial color='green' wireframe />
        </mesh>
      </group>
    </group>
  )
})
