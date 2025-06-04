import { forwardRef, useContext, useMemo, useRef, useState } from 'react'
import { DragControls } from '@react-three/drei'
import { Matrix4, Vector3, Vector2, Shape, Box3 } from 'three'
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
  const { is3D } = useAppState()
  const [model, dispatch] = useContext(ModelContext)
  const [dragging, setDragging] = useState(false)
  const info = useRef()
  const otherUnits = useRef([])
  const lastValidPosition = useRef(null)
  const ghostColor = useRef('#20ff20')

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
            <meshStandardMaterial color={ghostColor.current} />
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
                  color='#4080bf'
                  transparent
                  opacity={0.6}
                />
              </mesh>
              <mesh rotation-x={Math.PI / -2} position-y={0.001}>
                <shapeGeometry args={[crossMove]} />
                <meshStandardMaterial color='#ffffff' />
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
                <meshStandardMaterial color='#004088' />
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
   * Calculates the four corners of a unit.
   */
  function getCorners(unit, position = unit.pos, rot = unit.rotation) {
    // Ensure position is a Vector3
    const pos =
      position instanceof Vector3
        ? position.clone()
        : new Vector3(position.x, 0, position.z)

    let w = unit.width / 1000
    if (unit.type === 'base' && unit.style?.includes('corner')) {
      const offset = unit.style?.includes('left') ? -0.1475 : 0.1475
      w += 0.295
      pos.add(new Vector3(offset, 0, 0).applyAxisAngle(vectorY, rot))
    }
    const d = unit.depth / 1000
    return [
      new Vector3(-w / 2, 0, d / 2), // front left
      new Vector3(-w / 2, 0, -d / 2), // back left
      new Vector3(w / 2, 0, -d / 2), // back right
      new Vector3(w / 2, 0, d / 2) // front right
    ].map((p) => p.applyAxisAngle(vectorY, rot).add(pos))
  }

  /**
   * Calculates the axis-aligned bounding box for a unit at a given position and rotation.
   */
  function getUnitBoundingBox(unit, position = unit.pos, rot = unit.rotation) {
    const corners = getCorners(unit, position, rot)
    const box = new Box3()

    // Add bottom corners
    corners.forEach((corner) => {
      box.expandByPoint(corner)
    })

    // Add top corners to account for height
    const unitHeight = unit.height / 1000
    corners.forEach((corner) => {
      const topCorner = corner.clone()
      topCorner.y = unitHeight
      box.expandByPoint(topCorner)
    })

    return box
  }

  /**
   * Checks if two units' actual shapes collide using SAT (Separating Axis Theorem)
   */
  function checkUnitCollision(unit1Corners, unit2Corners) {
    // Get the 2D projections (x,z) of the corners for both units
    const poly1 = unit1Corners.map((c) => new Vector2(c.x, c.z))
    const poly2 = unit2Corners.map((c) => new Vector2(c.x, c.z))

    // Check using SAT - test all edges as potential separating axes
    const edges = []

    // Get edges from both polygons
    for (let i = 0; i < poly1.length; i++) {
      const next = (i + 1) % poly1.length
      const edge = new Vector2().subVectors(poly1[next], poly1[i])
      // Get perpendicular (normal) to edge
      edges.push(new Vector2(-edge.y, edge.x).normalize())
    }

    for (let i = 0; i < poly2.length; i++) {
      const next = (i + 1) % poly2.length
      const edge = new Vector2().subVectors(poly2[next], poly2[i])
      edges.push(new Vector2(-edge.y, edge.x).normalize())
    }

    // Test each potential separating axis
    for (const axis of edges) {
      // Project both polygons onto this axis
      let min1 = Infinity,
        max1 = -Infinity
      let min2 = Infinity,
        max2 = -Infinity

      for (const point of poly1) {
        const projection = point.dot(axis)
        min1 = Math.min(min1, projection)
        max1 = Math.max(max1, projection)
      }

      for (const point of poly2) {
        const projection = point.dot(axis)
        min2 = Math.min(min2, projection)
        max2 = Math.max(max2, projection)
      }

      // Check if projections overlap (with small tolerance to allow touching)
      const tolerance = 0.001
      if (max1 < min2 + tolerance || max2 < min1 + tolerance) {
        // Found a separating axis - no collision
        return false
      }
    }

    // No separating axis found - collision detected
    return true
  }

  /**
   * Callback for 'drag start' event.
   */
  function startDrag() {
    // Store other units for collision detection
    otherUnits.current = model.units.filter((u) => u.id !== id)

    // Store current position as last valid
    lastValidPosition.current = {
      pos: new Vector3(pos.x, pos.y, pos.z),
      rotation
    }
    ghostColor.current = '#20ff20'

    setDragging(true)
    onDrag(true)
  }

  /**
   * Binary search to find the closest valid position along a movement vector
   */
  function findClosestValidPosition(fromPos, toPos, unit, iterations = 10) {
    let validPos = fromPos.clone()
    let invalidPos = toPos.clone()

    // Binary search for the boundary
    for (let i = 0; i < iterations; i++) {
      const midPos = new Vector3().lerpVectors(validPos, invalidPos, 0.5)

      // Check collision at midpoint
      const corners = getCorners(unit, midPos, unit.rotation)
      let hasCollision = false

      for (const otherUnit of otherUnits.current) {
        const otherBox = getUnitBoundingBox(otherUnit)
        const myBox = getUnitBoundingBox(unit, midPos, unit.rotation)

        if (!myBox.intersectsBox(otherBox)) continue

        const otherCorners = getCorners(otherUnit)
        if (checkUnitCollision(corners, otherCorners)) {
          hasCollision = true
          break
        }
      }

      if (hasCollision) {
        invalidPos = midPos
      } else {
        validPos = midPos
      }
    }

    // Back off slightly from the exact collision point
    const direction = new Vector3().subVectors(validPos, invalidPos).normalize()
    return validPos.add(direction.multiplyScalar(0.001))
  }

  /**
   * Callback for 'drag' event. Updates the position of the unit.
   */
  function moveUnit(lm) {
    let newPos = new Vector3().setFromMatrixPosition(lm).add(handle)

    // Get corners of current unit at new position
    const currentUnit = {
      width: width,
      depth: depth,
      height: height,
      type: type,
      style: style,
      pos: newPos,
      rotation: ry
    }

    const myCorners = getCorners(currentUnit, newPos, ry)
    let hasCollision = false

    // First do a quick AABB check for performance
    const myBox = getUnitBoundingBox(currentUnit, newPos, ry)

    for (const otherUnit of otherUnits.current) {
      // Quick AABB check first
      const otherBox = getUnitBoundingBox(otherUnit)

      // If AABBs don't intersect, no need for detailed check
      if (!myBox.intersectsBox(otherBox)) {
        continue
      }

      // AABBs intersect, do detailed polygon collision check
      const otherCorners = getCorners(otherUnit)

      if (checkUnitCollision(myCorners, otherCorners)) {
        hasCollision = true
        break
      }
    }

    // Update ghost color based on collision state
    ghostColor.current = hasCollision ? '#ff2020' : '#20ff20'

    // Handle position update
    if (!hasCollision) {
      // No collision - update normally
      lastValidPosition.current = {
        pos: new Vector3(newPos.x, newPos.y, newPos.z),
        rotation: ry
      }
      dispatch({ id: 'moveUnit', unit: id, pos: newPos, rotation: ry })

      const { x, z } = newPos
      matrix.copy(lm)
      mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
    } else {
      // Collision detected - find closest valid position
      if (lastValidPosition.current) {
        const closestValid = findClosestValidPosition(
          lastValidPosition.current.pos,
          newPos,
          currentUnit
        )

        lastValidPosition.current = { pos: closestValid, rotation: ry }
        dispatch({ id: 'moveUnit', unit: id, pos: closestValid, rotation: ry })

        const { x, z } = closestValid
        matrix.copy(lm)
        mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
      }
    }
  }

  /**
   * Handles the rotation of the unit when dragging the handle.
   */
  function rotateUnit(lm) {
    // Get the current position of the handle, relative to the centre of the unit.
    const t = new Matrix4().makeRotationY(ry)
    const v = new Vector3(0.2, 0, 0).applyMatrix4(t)
    const { x, z } = new Vector3().setFromMatrixPosition(lm).add(v)

    // Calculate the new position of the handle, relative to the centre of the unit.
    let theta = Math.atan2(z, x)
    const px = 0.2 * Math.cos(theta)
    const pz = 0.2 * Math.sin(theta)

    // Snap rotation to 90 degree increments.
    const snap = Math.round(theta / (Math.PI / 2)) * (Math.PI / 2)
    if (Math.abs(snap - theta) < 0.1) theta = snap

    // Check if rotation would cause collision
    const myCorners = getCorners(
      { width, depth, height, type, style },
      pos,
      -theta
    )
    let hasCollision = false

    // Quick AABB check first
    const myBox = getUnitBoundingBox(
      { width, depth, height, type, style },
      pos,
      -theta
    )

    for (const otherUnit of otherUnits.current) {
      const otherBox = getUnitBoundingBox(otherUnit)

      // If AABBs don't intersect, skip detailed check
      if (!myBox.intersectsBox(otherBox)) {
        continue
      }

      // Do detailed collision check
      const otherCorners = getCorners(otherUnit)
      if (checkUnitCollision(myCorners, otherCorners)) {
        hasCollision = true
        break
      }
    }

    // Update ghost color
    ghostColor.current = hasCollision ? '#ff2020' : '#20ff20'

    // Only update rotation if no collision
    if (!hasCollision) {
      lastValidPosition.current.rotation = -theta
      dispatch({ id: 'moveUnit', unit: id, pos, rotation: -theta })
      // Update the position of the handle.
      mrotate.makeTranslation(px - v.x, 0, pz - v.z)
    }
  }

  /**
   * Callback for 'drag end' event.
   */
  function endDrag() {
    otherUnits.current = []
    lastValidPosition.current = null
    ghostColor.current = '#20ff20'
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
        {style && <img src={image} alt='' className='w-28' />}
        <div>
          <p>
            Item: {type} {props.variant?.toLowerCase()}
          </p>
          {style && <p>Style: {style.title}</p>}
          <p>Width: {props.width}mm</p>
        </div>
      </div>
      <p className='text-right'>
        <button onClick={deleteItem}>
          <img src={ic_delete.src} alt='Delete' className='size-4' />
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
