import { forwardRef, useContext, useMemo, useRef, useState } from 'react'
import { DragControls } from '@react-three/drei'
import { Matrix4, Vector3, Vector2, Shape, Box2 } from 'three'
import clsx from 'clsx'

import { ModelContext } from '@/model/context'
import { useAppState } from '@/appState'

import { baseUnitStyles, tallUnitStyles } from '@/model/itemStyles'
import { wt } from '@/const'

import ItemInfo from './ItemInfo'
import Cabinet from './cabinet/Cabinet'
import CabinetCorner from './cabinet/CabinetCorner'
import CabinetUnderCounter from './cabinet/CabinetUnderCounter'
import CabinetWall from './cabinet/CabinetWall'

import DimensionLine from './DimensionLine'

import ic_delete from '@/assets/icons/trash.svg'
import { hoverMaterial } from '@/materials'

// Used when a unit is not found in the respective styles list.
const nullStyle = {
  id: 'null',
  title: 'Unknown',
  prices: [],
  sizes: [],
  props: {} // default props
}

const crossMove = new Shape(
  [
    [-0.01, 0.01],
    [-0.01, 0.06],
    [-0.03, 0.06],
    [0.0, 0.08],
    [0.03, 0.06],
    [0.01, 0.06],
    [0.01, 0.01],
    [0.06, 0.01],
    [0.06, 0.03],
    [0.08, 0.0],
    [0.06, -0.03],
    [0.06, -0.01],
    [0.01, -0.01],
    [0.01, -0.06],
    [0.03, -0.06],
    [0.0, -0.08],
    [-0.03, -0.06],
    [-0.01, -0.06],
    [-0.01, -0.01],
    [-0.06, -0.01],
    [-0.06, -0.03],
    [-0.08, 0.0],
    [-0.06, 0.03],
    [-0.06, 0.01],
    [-0.01, 0.01]
  ].map((p) => new Vector2(p[0], p[1]))
)

const vectorY = new Vector3(0, 1, 0)

/**
 * Component to render a kitchen unit (at present, only base units and wall units).
 * Adds a drag handle in 2D mode, by which the unit can be repositioned.
 */
