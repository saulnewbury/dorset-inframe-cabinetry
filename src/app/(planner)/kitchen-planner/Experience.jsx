'use client'

// Modules
import { useState, useContext, useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'

// Helpers
import { radToDeg } from '@/lib/helpers/radToDeg'

// Data
import { square, slice } from './floorplans'

// Objects
import Wall from './Wall'
import Corner from './Corner'
import RadialGrid from './RadialGrid'
import Floor from './Floor'

// Context
import { PerspectiveContext } from '@/app/context.js'

/**
 * @typedef {{
 *    x: number
 *    z: number
 * }} Point
 * @typedef {{
 *    type: string
 *    offset: number
 * }} Feature
 */

/**
 * Corners are drawn with data from the points array, and walls are
 * drawn from the points. Hovering over a corner sends that's corners
 * – point – coordinates back to the parent, which Handle consumes to
 * get it's start position. Then on drag Handle updates points with
 * it's newlocations thereby updating the corners.
 */

export default function Experience() {
  const [points, setPoints] = useState(square)
  const [hover, setHover] = useState()
  const [axisPair, setAxisPair] = useState([])
  const [options, setOptions] = useState(() => {
    return square().map((point) => {
      return { id: point.id, line: false }
    })
  })

  const over = useRef(new Set())
  const dragBase = useRef()
  const orbitControls = useRef()
  const walls = useRef()

  const wrap = (id) => (id + points.length) % points.length
  const snap = (pt) => pt && { x: Math.round(pt.x), z: Math.round(pt.z) }
  const { view } = useContext(PerspectiveContext)

  useEffect(() => {
    if (view === '2d') return
    hideWalls()
  }, [])

  return (
    <>
      {/* Logic elements */}
      <OrbitControls
        enableRotate={view === '2d' ? false : true}
        ref={orbitControls}
        onChange={hideWalls}
      />
      <axesHelper />

      {/* Environment elements */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* Scene */}
      <Floor points={points} />
      {points.map((at, n) => (
        <Corner
          key={'corner-' + n}
          id={at.id}
          at={at}
          next={points[wrap(at.id + 1)]}
          post={points[wrap(at.id + 2)]}
          prev={points[wrap(at.id - 1)]}
          pro={points[wrap(at.id - 2)]}
          hover={hover}
          onHover={doHover}
          onDragStart={dragStart}
          onDrag={moveCorner}
          createRadialGrid={createRadialGrid}
          showMeasurementLines={showMeasurementLines}
          removeRedundantPoints={removeRedundantPoints}
          highlightWalls={highlightWalls}
          onDragEnd={dragEnd}
        />
      ))}
      <group ref={walls}>
        {points.map((from, n) => {
          return (
            <Wall
              key={'wall-' + n}
              id={from.id}
              idDup={true}
              line={options[from.id].line}
              color={from.color}
              from={from}
              to={points[wrap(from.id + 1)]}
              next={points[wrap(from.id + 2)]}
              prev={points[wrap(from.id - 1)]}
              // features={features[n]}
              highlightWalls={highlightWalls}
              showMeasurementLines={showMeasurementLines}
              handleClick={insertPoint}
              hover={hover}
              onHover={doHover}
              onDragStart={dragStart}
              onDrag={moveWall}
              onDragEnd={dragEnd}
              onResize={resizeWall}
            />
          )
        })}
      </group>

      {axisPair &&
        axisPair.map((axis, i) => <RadialGrid key={i} coords={axis} />)}
    </>
  )

  /**
   * Show measurement lines while dragging corners and walls.
   */
  function showMeasurementLines(id = null, dragType = null) {
    const newArray = options.map((option) => {
      const a = wrap(id - 1) // update option
      const b = dragType === 'corner' ? id : wrap(id + 1)

      // revert
      if (id === null) return { ...option, line: false }

      // highlight walls when corner is dragged
      if (dragType === 'corner' && (a === option.id || b === option.id)) {
        return { ...option, line: true }
      }

      // highlight walls when corner is dragged
      if (dragType === 'wall' && (a === option.id || b === option.id)) {
        return { ...option, line: true }
      } else if (dragType === 'wall' && id === option.id) {
        return { ...option, line: false }
      }

      return option
    })
    setOptions(newArray)
  }

  /**
   * Adds highlighting to walls, when hovering over a wall or corner.
   */
  function highlightWalls(id = null, dragType = null) {
    if (view !== '2d') return
    const newArray = points.map((point) => {
      const a = wrap(id - 1) // update point
      const b = dragType === 'corner' ? id : wrap(id + 1)

      // revert
      if (id === null) return { ...point, color: '#C8C8C8' }

      // highlight walls when corner is dragged
      if (dragType === 'corner' && (a === point.id || b === point.id)) {
        return { ...point, color: '#8DB3FF' }
      }

      // highlight walls when corner is dragged
      if (dragType === 'wall' && (a === point.id || b === point.id)) {
        return { ...point, color: '#C8C8C8' }
      } else if (dragType === 'wall' && id === point.id) {
        return { ...point, color: '#8DB3FF' }
      }

      return point
    })
    setPoints(newArray)
  }

  /**
   * Updates the 'current' hover target. This is either a wall or a corner,
   * with a preference for the latter if there's a conflict.
   */
  function doHover(ev, isHover) {
    console.log(ev)
    if (dragBase.current) return
    if (isHover) over.current.add(ev.eventObject)
    else over.current.delete(ev.eventObject)

    const top = ev.intersections?.find((t) => over.current.has(t.eventObject))
    setHover(top ? top.eventObject : undefined)
  }

  /**
   * Saves the wall vertex coordinates when a drag starts, so that we can
   * update their positions dynamically but always know their starting
   * positions.
   */
  function dragStart() {
    dragBase.current = points.slice()
  }

  function dragEnd() {
    dragBase.current = undefined
  }

  /**
   * Callback to handle resizing a wall through its dimension line. Moves the
   * start and end of the next wall (clockwise) by the required amount (dx, dz)
   * to extend the indicated wall, then calculates where this modified wall will
   * intersect the wall after that, so as to keep internal angles the same.
   *
   * @param {number} id - Identifier for wall that's been changed
   * @param {number} dl - Delta length
   */
  function resizeWall(id, dl) {
    const start = points[id]
    const end = points[wrap(id + 1)]
    const next = points[wrap(id + 2)]
    const after = points[wrap(id + 3)]
    const theta = Math.atan2(end.z - start.z, end.x - start.x)
    const dx = dl * Math.cos(theta)
    const dz = dl * Math.sin(theta)
    let from = { ...end }
    let to = { ...next }
    from.x += dx
    from.z += dz
    to.x += dx
    to.z += dz

    Object.assign(to, intersection(from, to, next, after) || {})

    const newArray = points.map((point) => {
      if (point.id === wrap(id + 1)) return from
      if (point.id === wrap(id + 2)) return to
      return point
    })
    setPoints(newArray)
  }

  /**
   * Callback to drag a wall to a new position. The Wall component constrains
   * movement (dx & dz) to be perpendicular (orthogonal) to the direction of
   * the wall. We calculate new start and end points for the wall segment and
   * then work out the intersection with adjacent walls.
   */
  function moveWall(data) {
    const { id, dx, dz } = data
    const start = dragBase.current[id]
    const end = dragBase.current[wrap(id + 1)]
    const prev = dragBase.current[wrap(id - 1)]
    const next = dragBase.current[wrap(id + 2)]
    let from = { ...start }
    let to = { ...end }

    from.x += dx
    from.z += dz
    to.x += dx
    to.z += dz
    const p1 = intersection(from, to, prev, start)
    const p2 = intersection(from, to, end, next)

    if (!p1 || !p2) return

    const newArray = points.map((point) => {
      if (point.id === id) return { ...point, ...p1 }
      if (point.id === (id + 1) % points.length) return { ...point, ...p2 }
      return point
    })
    setPoints(newArray)
  }

  /**
   * Calculates the intersection between two lines, representing room walls.
   * See here for algorithm:
   *    https://en.wikipedia.org/wiki/Line–line_intersection
   * @param {Point} p1 - Start of line A
   * @param {Point} p2 - End of line A
   * @param {Point} p3 - Start of line B
   * @param {Point} p4 - End of line B
   * @returns {Point}
   */
  function intersection(p1, p2, p3, p4) {
    const d = (p1.x - p2.x) * (p3.z - p4.z) - (p1.z - p2.z) * (p3.x - p4.x)
    if (Math.abs(d) < 0.5) return undefined
    return {
      x:
        ((p1.x * p2.z - p1.z * p2.x) * (p3.x - p4.x) -
          (p1.x - p2.x) * (p3.x * p4.z - p3.z * p4.x)) /
        d,
      z:
        ((p1.x * p2.z - p1.z * p2.x) * (p3.z - p4.z) -
          (p1.z - p2.z) * (p3.x * p4.z - p3.z * p4.x)) /
        d
    }
  }

  /**
   * Callback to drag a corner to a new position.
   */
  function moveCorner(data) {
    const { id, dx, dz } = data
    const pt = { ...dragBase.current[id] }
    const prev = dragBase.current[wrap(id - 1)]
    const next = dragBase.current[wrap(id + 1)]
    pt.x += dx
    pt.z += dz

    const newArray = points.map((point) => {
      if (point.id !== id) return point
      return { ...point, ...snapRadial(pt, prev, next) }
    })

    setPoints(newArray)
  }

  /**
   * Callback to remove redundant points on drag end.
   */
  function removeRedundantPoints(id, at, next, post, prev, pro) {
    let arr = []
    const proPrevWallAngle = Math.atan2(prev.z - pro.z, prev.x - pro.x)
    const prevAtWallAngle = Math.atan2(at.z - prev.z, at.x - prev.x)
    const atNextWallAngle = Math.atan2(next.z - at.z, next.x - at.x)
    const nextPostWallAngle = Math.atan2(post.z - next.z, post.x - next.x)

    const mitreEndA = Math.abs(prevAtWallAngle - proPrevWallAngle) % 3.14159 // mitreEnd if 0 delete point id - 1
    const mitreEndB = Math.abs(atNextWallAngle - prevAtWallAngle) % 3.14159 // mitreEnd if 0 delete point id
    const mitreEndC = Math.abs(nextPostWallAngle - atNextWallAngle) % 3.14159 // mitreEnd if 0 delete point id + 1

    if (mitreEndA.toFixed(5) == 0) {
      arr.push(id - 1)
    }
    if (mitreEndB.toFixed(5) == 0) {
      arr.push(id)
    }
    if (mitreEndC.toFixed(5) == 0) {
      arr.push(id + 1)
    }
    if (arr.length === 0) return

    // filter out points that match one of the ids in the arry
    const filtered = points.filter((p) => !arr.some((id) => id === p.id))
    const newArray = filtered.map((p, i) => {
      console.log({ ...p, id: i })
      return { ...p, id: i }
    })

    setPoints(newArray)
  }

  function insertPoint(id, x, z) {
    const arr = [...points]
    arr.splice(id + 1, 0, { id, x, z, color: '#C8C8C8' })

    const newPoints = arr.map((p, i) => ({ ...p, id: i }))
    const newOptions = arr.map((p, i) => {
      return { id: p.id, line: false }
    })

    setOptions(newOptions)
    setPoints(newPoints)
    setHover(undefined)
  }

  /**
   * If the current drag position is 'near' a radial grid line from either of
   * the adjacent corners, snap it to that line. If near to an intersection,
   * snap to that. Otherwise return the drag position unchanged.
   * @param {Point} pt   - Current drag position
   * @param {Point} prev - Vertex prior to one being dragged
   * @param {Point} next - Vertex after the one being dragged
   * @returns {Point}
   */
  function snapRadial(pt, prev, next) {
    if (!pt) return pt
    const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
    const dsnap = 0.1
    const pp = radialIntersect(pt, prev)
    const pn = radialIntersect(pt, next)
    const is = intersection(prev, pp, next, pn)
    const dpp = dist(pt, pp)
    const dpn = dist(pt, pn)
    const dis = is ? dist(pt, is) : dsnap * 2
    if (dis < dsnap) {
      return is
    }
    if (dpp < dsnap || dpn < dsnap) {
      return dpp < dpn ? pp : pn
    }
    return pt
  }

  /**
   * Calculates the nearest point on a radial grid line, emanating from the
   * given centre.
   * @param {Point} pt   - Current drag position
   * @param {Point} from - Grid origin
   * @returns {Point}
   */

  function radialIntersect(pt, from) {
    const dx = pt.x - from.x
    const dz = pt.z - from.z

    // Calculate angle of line from grid origin to drag position, then round
    // to nearest grid radial line.
    const theta = Math.atan2(dz, dx)
    const grid = Math.PI / 8
    const thetaGrid = Math.round(theta / grid) * grid

    // Return the point on that radial grid line that is the same distance
    // from the grid origin as the drag position.
    const dist = Math.sqrt(dx * dx + dz * dz)
    return {
      x: from.x + dist * Math.cos(thetaGrid),
      z: from.z + dist * Math.sin(thetaGrid)
    }
  }

  function hideWalls() {
    if (view === '2d') return
    const sceneRotation = radToDeg(orbitControls.current.getAzimuthalAngle())
    walls.current.traverse((obj) => {
      if (obj.name) {
        const wallRotation = radToDeg(obj.rotation.z)
        if (isWallFacingCamera(sceneRotation, wallRotation)) {
          obj.visible = false
        } else {
          obj.visible = true
        }
      }
    })
  }

  function isWallFacingCamera(sceneRotation, wallRotation) {
    let relativeAngle = (wallRotation + sceneRotation + 360) % 360
    return relativeAngle >= 120 && relativeAngle <= 240
  }

  /**
   * A visual representation of the radual grids for development perposes
   * only.
   */

  function createRadialGrid(id) {
    if (id === null) {
      setAxisPair(false)
      return
    }

    const pair = points.filter((point) => {
      const a = wrap(id + 1)
      const b = wrap(id - 1)

      if (a === point.id || b === point.id) {
        return { x: point.x, z: point.z }
      }
    })
    setAxisPair(pair)
  }
}
