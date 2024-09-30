import * as THREE from 'three'
import { useMemo, useEffect, useRef } from 'react'

export default function Art() {
  const geometry = useRef()
  const verticesCount = 10 * 3

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3)

    for (let i = 0; i < verticesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3
    }
    return positions
  }, [])

  useEffect(() => {
    geometry.current.computeVertexNormals()
  }, [])

  return (
    <mesh>
      <bufferGeometry ref={geometry}>
        <bufferAttribute
          attach='attributes-position'
          count={verticesCount}
          itemSize={3} // how many values per vertext
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color='red' side={THREE.DoubleSide} />
    </mesh>
  )
}
