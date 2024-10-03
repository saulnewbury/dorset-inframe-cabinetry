import * as THREE from 'three'

export default function Flip({ t, dpx, dpz, angle, flip }) {
  return (
    <group position={[dpx, 1.5 + 0.05, dpz]}>
      <group rotation-y={angle}>
        <group position={[0 - t / 2, 2 + 0.05, 0 + t / 2]}>
          <mesh
            // rotation-y={angle}
            onPointerOver={() => flip(true)}
          >
            <boxGeometry args={[t * 1.5, t * 1.5, t * 1.5]} />
            <meshStandardMaterial
              color='green'
              side={THREE.DoubleSide}
              transparent
              opacity={0.0}
            />
          </mesh>
        </group>
        <mesh>
          <boxGeometry args={[t * 2, 0, t * 2]} />
          <meshStandardMaterial color='green' wireframe />
        </mesh>
      </group>
    </group>
  )
}
