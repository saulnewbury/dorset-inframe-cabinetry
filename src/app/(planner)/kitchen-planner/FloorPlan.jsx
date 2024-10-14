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

export default function FloorPlan() {
  const [points, setPoints] = useState(square)
  const [handle, setHandle] = useState({})
  const [showHandle, setShowHandle] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState({})
  const [axisPair, setAxisPair] = useState([])

  const { view } = useContext(PerspectiveContext)

  function updatePlan(id, x, z) {
    const newArray = points.map((point) => {
      if (point.id !== id) return point

      const snapTolerance = 0.05
      const mx = nearestMultiple(x, 1)
      const mz = nearestMultiple(z, 1)
      const valueX = checkDifference(mx, x, startPos.x, snapTolerance)
      const valueZ = checkDifference(mz, z, startPos.z, snapTolerance)

      return { id, x: valueX, z: valueZ }
    })
    setPoints(newArray)
  }

  function nearestMultiple(num, multiple) {
    return Math.round(num / multiple) * multiple
  }

  function checkDifference(nearestMultiple, current, startPos, tolerance) {
    if (
      current > nearestMultiple - tolerance &&
      current < nearestMultiple + tolerance
    ) {
      return nearestMultiple
    } else if (
      current > startPos - tolerance &&
      current < startPos + tolerance
    ) {
      return startPos
    } else {
      return current
    }
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
