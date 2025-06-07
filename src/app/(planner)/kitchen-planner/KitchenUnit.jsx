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
    const segments = []

    // Process ALL wall segments
    walls.forEach((wallSegment, segmentIndex) => {
      if (segmentIndex === 0) {
        // Perimeter walls - closed loop
        for (let i = 0; i < wallSegment.length; i++) {
          const start = wallSegment[i]
          const end = wallSegment[(i + 1) % wallSegment.length] // Wrap around for closed loop

          const segment = {
            start: new Vector3(start.x, 0, start.z),
            end: new Vector3(end.x, 0, end.z),
            wallId: start.id,
            segment: start.segment,
            type: 'perimeter-wall',
            segmentIndex: segmentIndex
          }
          segments.push(segment)
        }
      } else {
        // Internal walls - NOT a closed loop (just connect point to point)
        for (let i = 0; i < wallSegment.length - 1; i++) {
          const start = wallSegment[i]
          const end = wallSegment[i + 1] // No wrapping - just next point

          const segment = {
            start: new Vector3(start.x, 0, start.z),
            end: new Vector3(end.x, 0, end.z),
            wallId: start.id,
            segment: start.segment,
            type: 'internal-wall',
            segmentIndex: segmentIndex
          }

          segments.push(segment)
        }
      }
    })

    const perimeterCount = segments.filter(
      (s) => s.type === 'perimeter-wall'
    ).length
    const internalCount = segments.filter(
      (s) => s.type === 'internal-wall'
    ).length

    console.log(`📋 Total wall segments: ${segments.length}`)
    console.log(`   - Perimeter: ${perimeterCount}`)
    console.log(`   - Internal: ${internalCount}`)

    return segments
  }

  /**
   * Check if unit collides with walls (accounting for wall thickness)
   */
  function checkWallCollision(unitCorners, wallSegments) {
    const unitPoly = unitCorners.map((c) => new Vector2(c.x, c.z))

    // Calculate unit center for distance culling
    const unitMinX = Math.min(...unitPoly.map((p) => p.x))
    const unitMaxX = Math.max(...unitPoly.map((p) => p.x))
    const unitMinY = Math.min(...unitPoly.map((p) => p.y))
    const unitMaxY = Math.max(...unitPoly.map((p) => p.y))
    const unitCenter = new Vector2(
      (unitMinX + unitMaxX) / 2,
      (unitMinY + unitMaxY) / 2
    )
    const unitRadius = Math.max(unitMaxX - unitMinX, unitMaxY - unitMinY) / 2

    for (let i = 0; i < wallSegments.length; i++) {
      const segment = wallSegments[i]

      // Distance culling optimization
      const wallCenter = new Vector2(
        (segment.start.x + segment.end.x) / 2,
        (segment.start.z + segment.end.z) / 2
      )
      const distance = unitCenter.distanceTo(wallCenter)
      const wallLength = segment.start.distanceTo(segment.end)
      const maxReasonableDistance = unitRadius + wallLength / 2 + 1.0

      if (distance > maxReasonableDistance) {
        continue
      }

      const wallStart = new Vector2(segment.start.x, segment.start.z)
      const wallEnd = new Vector2(segment.end.x, segment.end.z)
      const wallVector = new Vector2().subVectors(wallEnd, wallStart)
      const wallLength2 = wallVector.length()
      const wallDir = wallVector.clone().normalize()
      const wallNormal = new Vector2(-wallVector.y, wallVector.x).normalize()

      const wallThickness = 0.1
      const halfThickness = wallThickness / 2

      // DIFFERENT THRESHOLDS FOR DIFFERENT WALL TYPES
      const wallCollisionThreshold = 0.02 // Keep 2cm margin for walls (safety)

      if (segment.type === 'perimeter-wall') {
        const insideFaceStart = wallStart
          .clone()
          .add(wallNormal.clone().multiplyScalar(halfThickness))
        const insideFaceEnd = wallEnd
          .clone()
          .add(wallNormal.clone().multiplyScalar(halfThickness))

        for (let j = 0; j < unitPoly.length; j++) {
          const corner = unitPoly[j]
          const toCorner = new Vector2().subVectors(corner, insideFaceStart)
          const projectionLength = toCorner.dot(wallDir)
          const clampedProjection = Math.max(
            0,
            Math.min(wallLength2, projectionLength)
          )
          const closestPointOnInsideFace = insideFaceStart
            .clone()
            .add(wallDir.clone().multiplyScalar(clampedProjection))
          const vectorToCorner = new Vector2().subVectors(
            corner,
            closestPointOnInsideFace
          )
          const signedDistance = vectorToCorner.dot(wallNormal)

          if (signedDistance < wallCollisionThreshold) {
            return {
              collides: true,
              segment: segment,
              wallId: segment.wallId,
              wallType: 'perimeter'
            }
          }
        }
      } else if (segment.type === 'internal-wall') {
        const expandedHalfThickness = halfThickness + wallCollisionThreshold

        const wallCorner1 = wallStart
          .clone()
          .add(wallNormal.clone().multiplyScalar(expandedHalfThickness))
        const wallCorner2 = wallEnd
          .clone()
          .add(wallNormal.clone().multiplyScalar(expandedHalfThickness))
        const wallCorner3 = wallEnd
          .clone()
          .sub(wallNormal.clone().multiplyScalar(expandedHalfThickness))
        const wallCorner4 = wallStart
          .clone()
          .sub(wallNormal.clone().multiplyScalar(expandedHalfThickness))

        const expandedWallPoly = [
          wallCorner1,
          wallCorner2,
          wallCorner3,
          wallCorner4
        ]

        if (polygonsIntersect(unitPoly, expandedWallPoly)) {
          return {
            collides: true,
            segment: segment,
            wallId: segment.wallId,
            wallType: 'internal',
            wallRectangle: expandedWallPoly
          }
        }
      }
    }

    return { collides: false }
  }

  /**
   * Polygon intersection using Separating Axis Theorem (SAT)
   * (This function is needed for internal wall collision detection)
   */
  function polygonsIntersect(poly1, poly2) {
    const polygons = [poly1, poly2]

    for (let p = 0; p < polygons.length; p++) {
      const polygon = polygons[p]

      for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length
        const edge = new Vector2().subVectors(polygon[j], polygon[i])
        const normal = new Vector2(-edge.y, edge.x).normalize()

        let min1 = Infinity,
          max1 = -Infinity
        let min2 = Infinity,
          max2 = -Infinity

        // Project poly1 onto normal
        for (const vertex of poly1) {
          const projection = vertex.dot(normal)
          min1 = Math.min(min1, projection)
          max1 = Math.max(max1, projection)
        }

        // Project poly2 onto normal
        for (const vertex of poly2) {
          const projection = vertex.dot(normal)
          min2 = Math.min(min2, projection)
          max2 = Math.max(max2, projection)
        }

        // Check for separation
        if (max1 < min2 || max2 < min1) {
          return false // Polygons are separated
        }
      }
    }

    return true // No separating axis found = intersection
  }

  /**
   * Enhanced collision detection that can detect multiple collision types simultaneously
   */
  function detectAllCollisions(unitCorners, unit, wallSegments, otherUnits) {
    const collisions = {
      walls: [],
      units: [],
      hasAnyCollision: false
    }

    // Check ALL wall collisions (walls affect all cabinet types)
    for (let i = 0; i < wallSegments.length; i++) {
      const wallCollision = checkWallCollision(unitCorners, [wallSegments[i]])
      if (wallCollision.collides) {
        collisions.walls.push({
          wallId: wallSegments[i].wallId,
          segment: wallSegments[i],
          collision: wallCollision
        })
        collisions.hasAnyCollision = true
      }
    }

    // Check unit collisions with TYPE FILTERING
    const myBox = getUnitBoundingBox(unit, unit.pos, unit.rotation)

    for (const otherUnit of otherUnits) {
      // CABINET TYPE COLLISION RULES:
      if (!shouldCabinetsCollide(unit.type, otherUnit.type)) {
        continue // Skip this unit - different height levels
      }

      const otherBox = getUnitBoundingBox(otherUnit)
      if (!myBox.intersectsBox(otherBox)) continue

      const otherCorners = getCorners(otherUnit)
      if (checkUnitCollision(unitCorners, otherCorners)) {
        collisions.units.push({
          unitId: otherUnit.id,
          unit: otherUnit,
          corners: otherCorners
        })
        collisions.hasAnyCollision = true
      }
    }

    return collisions
  }

  /*
   * Determines if two cabinet types should collide with each other
   * Based on their physical height and mounting position
   */
  function shouldCabinetsCollide(type1, type2) {
    // COLLISION MATRIX:
    // base vs base: YES (same level)
    // base vs tall: YES (tall extends to base level)
    // base vs wall: NO (wall is mounted high above base)
    // tall vs tall: YES (same height range)
    // tall vs wall: YES (both extend to upper areas)
    // wall vs wall: YES (same mounting height)

    const collisionMatrix = {
      base: {
        base: true, // Base cabinets collide with each other
        tall: true, // Tall cabinets extend down to base level
        wall: false // Wall cabinets are mounted high above
      },
      tall: {
        base: true, // Tall cabinets extend down to base level
        tall: true, // Tall cabinets collide with each other
        wall: true // Tall cabinets extend up to wall cabinet level
      },
      wall: {
        base: false, // Wall cabinets don't reach down to base level
        tall: true, // Tall cabinets extend up to wall level
        wall: true // Wall cabinets collide with each other
      }
    }

    return collisionMatrix[type1]?.[type2] ?? false
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

      console.log(
        `🎯 Finding edge for ${wallSegment.type} wall ${wallSegment.wallId}`
      )

      // Calculate wall properties
      const wallStart = new Vector2(wallSegment.start.x, wallSegment.start.z)
      const wallEnd = new Vector2(wallSegment.end.x, wallSegment.end.z)
      const wallVector = new Vector2().subVectors(wallEnd, wallStart)
      const wallDir = wallVector.clone().normalize()
      const wallNormal = new Vector2(-wallVector.y, wallVector.x).normalize()

      let slidingFace, slidingFace3D, slidingDir3D, slidingNormal3D

      if (wallSegment.type === 'perimeter-wall') {
        // PERIMETER WALLS: Use inside face for sliding
        const insideFaceStart = wallStart
          .clone()
          .add(wallNormal.clone().multiplyScalar(halfThickness))
        const insideFaceEnd = wallEnd
          .clone()
          .add(wallNormal.clone().multiplyScalar(halfThickness))

        slidingFace3D = {
          start: new Vector3(insideFaceStart.x, 0, insideFaceStart.y),
          end: new Vector3(insideFaceEnd.x, 0, insideFaceEnd.y)
        }
        slidingDir3D = new Vector3(wallDir.x, 0, wallDir.y)
        slidingNormal3D = new Vector3(wallNormal.x, 0, wallNormal.y)
      } else if (wallSegment.type === 'internal-wall') {
        // INTERNAL WALLS: Find which face of the rectangle to slide against
        // Check which side of the wall the cabinet is approaching from
        const centerToWallStart = new Vector2().subVectors(
          new Vector2(currentPos.x, currentPos.z),
          wallStart
        )
        const sideOfWall = centerToWallStart.dot(wallNormal)

        if (sideOfWall > 0) {
          // Cabinet is on the "positive normal" side - slide against that face
          const slideFaceStart = wallStart
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness))
          const slideFaceEnd = wallEnd
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness))

          slidingFace3D = {
            start: new Vector3(slideFaceStart.x, 0, slideFaceStart.y),
            end: new Vector3(slideFaceEnd.x, 0, slideFaceEnd.y)
          }
          slidingNormal3D = new Vector3(wallNormal.x, 0, wallNormal.y)
        } else {
          // Cabinet is on the "negative normal" side - slide against that face
          const slideFaceStart = wallStart
            .clone()
            .sub(wallNormal.clone().multiplyScalar(halfThickness))
          const slideFaceEnd = wallEnd
            .clone()
            .sub(wallNormal.clone().multiplyScalar(halfThickness))

          slidingFace3D = {
            start: new Vector3(slideFaceStart.x, 0, slideFaceStart.y),
            end: new Vector3(slideFaceEnd.x, 0, slideFaceEnd.y)
          }
          slidingNormal3D = new Vector3(-wallNormal.x, 0, -wallNormal.y)
        }

        slidingDir3D = new Vector3(wallDir.x, 0, wallDir.y)
      }

      // Calculate distance from current position to sliding face
      let totalDist = 0
      for (const corner of currentCorners) {
        const toStart = new Vector3().subVectors(corner, slidingFace3D.start)
        const projection = toStart.dot(slidingDir3D)
        const wallLength = wallVector.length()
        const clamped = Math.max(0, Math.min(wallLength, projection))
        const closestPoint = slidingFace3D.start
          .clone()
          .add(slidingDir3D.clone().multiplyScalar(clamped))
        const dist = corner.distanceTo(closestPoint)
        totalDist += dist
      }
      const avgDist = totalDist / currentCorners.length

      if (avgDist < minDistance) {
        minDistance = avgDist

        const centerToWall = new Vector3().subVectors(
          currentPos,
          slidingFace3D.start
        )
        const currentDistance = Math.abs(centerToWall.dot(slidingNormal3D))

        bestEdge = {
          start: slidingFace3D.start,
          end: slidingFace3D.end,
          direction: slidingDir3D,
          normal: slidingNormal3D,
          wallId: wallSegment.wallId,
          isWall: true,
          wallType: wallSegment.type,
          maintainDistance: currentDistance
        }

        console.log(`🎯 Selected ${wallSegment.type} sliding face`)
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
    const pos =
      position instanceof Vector3
        ? position.clone()
        : new Vector3(position.x, 0, position.z)

    let w = unit.width / 1000
    let d = unit.depth / 1000

    // ADD FRONT PANEL THICKNESS (36mm total) to ALL cabinet types
    // This accounts for both carcass front panel (18mm) + door/front panel (18mm)
    const panelThickness = 0.018
    const frontPanelTotal = panelThickness * 2 // 36mm total front extension
    const collisionDepth = d + frontPanelTotal // Add 36mm to depth

    // Offset position forward by half the total front panel thickness so it extends from the front
    const frontOffset = new Vector3(0, 0, frontPanelTotal / 2).applyAxisAngle(
      vectorY,
      rot
    )
    pos.add(frontOffset)

    if (unit.type === 'base' && unit.style?.includes('corner')) {
      // CORNER CABINETS: Use cached calculations for width + existing front panel logic
      if (!unit._cornerCache) {
        const isLeftOpening = unit.style.includes('left')
        const carcassDepth = d // Original depth before adding front panel
        const interiorOpeningWidth = getInteriorOpeningWidth(unit.width)
        const cornerFullWidth =
          interiorOpeningWidth + panelThickness + carcassDepth
        const collisionWidth = cornerFullWidth + panelThickness * 2
        const cornerOffset = -carcassDepth / 4 - 0.0135
        const offsetX = isLeftOpening ? cornerOffset : -cornerOffset

        unit._cornerCache = {
          width: collisionWidth,
          depth: collisionDepth, // Use depth that includes front panel
          offsetX: offsetX
        }
      }

      // Use cached values for corner cabinets
      w = unit._cornerCache.width
      d = unit._cornerCache.depth // This already includes the front panel thickness

      // Apply corner-specific position offset
      const cornerOffset = new Vector3(
        unit._cornerCache.offsetX,
        0,
        0
      ).applyAxisAngle(vectorY, rot)
      pos.add(cornerOffset)
    } else {
      // REGULAR CABINETS: Use collision depth that includes front panel
      d = collisionDepth
    }

    // Calculate the four corners based on the adjusted width and depth
    return [
      new Vector3(-w / 2, 0, d / 2), // front left
      new Vector3(-w / 2, 0, -d / 2), // back left
      new Vector3(w / 2, 0, -d / 2), // back right
      new Vector3(w / 2, 0, d / 2) // front right
    ].map((p) => p.applyAxisAngle(vectorY, rot).add(pos))
  }

  /**
   * Helper function for corner cabinet interior opening width
   */
  function getInteriorOpeningWidth(widthMm) {
    const cornerSizes = [400, 450, 500, 600]
    const openingWidths = [0.38, 0.43, 0.48, 0.58]

    const index = cornerSizes.indexOf(widthMm)

    if (index !== -1) {
      return openingWidths[index]
    }

    // Fallback for non-standard sizes
    return (widthMm / 1000) * (0.58 / 0.6)
  }

  /**
   * Helper function to determine interior opening width based on cabinet width
   * This matches the logic from itemStyles.js and CabinetCorner.jsx
   */
  function getInteriorOpeningWidth(widthMm) {
    const cornerSizes = [400, 450, 500, 600]
    const openingWidths = [0.38, 0.43, 0.48, 0.58]

    const index = cornerSizes.indexOf(widthMm)

    if (index !== -1) {
      return openingWidths[index]
    }

    // Fallback for non-standard sizes
    console.warn(
      `⚠️ Non-standard corner cabinet width: ${widthMm}mm, using proportional calculation`
    )
    return (widthMm / 1000) * (0.58 / 0.6)
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
      edges.push(new Vector2(-edge.y, edge.x).normalize())
    }

    for (let i = 0; i < poly2.length; i++) {
      const next = (i + 1) % poly2.length
      const edge = new Vector2().subVectors(poly2[next], poly2[i])
      edges.push(new Vector2(-edge.y, edge.x).normalize())
    }

    // Test each potential separating axis
    for (const axis of edges) {
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

      // MINIMAL TOLERANCE FOR CABINET-TO-CABINET COLLISIONS
      // This allows cabinets to touch without gaps
      const cabinetTolerance = 0.0005 // 0.5mm - just enough to prevent overlap

      if (max1 < min2 + cabinetTolerance || max2 < min1 + cabinetTolerance) {
        return false // No collision - cabinets can touch
      }
    }

    return true // Collision detected
  }

  /**
   * Enhanced snapToNearbyUnits with cabinet type filtering
   */
  function snapToNearbyUnits(
    newPos,
    currentUnit,
    otherUnits,
    snapDistance = 0.01
  ) {
    // Get wall segments from the model (access from the component scope)
    const wallSegments = getWallSegments(model.walls)

    // TRY WALL SNAPPING FIRST (higher priority than cabinet snapping)
    const wallSnappedPos = snapToNearbyWalls(
      newPos,
      currentUnit,
      wallSegments,
      snapDistance
    )
    if (wallSnappedPos !== newPos) {
      return wallSnappedPos // Wall snapping succeeded
    }

    // THEN TRY CABINET SNAPPING (existing functionality)
    return snapToNearbyCabinets(newPos, currentUnit, otherUnits, snapDistance)
  }

  /**
   * Snap cabinets to nearby walls for perfect positioning
   */

  function snapToNearbyWalls(
    newPos,
    currentUnit,
    wallSegments,
    snapDistance = 0.01
  ) {
    const myCorners = getCorners(currentUnit, newPos, currentUnit.rotation)

    for (const wallSegment of wallSegments) {
      const wallStart = new Vector2(wallSegment.start.x, wallSegment.start.z)
      const wallEnd = new Vector2(wallSegment.end.x, wallSegment.end.z)
      const wallVector = new Vector2().subVectors(wallEnd, wallStart)
      const wallLength = wallVector.length()
      const wallDir = wallVector.clone().normalize()
      const wallNormal = new Vector2(-wallVector.y, wallVector.x).normalize()

      // Calculate wall faces based on wall type
      let snapFaces = []

      if (wallSegment.type === 'perimeter-wall') {
        // PERIMETER WALLS: Only snap to inside face (room side)
        const wallThickness = 0.1
        const halfThickness = wallThickness / 2
        const insideFace = {
          start: wallStart
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness)),
          end: wallEnd
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness)),
          normal: wallNormal.clone()
        }
        snapFaces.push(insideFace)
      } else if (wallSegment.type === 'internal-wall') {
        // INTERNAL WALLS: Snap to both faces (can approach from either side)
        const wallThickness = 0.1
        const halfThickness = wallThickness / 2

        const face1 = {
          start: wallStart
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness)),
          end: wallEnd
            .clone()
            .add(wallNormal.clone().multiplyScalar(halfThickness)),
          normal: wallNormal.clone()
        }
        const face2 = {
          start: wallStart
            .clone()
            .sub(wallNormal.clone().multiplyScalar(halfThickness)),
          end: wallEnd
            .clone()
            .sub(wallNormal.clone().multiplyScalar(halfThickness)),
          normal: wallNormal.clone().negate()
        }
        snapFaces.push(face1, face2)
      }

      // Check each wall face for snapping opportunities
      for (const face of snapFaces) {
        // Check each cabinet corner against this wall face
        for (const corner of myCorners) {
          const corner2D = new Vector2(corner.x, corner.z)

          // Find closest point on the wall face
          const toCorner = new Vector2().subVectors(corner2D, face.start)
          const projection = toCorner.dot(wallDir)
          const clampedProjection = Math.max(
            0,
            Math.min(wallLength, projection)
          )
          const closestPointOnWall = face.start
            .clone()
            .add(wallDir.clone().multiplyScalar(clampedProjection))

          const distanceToWall = corner2D.distanceTo(closestPointOnWall)

          // If corner is close to wall, try snapping
          if (distanceToWall < snapDistance) {
            // Calculate snap vector to align cabinet with wall
            const snapVector = new Vector2().subVectors(
              closestPointOnWall,
              corner2D
            )
            const snappedPos2D = new Vector2(newPos.x, newPos.z).add(snapVector)
            const snappedPos = new Vector3(
              snappedPos2D.x,
              newPos.y,
              snappedPos2D.y
            )

            // Verify the snapped position doesn't cause collisions
            if (
              isSnappedPositionValid(snappedPos, currentUnit, wallSegments, [])
            ) {
              return snappedPos
            }
          }
        }

        // Also try snapping cabinet edges parallel to wall
        for (let i = 0; i < myCorners.length; i++) {
          const edgeStart = myCorners[i]
          const edgeEnd = myCorners[(i + 1) % myCorners.length]
          const cabinetEdge = new Vector3().subVectors(edgeEnd, edgeStart)
          const cabinetEdgeDir = cabinetEdge.clone().normalize()

          // Check if cabinet edge is roughly parallel to wall
          const wallDir3D = new Vector3(wallDir.x, 0, wallDir.y)
          const parallelness = Math.abs(cabinetEdgeDir.dot(wallDir3D))

          if (parallelness > 0.9) {
            // Nearly parallel (within ~25 degrees)
            // Calculate distance from cabinet edge to wall
            const edgeCenter = new Vector3()
              .addVectors(edgeStart, edgeEnd)
              .multiplyScalar(0.5)
            const edgeCenter2D = new Vector2(edgeCenter.x, edgeCenter.z)

            const toEdge = new Vector2().subVectors(edgeCenter2D, face.start)
            const edgeProjection = toEdge.dot(wallDir)
            const clampedEdgeProjection = Math.max(
              0,
              Math.min(wallLength, edgeProjection)
            )
            const closestWallPoint = face.start
              .clone()
              .add(wallDir.clone().multiplyScalar(clampedEdgeProjection))

            const edgeDistanceToWall = edgeCenter2D.distanceTo(closestWallPoint)

            if (edgeDistanceToWall < snapDistance) {
              // Snap cabinet edge to be parallel and aligned with wall
              const snapVector = new Vector2().subVectors(
                closestWallPoint,
                edgeCenter2D
              )
              const snappedPos2D = new Vector2(newPos.x, newPos.z).add(
                snapVector
              )
              const snappedPos = new Vector3(
                snappedPos2D.x,
                newPos.y,
                snappedPos2D.y
              )

              if (
                isSnappedPositionValid(
                  snappedPos,
                  currentUnit,
                  wallSegments,
                  []
                )
              ) {
                return snappedPos
              }
            }
          }
        }
      }
    }

    return newPos // No wall snapping occurred
  }

  /**
   * Renamed existing cabinet snapping function for clarity
   */
  function snapToNearbyCabinets(
    newPos,
    currentUnit,
    otherUnits,
    snapDistance = 0.01
  ) {
    // Find nearby units that this cabinet could snap to
    for (const otherUnit of otherUnits) {
      // TYPE FILTERING: Only snap to compatible cabinet types
      if (!shouldCabinetsCollide(currentUnit.type, otherUnit.type)) {
        continue // Skip incompatible cabinet types
      }

      const distance = new Vector3(newPos.x, 0, newPos.z).distanceTo(
        new Vector3(otherUnit.pos.x, 0, otherUnit.pos.z)
      )

      // Only consider nearby units for snapping
      if (distance > 2.0) continue

      const otherCorners = getCorners(otherUnit)
      const myCorners = getCorners(currentUnit, newPos, currentUnit.rotation)

      // Check if any of our corners are very close to their corners/edges
      for (const myCorner of myCorners) {
        for (let i = 0; i < otherCorners.length; i++) {
          const otherStart = otherCorners[i]
          const otherEnd = otherCorners[(i + 1) % otherCorners.length]

          // Calculate closest point on the other unit's edge
          const edge = new Vector3().subVectors(otherEnd, otherStart)
          const edgeLength = edge.length()

          if (edgeLength < 0.001) continue // Skip very short edges

          const edgeDir = edge.clone().normalize()
          const toCorner = new Vector3().subVectors(myCorner, otherStart)
          const projection = toCorner.dot(edgeDir)
          const clampedProjection = Math.max(
            0,
            Math.min(edgeLength, projection)
          )
          const closestPoint = otherStart
            .clone()
            .add(edgeDir.multiplyScalar(clampedProjection))

          const snapDist = myCorner.distanceTo(closestPoint)

          // If very close, snap to perfect alignment
          if (snapDist < snapDistance) {
            const snapVector = new Vector3().subVectors(closestPoint, myCorner)
            const snappedPos = new Vector3(
              newPos.x + snapVector.x,
              newPos.y,
              newPos.z + snapVector.z
            )

            if (
              isSnappedPositionValid(snappedPos, currentUnit, [], otherUnits)
            ) {
              return snappedPos
            }
          }
        }
      }

      // Also check for corner-to-corner snapping
      for (const myCorner of myCorners) {
        for (const otherCorner of otherCorners) {
          const cornerDistance = myCorner.distanceTo(otherCorner)

          if (cornerDistance < snapDistance) {
            const snapVector = new Vector3().subVectors(otherCorner, myCorner)
            const snappedPos = new Vector3(
              newPos.x + snapVector.x,
              newPos.y,
              newPos.z + snapVector.z
            )

            if (
              isSnappedPositionValid(snappedPos, currentUnit, [], otherUnits)
            ) {
              return snappedPos
            }
          }
        }
      }
    }

    return newPos // No cabinet snapping needed
  }

  /**
   * Helper function to validate snapped positions
   */
  function isSnappedPositionValid(
    snappedPos,
    currentUnit,
    wallSegments,
    otherUnits
  ) {
    const snappedUnit = { ...currentUnit, pos: snappedPos }
    const snappedCorners = getCorners(
      snappedUnit,
      snappedPos,
      currentUnit.rotation
    )

    // Check wall collisions if walls provided
    if (wallSegments.length > 0) {
      const wallCollision = checkWallCollision(snappedCorners, wallSegments)
      if (wallCollision.collides) {
        return false
      }
    }

    // Check unit collisions if units provided
    for (const checkUnit of otherUnits) {
      if (!shouldCabinetsCollide(currentUnit.type, checkUnit.type)) continue

      const checkCorners = getCorners(checkUnit)
      if (checkUnitCollision(snappedCorners, checkCorners)) {
        return false
      }
    }

    return true // Position is valid
  }

  /**
   * Enhanced optimizedSlidingCollisionCheck with cabinet type filtering
   */
  function optimizedSlidingCollisionCheck(
    slideCorners,
    slideUnit,
    wallSegments,
    otherUnits,
    slidingState
  ) {
    // Filter out the collision we're already sliding against
    const relevantWallSegments = wallSegments.filter((segment) => {
      if (!slidingState.isWall) return true // Not sliding against a wall, check all walls
      return segment.wallId !== slidingState.wallId // Skip the wall we're sliding against
    })

    const relevantUnits = otherUnits.filter((unit) => {
      if (slidingState.isWall) {
        // Sliding against wall, check all compatible unit types
        return shouldCabinetsCollide(slideUnit.type, unit.type)
      } else {
        // Sliding against unit, check all compatible types except the sliding target
        return (
          unit.id !== slidingState.unitId &&
          shouldCabinetsCollide(slideUnit.type, unit.type)
        )
      }
    })

    // Use the filtered lists for collision detection
    return detectAllCollisions(
      slideCorners,
      slideUnit,
      relevantWallSegments,
      relevantUnits
    )
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
    let newPos = new Vector3().setFromMatrixPosition(lm).add(handle)
    const prevPos = lastValidPosition.current
      ? lastValidPosition.current.pos
      : pos

    const wallSegments = getWallSegments(model.walls)
    if (wallSegments.length === 0) return

    const currentUnit = {
      width: width,
      depth: depth,
      height: height,
      type: type,
      style: style,
      pos: newPos,
      rotation: ry
    }

    // ENHANCED: Try snapping to walls AND cabinets for perfect alignment
    newPos = snapToNearbyUnits(newPos, currentUnit, otherUnits.current)

    const myCorners = getCorners(currentUnit, newPos, ry)
    const collisions = detectAllCollisions(
      myCorners,
      currentUnit,
      wallSegments,
      otherUnits.current
    )

    if (!collisions.hasAnyCollision) {
      // No collision - move freely
      ghostColor.current = '#20ff20'
      slidingState.current = null

      lastValidPosition.current = { pos: newPos.clone(), rotation: ry }
      dispatch({ id: 'moveUnit', unit: id, pos: newPos, rotation: ry })

      const { x, z } = newPos
      matrix.copy(lm)
      mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
    } else {
      // Collision detected
      ghostColor.current = '#ff2020'

      // If we're not already sliding, find the collision edge
      if (!slidingState.current) {
        // Use enhanced binary search that handles multiple collision types
        const exactCollisionPos = findClosestValidPositionMultiCollision(
          prevPos,
          newPos,
          currentUnit,
          wallSegments,
          otherUnits.current
        )

        // Try wall edge first (walls take priority)
        let edge = findWallCollisionEdge(
          currentUnit,
          newPos,
          exactCollisionPos,
          wallSegments
        )
        if (edge) {
          edge.isWall = true
        } else {
          // Fall back to unit edge
          edge = findCollisionEdge(currentUnit, newPos, exactCollisionPos)
        }

        if (edge) {
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
        // Sliding along edge with multi-collision validation
        const movement = new Vector3().subVectors(newPos, prevPos)
        const slideAmount = movement.dot(slidingState.current.direction)

        // Apply sliding movement
        let slidePos = prevPos
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

        // SNAPPING DURING SLIDING: Try to snap to nearby units while sliding
        const slideUnit = { ...currentUnit, pos: slidePos }
        slidePos = snapToNearbyUnits(slidePos, slideUnit, otherUnits.current)

        // Check for NEW collisions while sliding
        const slideCorners = getCorners(slideUnit, slidePos, ry)

        // Use optimized collision check that filters out current sliding target
        const slideCollisions = optimizedSlidingCollisionCheck(
          slideCorners,
          slideUnit,
          wallSegments,
          otherUnits.current,
          slidingState.current
        )

        const hasNewCollisions =
          slideCollisions.walls.length > 0 || slideCollisions.units.length > 0

        if (!hasNewCollisions) {
          lastValidPosition.current = { pos: slidePos, rotation: ry }
          dispatch({ id: 'moveUnit', unit: id, pos: slidePos, rotation: ry })

          const { x, z } = slidePos
          matrix.copy(lm)
          mrotate.setPosition(new Vector3(x - handle.x, 0, z - handle.z))
        } else {
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
        // No sliding possible, positioning at boundary
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
