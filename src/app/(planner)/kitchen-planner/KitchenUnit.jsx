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
  const slidingState = useRef(null) // Track active sliding

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

  /**
   * Converts wall segments into line segments for collision detection
   */
  function getWallSegments(walls) {
    console.log('🏠 Processing walls:', walls)
    const segments = []

    // Process each wall segment (outer walls and inner walls)
    walls.forEach((wallSegment, segmentIndex) => {
      console.log(`📐 Processing wall segment ${segmentIndex}:`, wallSegment)

      for (let i = 0; i < wallSegment.length; i++) {
        const start = wallSegment[i]
        const end = wallSegment[(i + 1) % wallSegment.length]

        const segment = {
          start: new Vector3(start.x, 0, start.z),
          end: new Vector3(end.x, 0, end.z),
          wallId: start.id,
          segment: start.segment
        }

        console.log(
          `  📏 Wall segment ${i}: from (${start.x}, ${start.z}) to (${end.x}, ${end.z})`
        )
        segments.push(segment)
      }
    })

    console.log('📋 Total wall segments created:', segments.length)
    return segments
  }

  /**
   * Check if unit collides with walls (accounting for wall thickness)
   */
  function checkWallCollision(unitCorners, wallSegments) {
    console.log(
      '🔍 Checking wall collision for unit corners:',
      unitCorners.map((c) => `(${c.x.toFixed(2)}, ${c.z.toFixed(2)})`)
    )

    const unitPoly = unitCorners.map((c) => new Vector2(c.x, c.z))

    for (let i = 0; i < wallSegments.length; i++) {
      const segment = wallSegments[i]
      const wallStart = new Vector2(segment.start.x, segment.start.z)
      const wallEnd = new Vector2(segment.end.x, segment.end.z)

      console.log(`  🧱 Testing wall segment ${i}`)

      // Calculate wall properties
      const wallVector = new Vector2().subVectors(wallEnd, wallStart)
      const wallLength = wallVector.length()
      const wallDir = wallVector.clone().normalize()
      const wallNormal = new Vector2(-wallVector.y, wallVector.x).normalize()

      // Wall thickness
      const wallThickness = 0.1 // 10cm thick walls
      const halfThickness = wallThickness / 2

      // Calculate the inside face of the wall (room-facing surface)
      const insideFaceStart = wallStart
        .clone()
        .add(wallNormal.clone().multiplyScalar(halfThickness))
      const insideFaceEnd = wallEnd
        .clone()
        .add(wallNormal.clone().multiplyScalar(halfThickness))

      console.log(
        `    📐 Wall center: (${wallStart.x.toFixed(2)}, ${wallStart.y.toFixed(
          2
        )}) to (${wallEnd.x.toFixed(2)}, ${wallEnd.y.toFixed(2)})`
      )
      console.log(
        `    📐 Inside face: (${insideFaceStart.x.toFixed(
          2
        )}, ${insideFaceStart.y.toFixed(2)}) to (${insideFaceEnd.x.toFixed(
          2
        )}, ${insideFaceEnd.y.toFixed(2)})`
      )

      // Check each unit corner against the inside face of the wall
      for (let j = 0; j < unitPoly.length; j++) {
        const corner = unitPoly[j]

        // Calculate the closest point on the inside face line segment
        const toCorner = new Vector2().subVectors(corner, insideFaceStart)
        const projectionLength = toCorner.dot(wallDir)

        // Clamp projection to wall segment bounds
        const clampedProjection = Math.max(
          0,
          Math.min(wallLength, projectionLength)
        )
        const closestPointOnInsideFace = insideFaceStart
          .clone()
          .add(wallDir.clone().multiplyScalar(clampedProjection))

        // Calculate SIGNED distance (negative = inside wall, positive = outside wall)
        const vectorToCorner = new Vector2().subVectors(
          corner,
          closestPointOnInsideFace
        )
        const signedDistance = vectorToCorner.dot(wallNormal)

        console.log(
          `    🔹 Corner ${j}: signed distance=${signedDistance.toFixed(
            3
          )} (negative=inside wall)`
        )

        // Collision occurs if corner is inside the wall OR very close to the inside face
        const collisionThreshold = 0.02 // 2cm safety margin
        if (signedDistance < collisionThreshold) {
          console.log(
            '❌ COLLISION DETECTED - corner inside or too close to wall'
          )
          return {
            collides: true,
            segment: segment,
            wallId: segment.wallId,
            insideFace: { start: insideFaceStart, end: insideFaceEnd },
            penetrationDepth: Math.abs(Math.min(0, signedDistance)) // How far inside the wall
          }
        }
      }
    }

    console.log('✅ No wall collision detected')
    return { collides: false }
  }

  /**
   * Enhanced collision detection that can detect multiple collision types simultaneously
   */
  function detectAllCollisions(unitCorners, unit, wallSegments, otherUnits) {
    console.log('🔍 COMPREHENSIVE collision detection')

    const collisions = {
      walls: [],
      units: [],
      hasAnyCollision: false
    }

    // Check ALL wall collisions (not just first one)
    for (let i = 0; i < wallSegments.length; i++) {
      const wallCollision = checkWallCollision(unitCorners, [wallSegments[i]])
      if (wallCollision.collides) {
        console.log(
          `❌ Wall collision detected: wall ${wallSegments[i].wallId}`
        )
        collisions.walls.push({
          wallId: wallSegments[i].wallId,
          segment: wallSegments[i],
          collision: wallCollision
        })
        collisions.hasAnyCollision = true
      }
    }

    // Check ALL unit collisions (regardless of wall collisions)
    const myBox = getUnitBoundingBox(unit, unit.pos, unit.rotation)

    for (const otherUnit of otherUnits) {
      const otherBox = getUnitBoundingBox(otherUnit)
      if (!myBox.intersectsBox(otherBox)) continue

      const otherCorners = getCorners(otherUnit)
      if (checkUnitCollision(unitCorners, otherCorners)) {
        console.log(`❌ Unit collision detected: unit ${otherUnit.id}`)
        collisions.units.push({
          unitId: otherUnit.id,
          unit: otherUnit,
          corners: otherCorners
        })
        collisions.hasAnyCollision = true
      }
    }

    console.log(
      `🎯 Collision summary: ${collisions.walls.length} walls, ${collisions.units.length} units`
    )
    return collisions
  }

  /**
   * Enhanced binary search that handles multiple collision types
   */
  function findClosestValidPositionMultiCollision(
    fromPos,
    toPos,
    unit,
    wallSegments,
    otherUnits,
    iterations = 12
  ) {
    console.log('🔍 MULTI-COLLISION BINARY SEARCH')
    console.log(`   From: (${fromPos.x.toFixed(3)}, ${fromPos.z.toFixed(3)})`)
    console.log(`   To: (${toPos.x.toFixed(3)}, ${toPos.z.toFixed(3)})`)

    let validPos = fromPos.clone()
    let invalidPos = toPos.clone()

    const targetPrecision = 0.001 // 1mm precision

    for (let i = 0; i < iterations; i++) {
      const midPos = new Vector3().lerpVectors(validPos, invalidPos, 0.5)
      console.log(
        `   Iteration ${i + 1}: Testing (${midPos.x.toFixed(
          4
        )}, ${midPos.z.toFixed(4)})`
      )

      // Check ALL collision types at this position
      const testUnit = { ...unit, pos: midPos }
      const corners = getCorners(testUnit, midPos, unit.rotation)
      const collisions = detectAllCollisions(
        corners,
        testUnit,
        wallSegments,
        otherUnits
      )

      if (collisions.hasAnyCollision) {
        console.log(
          `     ❌ Collision: ${collisions.walls.length} walls + ${collisions.units.length} units`
        )
        invalidPos = midPos
      } else {
        console.log(`     ✅ Valid: no collisions`)
        validPos = midPos
      }

      const distance = validPos.distanceTo(invalidPos)
      console.log(`     → Boundary distance: ${distance.toFixed(5)}`)

      if (distance < targetPrecision) {
        console.log(`     → Converged at iteration ${i + 1}`)
        break
      }
    }

    const direction = new Vector3().subVectors(validPos, invalidPos).normalize()
    const finalPos = validPos.add(direction.multiplyScalar(0.001))

    console.log(
      `🎯 MULTI-COLLISION RESULT: (${finalPos.x.toFixed(
        4
      )}, ${finalPos.z.toFixed(4)})`
    )
    return finalPos
  }

  /**
   * Find wall collision edge for sliding (using inside face)
   */
  function findWallCollisionEdge(unit, targetPos, currentPos, wallSegments) {
    console.log('🔍 findWallCollisionEdge called')
    const corners = getCorners(unit, targetPos, unit.rotation)
    const currentCorners = getCorners(unit, currentPos, unit.rotation)
    let bestEdge = null
    let minDistance = Infinity

    const wallThickness = 0.1
    const halfThickness = wallThickness / 2

    for (const wallSegment of wallSegments) {
      const wallCollision = checkWallCollision(corners, [wallSegment])
      if (!wallCollision.collides) continue

      // Calculate wall properties
      const wallStart = new Vector2(wallSegment.start.x, wallSegment.start.z)
      const wallEnd = new Vector2(wallSegment.end.x, wallSegment.end.z)
      const wallVector = new Vector2().subVectors(wallEnd, wallStart)
      const wallDir = wallVector.clone().normalize()
      const wallNormal = new Vector2(-wallVector.y, wallVector.x).normalize()

      // Use the inside face for sliding calculations
      const insideFaceStart = wallStart
        .clone()
        .add(wallNormal.clone().multiplyScalar(halfThickness))
      const insideFaceEnd = wallEnd
        .clone()
        .add(wallNormal.clone().multiplyScalar(halfThickness))

      // Convert back to Vector3 for sliding calculations
      const insideFaceStart3D = new Vector3(
        insideFaceStart.x,
        0,
        insideFaceStart.y
      )
      const insideFaceEnd3D = new Vector3(insideFaceEnd.x, 0, insideFaceEnd.y)
      const wallDir3D = new Vector3(wallDir.x, 0, wallDir.y)
      const wallNormal3D = new Vector3(wallNormal.x, 0, wallNormal.y)

      // Calculate average distance from current corners to this inside face
      let totalDist = 0
      for (const corner of currentCorners) {
        const toStart = new Vector3().subVectors(corner, insideFaceStart3D)
        const projection = toStart.dot(wallDir3D)
        const wallLength = wallVector.length()
        const clamped = Math.max(0, Math.min(wallLength, projection))
        const closestPoint = insideFaceStart3D
          .clone()
          .add(wallDir3D.clone().multiplyScalar(clamped))
        const dist = corner.distanceTo(closestPoint)
        totalDist += dist
      }
      const avgDist = totalDist / currentCorners.length

      if (avgDist < minDistance) {
        minDistance = avgDist

        // Determine which side of the wall the unit is on
        const toCenter = new Vector3().subVectors(currentPos, insideFaceStart3D)
        const normal =
          toCenter.dot(wallNormal3D) > 0 ? wallNormal3D : wallNormal3D.negate()

        // Calculate the current distance to maintain (from inside face)
        const centerToWall = new Vector3().subVectors(
          currentPos,
          insideFaceStart3D
        )
        const currentDistance = Math.abs(centerToWall.dot(normal))

        bestEdge = {
          start: insideFaceStart3D,
          end: insideFaceEnd3D,
          direction: wallDir3D,
          normal: normal,
          wallId: wallSegment.wallId,
          isWall: true,
          maintainDistance: currentDistance
        }
      }
    }

    console.log('🎯 Best wall edge found:', bestEdge)
    return bestEdge
  }

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
   * Find the collision edge and normal for sliding
   */
  function findCollisionEdge(unit, targetPos, currentPos) {
    const corners = getCorners(unit, targetPos, unit.rotation)
    const currentCorners = getCorners(unit, currentPos, unit.rotation)
    let bestEdge = null
    let minDistance = Infinity

    for (const otherUnit of otherUnits.current) {
      const otherBox = getUnitBoundingBox(otherUnit)
      const myBox = getUnitBoundingBox(unit, targetPos, unit.rotation)

      if (!myBox.intersectsBox(otherBox)) continue

      const otherCorners = getCorners(otherUnit)
      if (!checkUnitCollision(corners, otherCorners)) continue

      // Find the closest edge
      for (let i = 0; i < otherCorners.length; i++) {
        const start = otherCorners[i]
        const end = otherCorners[(i + 1) % otherCorners.length]
        const edge = new Vector3().subVectors(end, start)
        const edgeDir = edge.clone().normalize()
        const edgeNormal = new Vector3(edge.z, 0, -edge.x).normalize()

        // Calculate average distance from our CURRENT corners to this edge
        let totalDist = 0
        let closestDist = Infinity
        for (const corner of currentCorners) {
          const toStart = new Vector3().subVectors(corner, start)
          const projection = toStart.dot(edgeDir)
          const clamped = Math.max(0, Math.min(edge.length(), projection))
          const closestPoint = start
            .clone()
            .add(edgeDir.clone().multiplyScalar(clamped))
          const dist = corner.distanceTo(closestPoint)
          totalDist += dist
          closestDist = Math.min(closestDist, dist)
        }
        const avgDist = totalDist / currentCorners.length

        if (avgDist < minDistance) {
          minDistance = avgDist
          const otherCenter = new Vector3(otherUnit.pos.x, 0, otherUnit.pos.z)
          const toCenter = new Vector3().subVectors(currentPos, otherCenter)
          const normal =
            toCenter.dot(edgeNormal) > 0 ? edgeNormal : edgeNormal.negate()

          // Calculate the actual current distance to maintain
          const centerToEdge = new Vector3().subVectors(currentPos, start)
          const currentDistance = Math.abs(centerToEdge.dot(normal))

          bestEdge = {
            start: start,
            end: end,
            direction: edgeDir,
            normal: normal,
            unitId: otherUnit.id,
            maintainDistance: currentDistance // Store the distance at collision time
          }
        }
      }
    }

    return bestEdge
  }

  /**
   * Enhanced moveUnit with simultaneous wall + cabinet collision detection
   */
  function moveUnit(lm) {
    console.log('🚀 moveUnit called - MULTI-COLLISION detection!')

    let newPos = new Vector3().setFromMatrixPosition(lm).add(handle)
    const prevPos = lastValidPosition.current
      ? lastValidPosition.current.pos
      : pos

    console.log('📍 Moving from:', prevPos, 'to:', newPos)

    const wallSegments = getWallSegments(model.walls)
    if (wallSegments.length === 0) {
      console.log('⚠️ No wall segments found!')
      return
    }

    const currentUnit = {
      width: width,
      depth: depth,
      height: height,
      type: type,
      style: style,
      pos: newPos,
      rotation: ry
    }

    // COMPREHENSIVE collision detection at target position
    const myCorners = getCorners(currentUnit, newPos, ry)
    const collisions = detectAllCollisions(
      myCorners,
      currentUnit,
      wallSegments,
      otherUnits.current
    )

    if (!collisions.hasAnyCollision) {
      console.log('✅ No collisions - moving freely')
      // No collision - move freely
      ghostColor.current = '#20ff20'
      slidingState.current = null

      lastValidPosition.current = { pos: newPos.clone(), rotation: ry }
      dispatch({ id: 'moveUnit', unit: id, pos: newPos, rotation: ry })

      const { x, z } = newPos
      matrix.copy(lm)
      mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
    } else {
      console.log(
        `❌ MULTI-COLLISION detected: ${collisions.walls.length} walls + ${collisions.units.length} units`
      )
      ghostColor.current = '#ff2020'

      // If we're not already sliding, find the collision edge
      if (!slidingState.current) {
        console.log(
          '🔍 Not sliding yet - initiating MULTI-COLLISION binary search...'
        )

        // Use enhanced binary search that handles multiple collision types
        const exactCollisionPos = findClosestValidPositionMultiCollision(
          prevPos,
          newPos,
          currentUnit,
          wallSegments,
          otherUnits.current
        )

        console.log(
          '🎯 Multi-collision binary search completed, finding collision edge...'
        )

        // SIMPLIFIED: check collisions and pick the first viable edge
        let edge = null

        // Try wall edge first (walls take priority)
        edge = findWallCollisionEdge(
          currentUnit,
          newPos,
          exactCollisionPos,
          wallSegments
        )
        if (edge) {
          edge.isWall = true
          console.log('🎯 Using wall edge for sliding')
        } else {
          // Fall back to unit edge
          edge = findCollisionEdge(currentUnit, newPos, exactCollisionPos)
          if (edge) {
            console.log('🎯 Using unit edge for sliding')
          }
        }

        if (edge) {
          console.log(`🎯 Setting up sliding state`)
          const centerToEdge = new Vector3().subVectors(
            exactCollisionPos,
            edge.start
          )
          edge.maintainDistance = Math.abs(centerToEdge.dot(edge.normal))
          slidingState.current = edge

          // Position at the precise collision point
          lastValidPosition.current = { pos: exactCollisionPos, rotation: ry }
          dispatch({
            id: 'moveUnit',
            unit: id,
            pos: exactCollisionPos,
            rotation: ry
          })

          const { x, z } = exactCollisionPos
          matrix.copy(lm)
          mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
          return
        }
      }

      if (slidingState.current) {
        console.log('🏄 Sliding with MULTI-COLLISION validation...')
        // Project movement onto sliding direction
        const movement = new Vector3().subVectors(newPos, prevPos)
        const slideAmount = movement.dot(slidingState.current.direction)

        // Apply sliding movement
        const slidePos = prevPos
          .clone()
          .add(
            slidingState.current.direction.clone().multiplyScalar(slideAmount)
          )

        // Maintain the distance established at collision time
        const toEdge = new Vector3().subVectors(
          slidingState.current.start,
          slidePos
        )
        const distToEdge = Math.abs(toEdge.dot(slidingState.current.normal))

        if (
          Math.abs(distToEdge - slidingState.current.maintainDistance) > 0.01
        ) {
          const adjustment = slidingState.current.normal
            .clone()
            .multiplyScalar(slidingState.current.maintainDistance - distToEdge)
          slidePos.add(adjustment)
        }

        // Check for NEW collisions while sliding
        const slideUnit = { ...currentUnit, pos: slidePos }
        const slideCorners = getCorners(slideUnit, slidePos, ry)
        const slideCollisions = detectAllCollisions(
          slideCorners,
          slideUnit,
          wallSegments,
          otherUnits.current
        )

        // Filter out the collision we're already sliding against
        const newCollisions = {
          walls: slideCollisions.walls.filter(
            (w) =>
              !slidingState.current.isWall ||
              w.wallId !== slidingState.current.wallId
          ),
          units: slideCollisions.units.filter(
            (u) =>
              slidingState.current.isWall ||
              u.unitId !== slidingState.current.unitId
          )
        }

        const hasNewCollisions =
          newCollisions.walls.length > 0 || newCollisions.units.length > 0

        if (!hasNewCollisions) {
          console.log('✅ Sliding to valid position (no new collisions)')
          lastValidPosition.current = { pos: slidePos, rotation: ry }
          dispatch({ id: 'moveUnit', unit: id, pos: slidePos, rotation: ry })

          const { x, z } = slidePos
          matrix.copy(lm)
          mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
        } else {
          console.log(
            `❌ NEW collisions during slide: ${newCollisions.walls.length} walls + ${newCollisions.units.length} units`
          )

          // When sliding hits new obstacles, do a precise binary search
          const preciseStopPos = findClosestValidPositionMultiCollision(
            prevPos,
            slidePos,
            currentUnit,
            wallSegments,
            otherUnits.current
          )

          // Reset sliding state since we hit new obstacles
          slidingState.current = null

          lastValidPosition.current = { pos: preciseStopPos, rotation: ry }
          dispatch({
            id: 'moveUnit',
            unit: id,
            pos: preciseStopPos,
            rotation: ry
          })

          const { x, z } = preciseStopPos
          matrix.copy(lm)
          mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
        }
      } else {
        console.log('🛑 No sliding possible, positioning at boundary')
        const closestValid = findClosestValidPositionMultiCollision(
          prevPos,
          newPos,
          currentUnit,
          wallSegments,
          otherUnits.current
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

    // Check if rotation would cause collision using comprehensive detection
    const testUnit = {
      width,
      depth,
      height,
      type,
      style,
      pos,
      rotation: -theta
    }
    const myCorners = getCorners(testUnit, pos, -theta)
    const wallSegments = getWallSegments(model.walls)
    const collisions = detectAllCollisions(
      myCorners,
      testUnit,
      wallSegments,
      otherUnits.current
    )

    // Update ghost color
    ghostColor.current = collisions.hasAnyCollision ? '#ff2020' : '#20ff20'

    // Only update rotation if no collision
    if (!collisions.hasAnyCollision) {
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
    slidingState.current = null
    setDragging(false)
    onDrag(false)
  }

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
