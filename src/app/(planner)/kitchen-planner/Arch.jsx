import { useContext } from 'react'

import { AppContext } from '@/appState'

import { wh, wt } from '@/const'

// Reusable materials
import { wallMaterial, archMaterial } from '@/materials'

/**
 * General component to display an arch. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Arch(props) {
  const is3D = useContext(AppContext)
  if (is3D) return <Arch3D {...props} />
  else return <Arch2D {...props} />
}

function Arch2D({ len, offset, width, onClick = () => {} }) {
  return (
    <group position={[offset - len / 2, wh + 0.1, 0]} rotation-x={-Math.PI / 2}>
      <mesh material={archMaterial} onClick={onClick}>
        <planeGeometry args={[width, wt]} />
      </mesh>
    </group>
  )
}

/**
 * Component to render an arch in the 3D (elevation) view. Fills in the lintel
 * but leaves the rest of the space empty.
 */
function Arch3D({ len, offset, width }) {
  return (
    <group position={[offset - len / 2, 0, 0]}>
      {/* Lintel */}
      <mesh
        position={[0, wh - 0.2, 0]}
        material={wallMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, 0.4, wt]} />
      </mesh>
    </group>
  )
}