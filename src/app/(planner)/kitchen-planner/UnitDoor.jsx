import { useContext, useMemo } from 'react'
import {
  BatchedMesh,
  BoxGeometry,
  ExtrudeGeometry,
  Matrix4,
  Shape,
  MeshStandardMaterial
} from 'three'

import { ModelContext } from '@/model/context'

import UnitHandle from './UnitHandle'

/**
 * Component to render a door with a handle (left or right). Uses a batched
 * mesh to optimise drawing of the various parts, all of which use the same
 * material.
 */
export default function UnitDoor({ dw, dh, handle = 'left', position }) {
  const [model] = useContext(ModelContext)
  const frontMaterial = useMemo(
    () => new MeshStandardMaterial({ color: model.colour }),
    [model.colour]
  )
  const bvw = dw >= 0.4 ? 0.08 : 0.05
  const bvh = 0.08

  const doorMesh = useMemo(() => {
    const mesh = new BatchedMesh(5, 1000, 10, frontMaterial)

    const base = mesh.addGeometry(new BoxGeometry(dw, dh, 0.01).toNonIndexed())
    const edge = mesh.addGeometry(
      new ExtrudeGeometry(
        new Shape()
          .moveTo(-bvw / 2, 0.005 - dh / 2)
          .lineTo(bvw / 2, 0.005 - dh / 2)
          .lineTo(bvw / 2, dh / 2 - 0.005)
          .lineTo(-bvw / 2, dh / 2 - 0.005)
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
          .moveTo(bvw - dw / 2, -bvh / 2)
          .lineTo(dw / 2 - bvw, -bvh / 2)
          .lineTo(dw / 2 - bvw, bvh / 2)
          .lineTo(bvw - dw / 2, bvh / 2)
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

    mesh.setMatrixAt(
      edgeLeft,
      r.clone().setPosition(0.005 - (dw - bvw) / 2, 0, 0.005)
    )
    mesh.setMatrixAt(
      edgeRight,
      r.clone().setPosition((dw - bvw) / 2 - 0.005, 0, 0.005)
    )
    mesh.setMatrixAt(
      bandTop,
      r.clone().setPosition(0, (dh - bvw) / 2 - 0.005, 0.005)
    )
    mesh.setMatrixAt(
      bandBottom,
      r.setPosition(0, 0.005 - (dh - bvw) / 2, 0.005)
    )

    return mesh
  }, [dw, dh])

  return (
    <group position={position}>
      <primitive object={doorMesh} />
      <UnitHandle
        position={[
          handle === 'left' ? (bvw - dw) / 2 : (dw - bvw) / 2,
          0,
          0.01
        ]}
      />
    </group>
  )
}