export default function KitchenUnit({
  id,
  type,
  width,
  depth,
  height,
  variant,
  style,
  pos,
  rotation,
  hover,
  onHover = () => {},
  onDrag = () => {}
}) {
  // const { is3D } = useContext(AppContext)
  const { is3D } = useAppState()
  const [model, dispatch] = useContext(ModelContext)
  const [dragging, setDragging] = useState(false)
  const info = useRef()
  const allEdges = useRef([])
  const allWalls = useRef([])

  const size = new Vector3(width / 1000, height / 1000, depth / 1000)
  const centreOffset = style?.includes('corner')
    ? style?.includes('left')
      ? -0.1475
      : +0.1475
    : 0
  const widthOffset = style?.includes('corner') ? 2 * 0.295 : 0

  const showHandle = !is3D && hover?.type === 'unit' && hover.id === id

  const [handle, matrix, mrotate, ry] = useMemo(() => {
    return [
      new Vector3(pos.x, 0, pos.z),
      new Matrix4(),
      new Matrix4(),
      rotation
    ]
  }, [dragging])

  return (
    <>
      <group position={[pos.x, 0, pos.z]} rotation-y={rotation}>
        {!is3D && (
          <>
            <mesh
              position={[0, size.y + 0.05, 0]}
              rotation-x={Math.PI / -2}
              material={hoverMaterial}
              onPointerOver={(ev) => onHover(ev, true)}
              onPointerOut={(ev) => onHover(ev, false)}
              onClick={showInfo}
              userData={{ id, type: 'unit' }}
            >
              <planeGeometry args={[size.x, size.z]} />
            </mesh>
            <InfoPanel ref={info} {...{ id, type, width, variant, style }} />
            {/* <DimensionLine
              from={0}
              to={0.764 + 0.036}
              value={0.818}
              depth={0.575}
              cab={true}
            /> */}
          </>
        )}
        {type === 'base' && <BaseUnit {...{ width, variant, style }} />}
        {type === 'tall' && <TallUnit {...{ width, variant, style }} />}
        {type === 'wall' && (
          <CabinetWall
            carcassInnerWidth={width / 1000 - 0.036}
            carcassDepth={0.282}
            style={style}
          />
        )}
      </group>
      {(showHandle || dragging) && (
        <>
          <mesh
            position={[pos.x + centreOffset, size.y + 0.08, pos.z]}
            rotation-x={Math.PI / -2}
            rotation-z={rotation}
          >
            <planeGeometry args={[size.x + widthOffset, size.z]} />
            <meshStandardMaterial color="#20ff20" />
          </mesh>
          <DragControls
            matrix={matrix}
            autoTransform={false}
            onDragStart={startDrag}
            onDrag={moveUnit}
            onDragEnd={endDrag}
          >
            <group
              position={[handle.x + centreOffset, size.y + 0.1, handle.z]}
              rotation-y={rotation}
            >
              <mesh rotation-x={Math.PI / -2}>
                <circleGeometry args={[0.1]} />
                <meshStandardMaterial
                  color="#4080bf"
                  transparent
                  opacity={0.6}
                />
              </mesh>
              <mesh rotation-x={Math.PI / -2} position-y={0.001}>
                <shapeGeometry args={[crossMove]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          </DragControls>
          <DragControls
            matrix={mrotate}
            autoTransform={false}
            onDragStart={startDrag}
            onDrag={rotateUnit}
            onDragEnd={endDrag}
          >
            <group
              position={[handle.x + centreOffset, size.y + 0.1, handle.z]}
              rotation-y={ry}
            >
              <mesh rotation-x={Math.PI / -2} position-x={0.2}>
                <circleGeometry args={[0.03]} />
                <meshStandardMaterial color="#004088" />
              </mesh>
            </group>
          </DragControls>
        </>
      )}
    </>
  )

  /**
   * Callback for 'click' event on 2D opening. Shows information about the
   * item, with option to delete.
   */
  function showInfo() {
    if (!dragging) info.current.show()
  }

  /**
   * Returns true if the current unit is allowed to snap to the given one.
   */
  function canSnap(unit) {
    return (
      unit.id !== id &&
      ((type === 'wall' && unit.type !== 'base') || type !== 'wall')
    )
  }

  /**
   * Calculates the four corners of a unit.
   */
  function getCorners(unit) {
    const pos = new Vector3(unit.pos.x, 0, unit.pos.z)
    let w = unit.width / 1000
    if (unit.type === 'base' && unit.style?.includes('corner')) {
      const offset = unit.style?.includes('left') ? -0.1475 : +0.1475
      w += 2 * 0.295
      pos.add(new Vector3(offset, 0, 0).applyAxisAngle(vectorY, unit.rotation))
    }
    const d = unit.depth / 1000
    return [
      new Vector3(-w / 2, 0, d / 2), // front left
      new Vector3(-w / 2, 0, -d / 2), // back left
      new Vector3(w / 2, 0, -d / 2), // back right
      new Vector3(w / 2, 0, d / 2) // front right
    ].map((p) => p.applyAxisAngle(vectorY, unit.rotation).add(pos))
  }

  /**
   * Calculates the edges of a unit, based on its corners.
   */
  function getEdges(id, corners) {
    return corners.map((c, i) => {
      const next = corners[(i + 1) % corners.length]
      return {
        id,
        start: [c.x, c.z],
        end: [next.x, next.z],
        rot: Math.atan2(next.x - c.x, next.z - c.z),
        side: i
      }
    })
  }

  /**
   * Calculates the two faces of each part of a wall segment, based on its
   * ends and thickness.The result is an array of 'edge' objects.
   */
  function getWallFaces(segment) {
    return segment
      .map((pt, n) => {
        const end = segment[(n + 1) % segment.length]
        const length = Math.hypot(end.x - pt.x, end.z - pt.z)
        if (length < 0.0001) return null // zero length wall segment

        const normal = new Vector3(end.x - pt.x, 0, end.z - pt.z)
          .normalize()
          .applyAxisAngle(vectorY, Math.PI / 2)
          .multiplyScalar(wt / 2)
        const rot = Math.atan2(end.x - pt.x, end.z - pt.z)

        return [
          {
            start: [pt.x - normal.x, pt.z - normal.z],
            end: [end.x - normal.x, end.z - normal.z],
            rot
          },
          {
            start: [pt.x + normal.x, pt.z + normal.z],
            end: [end.x + normal.x, end.z + normal.z],
            rot
          }
        ]
      })
      .filter((f) => f !== null)
      .flat()
  }

  /**
   * Returns an axis-aligned bounding box for the given edge, inflated by half wall
   * thickness (snap range).
   */
  function getBoundingBox(edge) {
    const { start, end } = edge
    const minX = Math.min(start[0], end[0]) - wt / 2
    const maxX = Math.max(start[0], end[0]) + wt / 2
    const minZ = Math.min(start[1], end[1]) - wt / 2
    const maxZ = Math.max(start[1], end[1]) + wt / 2
    return new Box2(new Vector2(minX, minZ), new Vector2(maxX, maxZ))
  }

  /**
   * Computes the shortest distance from a point to a line segment and returns
   * that distance, as well as the x and z offsets from the point to the
   * closest point on the segment.
   */
  function pointToSegment(pt, segment) {
    const box = getBoundingBox(segment)
    if (!box.containsPoint(new Vector2(pt.x, pt.z))) {
      // Point is outside the bounding box of the segment, return a large distance
      return [Infinity, 0, 0]
    }
    // Calculate the projection of the point onto the segment
    const [sx, sz] = segment.start
    const [ex, ez] = segment.end
    const dx = ex - sx
    const dz = ez - sz
    if (dx === 0 && dz === 0) {
      // Segment is a point
      return [Math.hypot(pt.x - sx, pt.z - sz), 0, 0]
    }
    const t = Math.max(
      0,
      Math.min(1, ((pt.x - sx) * dx + (pt.z - sz) * dz) / (dx * dx + dz * dz))
    )
    const projX = sx + t * dx
    const projZ = sz + t * dz
    // Return distance and offset to projected point.
    return [Math.hypot(pt.x - projX, pt.z - projZ), projX - pt.x, projZ - pt.z]
  }

  /**
   * Callback for 'drag start' event. Calculate the corners and edges of all
   * units and set the dragging state to true. Only keep the first three
   * edges of each unit, as we don't snap to front.
   */
  function startDrag() {
    allEdges.current = model.units
      .filter((u) => canSnap(u))
      .map((u) => getEdges(u.id, getCorners(u)))
      .flat()
    allWalls.current = model.walls
      .map((segment) => getWallFaces(segment))
      .flat()
    setDragging(true)
    onDrag(true)
  }

  /**
   * Callback for 'drag' event. Updates the position of the unit, snapping to
   * the nearest wall or other unit if close enough.
   */
  function moveUnit(lm) {
    const snap = wt / 2
    const wrap = (a, n, s) => (s ? a[n] : a[(n + a.length) % a.length])
    const normalise = (r) => (r < Math.PI ? r : r - Math.PI * 2)
    let newPos = new Vector3().setFromMatrixPosition(lm).add(handle)
    let rotation = ry

    // Get the four corners of the unit and then compute its edges.
    let myCorners = getCorners({
      pos: newPos,
      width,
      depth,
      type,
      style,
      rotation
    })
    let myEdges = getEdges(id, myCorners)

    function adjustPos(dx, dz) {
      // Adjust the position of the unit by the given dx and dz.
      newPos.x += dx
      newPos.z += dz
      const offset = new Vector3(dx, 0, dz)
      for (const c of myCorners) c.add(offset)
      myEdges = getEdges(id, myCorners)
    }

    // If some corner of the unit is close enough to snap to a wall then
    // do so.
    for (const c of myCorners) {
      for (const wall of allWalls.current) {
        const [dist, dx, dz] = pointToSegment(c, wall)
        if (dist < snap) {
          adjustPos(dx, dz)
        }
      }
    }

    // Likewise for other (compatible) units.
    for (const c of myCorners) {
      for (const edge of allEdges.current) {
        const [dist, dx, dz] = pointToSegment(c, edge)
        if (dist < snap) {
          adjustPos(dx, dz)
        }
      }
    }

    // If any edges of the unit now overlap with a wall or another unit then
    // block the move.
    // if (unitOverlapsObject(myEdges)) return

    // Update unit position and rotation
    dispatch({ id: 'moveUnit', unit: id, pos: newPos, rotation })

    const { x, z } = newPos
    matrix.copy(lm)
    mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
  }

  /**
   * Handles the rotation of the unit when dragging the handle.
   */
  function rotateUnit(lm) {
    // Get the current position of the handle, relative to the centre of the
    // unit.
    const t = new Matrix4().makeRotationY(ry)
    const v = new Vector3(0.2, 0, 0).applyMatrix4(t)
    const { x, z } = new Vector3().setFromMatrixPosition(lm).add(v)

    // Calculate the new position of the handle, relative to the centre of
    // the unit. This is done by rotating the handle around the centre of
    // the unit.
    let theta = Math.atan2(z, x)
    const px = 0.2 * Math.cos(theta)
    const pz = 0.2 * Math.sin(theta)

    // Snap rotation to 90 degree increments.
    const snap = Math.round(theta / (Math.PI / 2)) * (Math.PI / 2)
    if (Math.abs(snap - theta) < 0.1) theta = snap

    // Update the rotation of the unit to match the new angle.
    dispatch({ id: 'moveUnit', unit: id, pos, rotation: -theta })

    // Now update the position of the handle.
    mrotate.makeTranslation(px - v.x, 0, pz - v.z)
  }

  /**
   * Callback for 'drag end' event.
   */
  function endDrag() {
    allEdges.current = []
    setDragging(false)
    onDrag(false)
  }
}

/**
 * Component to display details of the current unit.
 */
const InfoPanel = forwardRef((props, ref) => {
  const [, dispatch] = useContext(ModelContext)

  const style =
    props.type === 'base'
      ? baseUnitStyles[props.variant]?.find((s) => s.id === props.style) ??
        nullStyle
      : props.type === 'tall'
      ? tallUnitStyles[props.variant]?.find((s) => s.id === props.style) ??
        nullStyle
      : { id: 'wall' }
  const type = props.type[0].toUpperCase() + props.type.slice(1)
  const base = style.id.replace(':', '-')
  const image = `/units/${base}/${base}-${props.width}-front.webp`

  return (
    <ItemInfo ref={ref}>
      <div className={clsx(style && 'flex gap-5 items-start')}>
        {style && <img src={image} alt="" className="w-28" />}
        <div>
          <p>
            Item: {type} {props.variant?.toLowerCase()}
          </p>
          {style && <p>Style: {style.title}</p>}
          <p>Width: {props.width}mm</p>
        </div>
      </div>
      <p className="text-right">
        <button onClick={deleteItem}>
          <img src={ic_delete.src} alt="Delete" className="size-4" />
        </button>
      </p>
    </ItemInfo>
  )
  /**
   * Callback to delete an opening when the trash icon is clicked.
   */
  function deleteItem() {
    dispatch({ id: 'deleteUnit', unit: props.id })
  }
})

InfoPanel.displayName = 'InfoPanel'

/**
 * Child component to render a base unit.
 */
function BaseUnit({ width, variant, style }) {
  const option =
    baseUnitStyles[variant]?.find((s) => s.id === style) ?? nullStyle
  switch (variant) {
    case 'Counter only':
      return (
        <CabinetUnderCounter
          {...option.props}
          carcassInnerWidth={width / 1000 - 0.036}
        />
      )
    case 'For corner':
      return (
        <CabinetCorner
          {...option.props}
          carcassInnerWidth={width / 1000 + 0.295 - 0.036}
          interiorOpeningWidth={
            [0.38, 0.43, 0.48, 0.58][[400, 450, 500, 600].indexOf(width)]
          }
        />
      )
    default:
      return (
        <Cabinet {...option.props} carcassInnerWidth={width / 1000 - 0.036} />
      )
  }
}

/**
 * Child component to render a tall unit.
 */
function TallUnit({ width, variant, style }) {
  const option =
    tallUnitStyles[variant].find((s) => s.id === style) ?? nullStyle
  return <Cabinet {...option.props} carcassInnerWidth={width / 1000 - 0.036} />
}
