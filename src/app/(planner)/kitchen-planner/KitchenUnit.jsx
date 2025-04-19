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

import ic_delete from '@/assets/icons/trash.svg'

import { hoverMaterial } from '@/materials'

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

  const size = new Vector3(
    width / 1000 + 0.14,
    height / 1000 + 0.2,
    depth / 1000 + 0.03
  )
  if (type === 'base' && style.includes('corner')) size.x += 0.295

  const showHandle = !is3D && hover?.type === 'unit' && hover.id === id

  const [handle, matrix, mrotate, ry] = useMemo(() => {
    return [{ ...pos }, new Matrix4(), new Matrix4(), rotation]
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
   * Callback for 'drag start' event.
   */
  function startDrag() {
    setDragging(true)
    onDrag(true)
  }

  /**
   * Callback for 'drag' event. Updates the position of the unit, snapping to
   * the nearest wall (if close enough).
   */
  function moveUnit(lm) {
    const wrap = (a, n, s) => (s ? a[n] : a[(n + a.length) % a.length])
    let { x, z } = new Vector3().setFromMatrixPosition(lm).add(handle)
    let rotation = ry

    // Find all walls where distance from centre of unit is within snap radius.
    const snapable = model.walls.flat().reduce((list, pt, n) => {
      const s = pt.segment
      const end = wrap(model.walls[s], n + 1, s)
      if (!end) return list
      const len2 = (end.x - pt.x) ** 2 + (end.z - pt.z) ** 2
      if (len2 === 0) return list // wall zero length
      const dot =
        ((x - pt.x) * (end.x - pt.x) + (z - pt.z) * (end.z - pt.z)) / len2
      if (dot < 0 || dot > 1) return list // projection outside wall
      const xx = pt.x + dot * (end.x - pt.x)
      const zz = pt.z + dot * (end.z - pt.z)
      const d2 = (x - xx) ** 2 + (z - zz) ** 2
      if (d2 < 0.3) list.push({ n, s, d2, xx, zz })
      return list
    }, [])

    // If we found a wall to snap to then xx and zz are the perpendicular
    // projection to the centre line of the wall. Use this to calculate
    // an offset that puts the unit right against the wall.
    if (snapable.length > 0) {
      const dMin = Math.min(...snapable.map((s) => s.d2))
      const { n, s, xx, zz } = snapable.find((s) => s.d2 === dMin) ?? {}
      const start = model.walls[s][n]
      const end = wrap(model.walls[s], n + 1, s)
      const theta = Math.atan2(end.x - start.x, end.z - start.z)
      rotation = theta - Math.PI / 2
      x = xx - ((size.z + wt - 0.025) / 2) * Math.cos(theta)
      z = zz + ((size.z + wt - 0.025) / 2) * Math.sin(theta)
    }

    // Now work out whether any other unit is close enough to snap. We do this
    // by finding the distances between 'attachment points' on on the object
    // being moved and the centre point of candidates for snapping.
    const dx = (size.x / 2) * Math.cos(rotation)
    const dz = (size.x / 2) * Math.sin(rotation)
    const dl = (size.z / 2) * Math.sin(rotation)
    const dr = (size.z / 2) * Math.cos(rotation)
    const ap = [
      new Vector3(x - dx, 0, z - dz), // left
      new Vector3(x + dx, 0, z + dz), // right
      new Vector3(x - dl, 0, z - dr) // rear
    ]
    for (const unit of model.units) {
      if (
        unit.id === id ||
        (unit.type === 'wall' && type === 'base') ||
        (type === 'wall' && unit.type === 'base')
      )
        continue
      const diag = (unit.width * unit.depth) / 4000000
      const p = ap.findIndex((p) => p.distanceToSquared(unit.pos) < diag)
      if (p < 0) continue
      const ux =
        unit.width / 1000 +
        (unit.type === 'base' && unit.style.includes('corner'))
          ? 0.595
          : 0
      const uz = unit.depth / 1000
      switch (p) {
        case 0: // left
          rotation = unit.rotation
          x = unit.pos.x + ((ux + size.x) * Math.cos(rotation)) / 2
          z = unit.pos.z + ((ux + size.x) * Math.sin(rotation)) / 2
          break
        case 1: // right
          rotation = unit.rotation
          x = unit.pos.x - ((ux + size.x) * Math.cos(rotation)) / 2
          z = unit.pos.z - ((ux + size.x) * Math.sin(rotation)) / 2
          break
        default: // back
          rotation = unit.rotation + Math.PI
          x = unit.pos.x - ((uz + size.z) * Math.sin(unit.rotation)) / 2
          z = unit.pos.z - ((uz + size.z) * Math.cos(unit.rotation)) / 2
      }
    }

    // Update unit position and rotation
    dispatch({ id: 'moveUnit', unit: id, pos: new Vector3(x, 0, z), rotation })

    matrix.makeTranslation(x - handle.x, 0, z - handle.z)
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
