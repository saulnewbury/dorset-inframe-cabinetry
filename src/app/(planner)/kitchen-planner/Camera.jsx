import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

/**
 * Component to manage the 2D (orthographic) and 3D (perspective) views of the
 * ThreeJS scene. Both cameras are created, but only one at a time is used for
 * rendering.
 */
export default function Camera({ is3D }) {
  const cam3d = useRef()
  const cam2d = useRef()

  const { set } = useThree(({ get, set }) => ({ get, set }))
  const { size } = useThree()

  useEffect(() => {
    if (is3D) {
      set({ camera: cam3d.current })
      cam3d.current.position.set(0, 4, 8)
    } else {
      set({ camera: cam2d.current })
      // cam2d.current.lookAt(0, 0, 0)
      cam2d.current.position.set(0, 50, 0)
    }
  }, [is3D, set])

  return (
    <>
      <PerspectiveCamera
        ref={cam3d}
        // position={[0, 4, 8]}
        position={[0, 4, 100]}
        // near={0.001}
        // far={1000}
      />
      <OrthographicCamera
        ref={cam2d}
        position={[0, 50, 0]}
        zoom={80}
        near={0}
        far={100}
        left={size.width / -2}
        right={size.width / 2}
        top={size.height / 2}
        bottom={size.height / -2}
      />
    </>
  )
}
