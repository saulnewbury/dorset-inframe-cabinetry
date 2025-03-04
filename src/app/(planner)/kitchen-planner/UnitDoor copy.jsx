'use client'

import { useContext, useMemo } from 'react'
import {
  BatchedMesh,
  BoxGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Shape,
  MeshStandardMaterial
} from 'three'

import { ModelContext } from '@/model/context'
import UnitHandle from './UnitHandle'

/**
 * Component to render a door with a handle (left or right). Uses a batched
 * mesh to optimise drawing of the various parts, all of which use the same
 * material. Added gray lines using EdgesGeometry for better visual definition.
 */
export default function UnitDoor({ dw, dh, handle = 'left', position }) {
  const [model] = useContext(ModelContext)

  const frontMaterial = useMemo(
    () => new MeshStandardMaterial({ color: model.colour }),
    [model.colour]
  )
  const edgeMaterial = useMemo(
    () => new LineBasicMaterial({ color: 0x777777 }),
    []
  )
  const bvw = dw >= 0.4 ? 0.08 : 0.05
  const bvh = 0.08

  const doorMesh = useMemo(() => {
    const mesh = new BatchedMesh(5, 1000, 10, frontMaterial)

    // Create geometries
    const baseGeometry = new BoxGeometry(dw, dh, 0.01).toNonIndexed()
    const base = mesh.addGeometry(baseGeometry)

    const edgeShape = new Shape()
      .moveTo(-bvw / 2, 0.005 - dh / 2)
      .lineTo(bvw / 2, 0.005 - dh / 2)
      .lineTo(bvw / 2, dh / 2 - 0.005)
      .lineTo(-bvw / 2, dh / 2 - 0.005)
      .closePath()

    const edgeGeometry = new ExtrudeGeometry(edgeShape, {
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 4
    })
    const edge = mesh.addGeometry(edgeGeometry)

    const bandShape = new Shape()
      .moveTo(bvw - dw / 2, -bvh / 2)
      .lineTo(dw / 2 - bvw, -bvh / 2)
      .lineTo(dw / 2 - bvw, bvh / 2)
      .lineTo(bvw - dw / 2, bvh / 2)
      .closePath()

    const bandGeometry = new ExtrudeGeometry(bandShape, {
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 4
    })
    const band = mesh.addGeometry(bandGeometry)

    // Add instances
    mesh.addInstance(base)
    const edgeLeft = mesh.addInstance(edge)
    const edgeRight = mesh.addInstance(edge)
    const bandTop = mesh.addInstance(band)
    const bandBottom = mesh.addInstance(band)

    const r = new Matrix4()

    // Set positions
    mesh.setMatrixAt(
      edgeLeft,
      r.clone().setPosition(0.05 - (dw - bvw) / 2, 0, 0.005)
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
  }, [dw, dh, frontMaterial])

  // Create edges geometries for outlining the door
  const edgesLines = useMemo(() => {
    // Create base door outline
    const baseEdgesGeometry = new EdgesGeometry(new BoxGeometry(dw, dh, 0.01))
    const baseEdges = new LineSegments(baseEdgesGeometry, edgeMaterial)

    // Create edges for the vertical bands
    const leftEdgeGeometry = new EdgesGeometry(
      new BoxGeometry(bvw, dh - 0.01, 0.01)
    )
    const leftEdge = new LineSegments(leftEdgeGeometry, edgeMaterial)
    leftEdge.position.set(0.05 - (dw - 0) / 2, 0, 0.005)

    const rightEdgeGeometry = new EdgesGeometry(
      new BoxGeometry(bvw, dh - 0.01, 0.01)
    )
    const rightEdge = new LineSegments(rightEdgeGeometry, edgeMaterial)
    rightEdge.position.set((dw - bvw) / 2 - 0.005, 0, 0.005)

    // Create edges for the horizontal bands
    const topBandGeometry = new EdgesGeometry(
      new BoxGeometry(dw - bvw * 2, bvh, 0.01)
    )
    const topBand = new LineSegments(topBandGeometry, edgeMaterial)
    topBand.position.set(0, (dh - bvw) / 2 - 0.005, 0.005)

    const bottomBandGeometry = new EdgesGeometry(
      new BoxGeometry(dw - bvw * 2, bvh, 0.01)
    )
    const bottomBand = new LineSegments(bottomBandGeometry, edgeMaterial)
    bottomBand.position.set(0, 0.005 - (dh - bvw) / 2, 0.005)

    return { baseEdges, leftEdge, rightEdge, topBand, bottomBand }
  }, [dw, dh, bvw, bvh, edgeMaterial])

  return (
    <group position={position}>
      <primitive object={doorMesh} />

      {/* Add edge lines for better definition */}
      <primitive object={edgesLines.baseEdges} />
      <primitive object={edgesLines.leftEdge} />
      <primitive object={edgesLines.rightEdge} />
      <primitive object={edgesLines.topBand} />
      <primitive object={edgesLines.bottomBand} />

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
