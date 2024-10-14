'use client'
import { useState, useContext, Fragment } from 'react'
import { square, slice } from './floorplans'

import Wall from './Wall'
import Corner from './Corner'
import Handle from './Handle'
import Grid from './RadialGrid'

import { PerspectiveContext } from '@/app/context'

/**
 * Corners are drawn with data from the points array, and walls are
 * drawn from the points. Hovering over a corner sends that's corners
 * – point – coordinates back to the parent, which Handle consumes to
 * get it's start position. Then on drag Handle updates points with
 * it's newlocations thereby updating the corners.
 */

export default function FloorPlanRad2() {
  const [points, setPoints] = useState(square)
  const [handle, setHandle] = useState({})
  const [showHandle, setShowHandle] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState({})
  const [axisPair, setAxisPair] = useState([])

  const { view } = useContext(PerspectiveContext)

  function updatePlan(id, x, z) {
    const id1 = id - 1 === 0 ? points.length : id - 1
    const id2 = (id % points.length) + 1

    const position1 = points.find((p) => p.id === id1)
    const position2 = points.find((p) => p.id === id2)

    const snapIncrement = 0.3926991
    const snapRange = 0.1

    const newArray = points.map((point) => {
      if (point.id !== id) return point

      // Find the nearest snap points on both grids
      const snapped1 = snapToRadialGrid(
        x,
        z,
        position1.x,
        position1.z,
        snapIncrement,
        snapRange
      )
      const snapped2 = snapToRadialGrid(
        x,
        z,
        position2.x,
        position2.z,
        snapIncrement
      )

      // Calculate the distance to both snapped positions
      const distToSnapped1 = distance(x, z, snapped1.x, snapped1.z)
      const distToSnapped2 = distance(x, z, snapped2.x, snapped2.z)

      // Select the closer of the two snapped points
      let finalX, finalZ
      if (distToSnapped1 < distToSnapped2) {
        finalX = snapped1.x
        finalZ = snapped1.z
      } else {
        finalX = snapped2.x
        finalZ = snapped2.z
      }

      // Check for intersection between the two snapped lines
      const intersection = calculateIntersection(
        position1,
        position2,
        snapped1,
        snapped2,
        snapRange
      )

      // If intersection is valid, snap to the intersection point
      if (
        intersection &&
        distance(x, z, intersection.x, intersection.z) < snapRange
      ) {
        finalX = intersection.x
        finalZ = intersection.z
      }

      return { id, x: finalX, z: finalZ }
    })
    setPoints(newArray)
  }

  // Calculate intersection point if within snapping range
  function calculateIntersection(position1, position2, pos1, pos2, snapRange) {
    const angleDiff = Math.abs(normalizeAngle(pos1.angle - pos2.angle))

    // If angles are approximately the same, no intersection
    if (angleDiff < 0.001 || angleDiff > 2 * Math.PI - 0.001) return null

    // Use the law of cosines to compute intersection
    const dx = pos1.x - position1.x
    const dz = pos1.z - position1.z
    const distance1 = Math.sqrt(dx * dx + dz * dz)

    const dx2 = pos2.x - position2.x
    const dz2 = pos2.z - position2.z
    const distance2 = Math.sqrt(dx2 * dx2 + dz2 * dz2)

    // If the two snapped points are close enough, return the average position
    if (distance1 < snapRange && distance2 < snapRange) {
      const intersectX = (pos1.x + pos2.x) / 2
      const intersectZ = (pos1.z + pos2.z) / 2
      return { x: intersectX, z: intersectZ }
    }
    return null
  }

  function snapToRadialGrid(x, z, centerX, centerZ, snapIncrement, snapRange) {
    const dx = x - centerX
    const dz = z - centerZ
    let angle = Math.atan2(dz, dx)

    angle = normalizeAngle(angle) // Normalize to [0, 2π]
    const nearestAngle = Math.round(angle / snapIncrement) * snapIncrement

    // Snap if within range
    if (angularDifference(angle, nearestAngle) <= snapRange) {
      const distanceFromCenter = Math.sqrt(dx * dx + dz * dz) // Distance from center
      const snappedX = centerX + distanceFromCenter * Math.cos(nearestAngle)
      const snappedZ = centerZ + distanceFromCenter * Math.sin(nearestAngle)
      return { x: snappedX, z: snappedZ, angle: nearestAngle }
    }

    // No snapping if not within range
    return { x, z, angle }
  }

  function normalizeAngle(angle) {
    return (angle + 2 * Math.PI) % (2 * Math.PI)
  }

  // Helper to calculate angular difference accounting for wraparound
  function angularDifference(angle1, angle2) {
    const diff = normalizeAngle(angle1 - angle2)
    return Math.min(diff, 2 * Math.PI - diff)
  }

  // Calculate distance between two points
  function distance(x1, z1, x2, z2) {
    return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)
  }

  function updateHandle(id, x, z) {
    if (dragging) return
    setHandle({ x, z, id })
  }

  function createGrid(id) {
    if (dragging) return
    const pair = points.filter((point) => {
      const a = id - 1 === 0 ? points.length : id - 1
      const b = (id % points.length) + 1
      if (a === point.id || b === point.id) {
        return { x: point.x, z: point.z }
      }
    })
    setAxisPair(pair)
  }

  return (
    <>
      {points.map((point, i) => (
        <Fragment key={i}>
          <Corner
            params={point}
            t={0.15}
            h={1}
            handleCoordinates={(id, x, z) => {
              updateHandle(id, x, z)
              createGrid(id)
            }}
            toggleHandle={() => {
              setShowHandle(true)
            }}
          />

          {/* When drawing a wall it's necessary to know the angle of the 
          adjecent walls to work out the mitre */}
          <Wall
            color={i % 2 === 0 ? 'red' : 'green'}
            id={points[i].id}
            a={points[i]}
            b={points[(i + 1) % points.length]}
            pre={points[(i - 1 + points.length) % points.length]}
            next={points[(i + 2) % points.length]}
            t={0.15}
            h={1}
          />
        </Fragment>
      ))}

      {showHandle && (
        <Handle
          t={0.15}
          h={1}
          params={handle}
          handleDrag={updatePlan}
          showHandle={showHandle}
          startPosition={(x, z) => {
            // console.log('start: ' + x + ' ' + z)
            setStartPos({ x, z })
          }}
          dragging={() => {
            setDragging(!dragging)
          }}
          toggleHandle={() => {
            setShowHandle(!showHandle)
          }}
        />
      )}
      {showHandle && axisPair.map((axis, i) => <Grid key={i} coords={axis} />)}
    </>
  )
}

// transform x and z to be snapped versions.
// if the delta (difference – amount of change) x great enough then
// you will stop snapping in the x direction. Same fo z.

// const deltaX = isMultiple(Math.trunc(x * 10), 2)

// Vertical snap
// compare x as passed on, with the x value of the previous point in the points array.
// if the difference is small enough you will keep point.x and not replace it with the new x.

// Horizontal - same as above but with z
// if absolute value of delta x is small enough then keep the previous x
// else if x

// Grid! Radial. Only need to calculate the radial lines. If you have a constrained x or z.
// Then you've only one line to check. Otherwise (moving freely) then you need to check both
// of the angles.
// Snapping to an angle - outch!
