import { useAppState } from '@/appState'
import { Edges } from '@react-three/drei'

import { wh, wt } from '@/const'

import { wallColor } from './cabinet/colors'

// Reusable materials
import { wallMaterial, archMaterial } from '@/materials'

/**
 * General component to display an arch. Checks 2D/3D state to determine which
 * form to render.
 */
export default function Arch(props) {
  const { is3D } = useAppState()
  if (is3D) return <Arch3D {...props} />
  else return <Arch2D {...props} />
}

function Arch2D({ len, offset, width, onClick = () => {} }) {
  return (
    <group position={[offset - len / 2, wh + 0.1, 0]} rotation-x={-Math.PI / 2}>
      <mesh onClick={onClick}>
        <meshBasicMaterial color={'#fff'} />
        <planeGeometry args={[width, wt]} />
        <Edges threshold={15} color={'gray'} lineWidth={0.5} />
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
        // material={wallMa terial}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={wallColor} />
        <boxGeometry args={[width, 0.4, wt]} />
      </mesh>
    </group>
  )
}
