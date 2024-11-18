import { useContext, useMemo } from 'react'
import {
  BatchedMesh,
  Matrix4,
  ExtrudeGeometry,
  BoxGeometry,
  Shape,
  MeshStandardMaterial
} from 'three'
import { ModelContext } from '@/model/context'

import UnitHandle from './UnitHandle'

/**
 * Component to render a drawer-type front, with a handle. Uses a similar model
 * to that for a door.
 */
export default function UnitDrawer({ dw, dh, position }) {
  const [model] = useContext(ModelContext)
  const frontMaterial = useMemo(
    () => new MeshStandardMaterial({ color: model.colour }),
    [model.colour]
  )
  const drawerMesh = useMemo(() => {
    const mesh = new BatchedMesh(5, 1000, 10, frontMaterial)

    const base = mesh.addGeometry(
      new BoxGeometry(dw - 0.04, dh - 0.04, 0.01).toNonIndexed()
    )
    const edge = mesh.addGeometry(
      new ExtrudeGeometry(
        new Shape()
          .moveTo(-0.04, 0.005 - dh / 2)
          .lineTo(0.04, 0.005 - dh / 2)
          .lineTo(0.04, dh / 2 - 0.005)
          .lineTo(-0.04, dh / 2 - 0.005)
          .closePath(),
        {
          depth: 0,
          bevelEnabled: true,
          bevelThickness: 0.005,
          bevelSize: 0.005,
          bevelsegments: 4
        }
      )
    )
    const band = mesh.addGeometry(
      new ExtrudeGeometry(
        new Shape()
          .moveTo(0.08 - dw / 2, -0.02)
          .lineTo(dw / 2 - 0.08, -0.02)
          .lineTo(dw / 2 - 0.08, 0.02)
          .lineTo(0.08 - dw / 2, 0.02)
          .closePath(),
        {
          depth: 0,
          bevelEnabled: true,
          bevelThickness: 0.005,
          bevelSize: 0.005,
          bevelsegments: 4
        }
      )
    )

    mesh.addInstance(base)
    const edgeLeft = mesh.addInstance(edge)
    const edgeRight = mesh.addInstance(edge)
    const bandTop = mesh.addInstance(band)
    const bandBottom = mesh.addInstance(band)

    const r = new Matrix4()

    mesh.setMatrixAt(edgeLeft, r.clone().setPosition(0.045 - dw / 2, 0, 0.005))
    mesh.setMatrixAt(edgeRight, r.clone().setPosition(dw / 2 - 0.045, 0, 0.005))
    mesh.setMatrixAt(bandTop, r.clone().setPosition(0, dh / 2 - 0.025, 0.005))
    mesh.setMatrixAt(bandBottom, r.setPosition(0, 0.025 - dh / 2, 0.005))

    return mesh
  }, [dw, dh])

  return (
    <group position={position}>
      <primitive object={drawerMesh} />
      <UnitHandle position={[0, dh / 2 - 0.03, 0.01]} />
    </group>
  )
}
