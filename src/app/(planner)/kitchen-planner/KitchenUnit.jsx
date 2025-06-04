import { forwardRef, useContext, useMemo, useRef, useState } from 'react'
import { DragControls } from '@react-three/drei'
import { Matrix4, Vector3, Vector2, Shape } from 'three'
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

  const size = new Vector3(width / 1000, height / 1000, depth / 1000)
  if (type === 'base' && style?.includes('corner')) size.x += 0.295

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
            position={[pos.x, size.y + 0.08, pos.z]}
            rotation-x={Math.PI / -2}
            rotation-z={rotation}
          >
            <planeGeometry args={[size.x, size.z]} />
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
              position={[handle.x, size.y + 0.1, handle.z]}
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
              position={[handle.x, size.y + 0.1, handle.z]}
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
      (type === 'base' ||
        unit.type === 'wall' ||
        (type === 'wall' && unit.type === 'base'))
    )
  }

  /**
   * Calculates the four corners of a unit.
   */
  function getCorners(unit) {
    const pos = new Vector3(unit.pos.x, 0, unit.pos.z)
    let w = unit.width / 1000
    if (unit.type === 'base' && unit.style?.includes('corner')) {
      const offset = unit.style?.includes('left') ? -0.1475 : 0.1475
      w += 0.295
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
   * Calculate the shortest distance between two edges, a and b.
   */
  function edgeDistance(a, b) {
    const { start: a1, end: a2 } = a
    const { start: b1, end: b2 } = b
    function pointToSegment([px, pz], [sx, sz], [ex, ez]) {
      const dx = ex - sx
      const dz = ez - sz
      if (dx === 0 && dz === 0) return Math.hypot(px - sx, pz - sz)
      const t = Math.max(
        0,
        Math.min(1, ((px - sx) * dx + (pz - sz) * dz) / (dx * dx + dz * dz))
      )
      const projX = sx + t * dx
      const projZ = sz + t * dz
      return Math.hypot(px - projX, pz - projZ)
    }
    return Math.min(
      pointToSegment(a1, b1, b2),
      pointToSegment(a2, b1, b2),
      pointToSegment(b1, a1, a2),
      pointToSegment(b2, a1, a2)
    )
  }

  /**
   * Callback for 'drag start' event. Calculate the corners and edges of all
   * units and set the dragging state to true. Only keep the first three
   * edges of each unit, as we don't snap to front.
   */
  function startDrag() {
    allEdges.current = model.units
      .filter((u) => canSnap(u))
      .map((u) => getEdges(u.id, getCorners(u)).slice(0, 3))
      .flat()
    setDragging(true)
    onDrag(true)
  }

  /**
   * Callback for 'drag' event. Updates the position of the unit, snapping to
   * the nearest wall (if close enough).
   */
  function moveUnit(lm) {
    const snap = wt * wt
    const wrap = (a, n, s) => (s ? a[n] : a[(n + a.length) % a.length])
    const normalise = (r) => (r < Math.PI ? r : r - Math.PI * 2)
    let newPos = new Vector3().setFromMatrixPosition(lm).add(handle)
    let rotation = ry

    // Get the four corners of the unit.
    let myCorners = [
      new Vector3(-size.x / 2, 0, size.z / 2), // front left
      new Vector3(-size.x / 2, 0, -size.z / 2), // back left
      new Vector3(size.x / 2, 0, -size.z / 2), // back right
      new Vector3(size.x / 2, 0, size.z / 2) // front right
    ].map((p) => p.applyAxisAngle(vectorY, rotation).add(newPos))

    // Find all walls where any corner of the current unit is within snap
    // radius.
    const snapable = model.walls.flat().reduce((list, pt, n) => {
      const s = pt.segment
      const end = wrap(model.walls[s], n + 1, s)
      if (!end) return list
      const len2 = (end.x - pt.x) ** 2 + (end.z - pt.z) ** 2
      if (len2 === 0) return list // wall zero length
      for (const corner of myCorners) {
        const { x: cx, z: cz } = corner
        // Get distance of corner to wall segment.
        const dot =
          ((cx - pt.x) * (end.x - pt.x) + (cz - pt.z) * (end.z - pt.z)) / len2
        if (dot < 0 || dot > 1) return list // projection outside wall
        const xx = pt.x + dot * (end.x - pt.x)
        const zz = pt.z + dot * (end.z - pt.z)
        const d2 = (cx - xx) ** 2 + (cz - zz) ** 2
        if (d2 < snap) {
          list.push({ n, s, d2, len2 })
          break // only need one corner to snap
        }
      }
      return list
    }, [])

    // If we found a wall to snap to then we need to find the perpendicular
    // projection from the centre of the unit to the centre line of the wall.
    // We then use this to calculate an offset that puts the unit right
    // against the wall.
    if (snapable.length > 0) {
      const dMin = Math.min(...snapable.map((s) => s.d2))
      const { n, s, len2 } = snapable.find((s) => s.d2 === dMin) ?? {}
      const pt = model.walls[s][n]
      const end = wrap(model.walls[s], n + 1, s)
      const { x: cx, z: cz } = newPos
      const dot =
        ((cx - pt.x) * (end.x - pt.x) + (cz - pt.z) * (end.z - pt.z)) / len2
      const xx = pt.x + dot * (end.x - pt.x)
      const zz = pt.z + dot * (end.z - pt.z)
      const theta = Math.atan2(end.x - pt.x, end.z - pt.z)
      rotation = theta - Math.PI / 2
      newPos = new Vector3(
        xx - ((size.z + wt) / 2) * Math.cos(theta),
        0,
        zz + ((size.z + wt) / 2) * Math.sin(theta)
      )
      // Recalculate corners based on new position and rotation.
      myCorners = [
        new Vector3(-size.x / 2, 0, size.z / 2),
        new Vector3(-size.x / 2, 0, -size.z / 2),
        new Vector3(size.x / 2, 0, -size.z / 2),
        new Vector3(size.x / 2, 0, size.z / 2)
      ].map((p) => p.applyAxisAngle(vectorY, rotation).add(newPos))
    }

    // Now work out whether any other unit is close enough to snap. We do this
    // by finding the closest distance between any edge of the current unit and
    // any edge of any other (compatible) unit.
    let minDist = wt // minimum distance to snap
    let snapTo = null

    const edges = getEdges(id, myCorners)
    for (const edgeA of edges) {
      for (const edgeB of allEdges.current) {
        const dist = edgeDistance(edgeA, edgeB)
        if (minDist > 0.0001 && dist < minDist) {
          minDist = dist
          snapTo = edgeB
        }
      }
    }

    // If we found a snap, then calculate new position and rotation
    // to match the snap.
    if (snapTo) {
      const target = model.units.find((u) => u.id === snapTo.id)
      let dx = target.width / 2000 + size.x / 2
      if (target.type === 'base' && target.style?.includes('corner'))
        dx += 0.295
      const dz = target.depth / 2000 + size.z / 2
      const dd = target.depth / 2000 - size.z / 2
      // console.log('Snap to', ['left', 'back', 'right'][snapTo.side], minDist)
      switch (snapTo.side) {
        case 0: // left edge
          rotation = target.rotation
          newPos = new Vector3(-dx, 0, dd)
            .applyAxisAngle(vectorY, rotation)
            .add(target.pos)
          break
        case 1: // back edge
          rotation = normalise(target.rotation + Math.PI)
          newPos = new Vector3(0, 0, dz)
            .applyAxisAngle(vectorY, rotation)
            .add(target.pos)
          break
        case 2: // right edge
          rotation = target.rotation
          newPos = new Vector3(dx, 0, dd)
            .applyAxisAngle(vectorY, rotation)
            .add(target.pos)
          break
      }
    }

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
