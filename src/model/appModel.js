import { intersection } from '@/utils/mathutils'
import { floorPlans } from './floorPlans'
import { wt } from '@/const'
import { Vector3 } from 'three'

export const initialState = {
  walls: [],
  openings: [],
  divider: [],
  units: [],
  worktop: '#666666',
  color: '#F0F0F0',
  wall: '#BFBFBF',
  floor: { id: 'checkers', colorA: '#EEEEEE', colorB: '#000000' },
  cart: []
}

let keepCopy = true

const wrap = (a, n, s) => (s ? a[n] : a[(n + a.length) % a.length])

const actions = {
  setId,
  loadState,
  loadModel,
  setModel, // replaces the current model with a saved one
  resetModel,
  setScheme, // color of cabinets worktop and wall
  addSegment,
  moveCorner,
  moveWall,
  resizeWall,
  addPoint,
  removeSegment,
  addOpening,
  moveOpening,
  deleteOpening,
  addUnit,
  moveUnit,
  deleteUnit,
  addToCart,
  resetCart,
  removeCartItem
}

export function updateModel(state, action) {
  const reducer = actions[action.id]
  if (!reducer) console.error('Unknown action', action)
  return reducer ? saveState(reducer(state, action)) : state
}

/**
 * Saves the (new) model to browser local storage.
 */
function saveState(state) {
  try {
    if (keepCopy)
      window.localStorage.setItem('dorset-model', JSON.stringify(state))
  } catch (err) {
    console.warn('Local storage disabled', err)
    keepCopy = false
  }
  return state
}

/**
 * Loads or sets an initial state. If a saved model is found in browser
 * local storage then that is read and parsed, otherwise an 'empty' state
 * is returned.
 */
export function loadState(initial, action) {
  try {
    const saved = window.localStorage.getItem('dorset-model')
    let state
    if (saved) {
      state = Object.assign({ ...initialState }, JSON.parse(saved))
      if (!state.floor?.id) {
        // If the saved model does not have a floor pattern, set it to default.
        state.floor = initialState.floor
      }
    }
    return state ?? loadModel(initial, action)
  } catch (err) {
    return loadModel(initial, action)
  }
}

/**
 * Resets the floor plan to a selected shape.
 */
function loadModel(state, { shape }) {
  const walls = [
    floorPlans[shape].map((pt, n) => ({ ...pt, id: n, segment: 0 }))
  ]
  const { worktop, color, floor } = state
  return {
    ...initialState,
    walls,
    worktop,
    color,
    floor
  }
}

/**
 * Loads a saved model from the server, replacing the current state.
 */
function setModel(state, { model }) {
  const newState = {
    ...initialState,
    ...model
  }
  if (!newState.floor?.id) {
    // If the saved model does not have a valid floor pattern, set it to default.
    newState.floor = initialState.floor
  }
  return newState
}

/**
 * Resets the model to an empty state, with no walls, units or openings.
 */
function resetModel(state) {
  const { walls, units, openings, divider, ...rest } = state
  return {
    ...initialState,
    walls: [floorPlans.square.map((pt, n) => ({ ...pt, id: n, segment: 0 }))],
    ...rest
  }
}

/**
 * Sets the saved model id and timestamp.
 */
function setId(state, { modelId, dateSaved }) {
  return {
    ...state,
    id: modelId,
    dateSaved
  }
}

/**
 * Sets the color scheme (worktop and unit face).
 */
function setScheme(state, { worktop, color, wall, floor }) {
  return {
    ...state,
    worktop,
    color,
    wall,
    floor
  }
}

/**
 * Adds a new wall segment, attached to the given outer wall (identified by its
 * id).
 */
function addSegment(state, { wall }) {
  let nextId = state.walls.flat().reduce((m, p) => (p.id > m ? p.id : m), 0) + 1
  const n = state.walls[0].findIndex((w) => w.id === wall)
  if (n < 0) return state

  const from = state.walls[0][n]
  const to = wrap(state.walls[0], n + 1, 0)
  const angle = Math.atan2(to.z - from.z, to.x - from.x) + Math.PI / 2
  const mid = { x: (from.x + to.x) / 2, z: (from.z + to.z) / 2 }

  const ns = state.walls.length
  const start = {
    x: mid.x + (wt / 2) * Math.cos(angle),
    z: mid.z + (wt / 2) * Math.sin(angle),
    id: nextId++,
    segment: ns
  }
  const end = {
    x: mid.x + (1 + wt / 2) * Math.cos(angle),
    z: mid.z + (1 + wt / 2) * Math.sin(angle),
    id: nextId,
    segment: ns
  }

  return {
    ...state,
    walls: state.walls.toSpliced(ns, 0, [start, end]),
    dateSaved: null
  }
}

/**
 * Moves a corner (vertex between walls) to a new position.
 */
function moveCorner(state, { to, dragging }) {
  const s = to.segment
  let segment = state.walls[s]
  const idx = segment.findIndex((p) => p.id === to.id)
  segment = segment.toSpliced(idx, 1, to)

  state = {
    ...state,
    walls: state.walls.toSpliced(s, 1, segment),
    dateSaved: null
  }
  if (!dragging) state = removeRedundantPoints(state, segment)
  return state
}

/**
 * Moves a given wall, parallel to its previous position.
 */
function moveWall(state, { from, dragging }) {
  const s = from.segment
  let segment = state.walls[s]
  const idx = segment.findIndex((p) => p.id === from.id)
  const start = segment[idx]
  const end = wrap(segment, idx + 1, s)
  const prev = wrap(segment, idx - 1, s)
  const next = wrap(segment, idx + 2, s)

  const dx = from.x - start.x
  const dz = from.z - start.z

  let to = { ...end, x: end.x + dx, z: end.z + dz }

  Object.assign(from, intersection(from, to, prev, start) ?? {})
  Object.assign(to, intersection(from, to, end, next) ?? {})

  segment = segment.map((p) =>
    p.id === from.id ? from : p.id === to.id ? to : p
  )

  state = {
    ...state,
    walls: state.walls.toSpliced(s, 1, segment),
    dateSaved: null
  }
  if (!dragging) state = removeRedundantPoints(state, segment)
  return state
}

/**
 * Removes wall 'corners' (vertices) where a wall segment is either 'too
 * short' or two adjacent segments are very nearly parallel.
 */
function removeRedundantPoints(state, segment) {
  const s = state.walls.indexOf(segment)
  let walls = []
  let openings = state.openings
  let prev = wrap(segment, -1, s)
  segment.forEach((pt, n, a) => {
    // If no previous point then this is an inner wall, so just record start.
    if (!prev) {
      walls.push(pt)
      prev = pt
      return
    }

    // If no next then this is an inner wall, so just record end.
    const next = wrap(a, n + 1, s)
    if (!next) {
      walls.push(pt)
      return
    }

    // If this point is 'too close' to the previous one, or to the next, or
    // 'in line' with the next then discard it, moving any openings to the
    // wall leading to this point.
    const dprev = Math.sqrt((pt.x - prev.x) ** 2 + (pt.z - prev.z) ** 2)
    const dnext = Math.sqrt((next.z - pt.z) ** 2 + (next.x - pt.x) ** 2)
    const angleNext = Math.atan2(next.z - pt.z, next.x - pt.x)
    const anglePrev = Math.atan2(pt.z - prev.z, pt.x - prev.x)
    if (dprev < 0.01 || dnext < 0.01 || Math.abs(angleNext - anglePrev) < 0.1) {
      state.openings.forEach((op, n) => {
        if (op.wall === pt.id) {
          openings = openings.toSpliced(n, 1, {
            ...op,
            wall: prev.id,
            offset: op.offset + dprev
          })
        }
      })
    } else {
      walls.push(pt)
      prev = pt
    }
  })

  // If we end up with the same number of points then we just return the
  // original state, otherwise we update this segment.
  if (walls.length === segment.length) return state
  else
    return {
      ...state,
      walls: state.walls.map((s) => (s === segment ? walls : s)),
      openings,
      dateSaved: null
    }
}

/**
 * Resizes a wall, altering adjacent walls accordingly. Note that openings
 * are NOT moved in this process unless resizing results in a redundant
 * vertex.
 */
function resizeWall(state, { from, len }) {
  const s = from.segment
  let segment = state.walls[s]
  const idx = segment.findIndex((p) => p.id === from.id)
  const start = segment[idx]
  const end = wrap(segment, idx + 1, s)
  const next = wrap(segment, idx + 2, s)
  const after = wrap(segment, idx + 3, s)
  const theta = Math.atan2(end.z - start.z, end.x - start.x)

  // Calculate how far the end of the wall must move, to give it the new
  // length.
  const dx = start.x + len * Math.cos(theta) - end.x
  const dz = start.z + len * Math.sin(theta) - end.z

  // Add that 'delta' to both start and end of the wall that follows.
  from = { ...end, x: end.x + dx, z: end.z + dz }
  const to = next && { ...next, x: next.x + dx, z: next.z + dz }

  // Calculate where newly moved wall will now intersect the one after that.
  if (to) Object.assign(to, intersection(from, to, next, after) || {})

  segment = segment.map((p) =>
    p.id === from.id ? from : p.id === to?.id ? to : p
  )

  state = {
    ...state,
    walls: state.walls.toSpliced(s, 1, segment),
    dateSaved: null
  }
  return removeRedundantPoints(state, segment)
}

/**
 * Adds a new vertex into an existing wall, re-siting any openings that lie
 * beyond this point.
 */
function addPoint(state, { from, at }) {
  const nextId =
    state.walls.flat().reduce((m, p) => (p.id > m ? p.id : m), 0) + 1
  const s = from.segment
  let segment = state.walls[s]
  const idx = segment.findIndex((p) => p.id === from.id)
  const pt = { id: nextId, x: at.x, z: at.z, segment: from.segment }
  const d = Math.sqrt((pt.x - from.x) ** 2 + (pt.z - from.z) ** 2)
  let openings = state.openings
  state.openings.forEach((op, n) => {
    if (op.wall === from.id && op.offset >= d) {
      openings = openings.toSpliced(n, 1, {
        ...op,
        wall: nextId,
        offset: op.offset - d
      })
    }
  })

  segment = segment.toSpliced(idx + 1, 0, pt)

  return {
    ...state,
    walls: state.walls.toSpliced(s, 1, segment),
    openings,
    dateSaved: null
  }
}

/**
 * Removes an interior wall.
 */
function removeSegment(state, { segment: s }) {
  if (s <= 0) return state // Cannot remove outer wall
  return {
    ...state,
    walls: state.walls
      .toSpliced(s, 1)
      .map((w) =>
        w[0].segment > s ? w.map((p) => ({ ...p, segment: p.segment - 1 })) : w
      ),
    dateSaved: null
  }
}

/**
 * Adds a new opening in the given wall.
 */
function addOpening(state, { type, style, option, wall, width }) {
  const id = state.openings.reduce((id, o) => Math.max(id, o.id), -1) + 1
  return {
    ...state,
    openings: state.openings.concat({
      id,
      type,
      style,
      option,
      wall,
      width,
      offset: wt + width / 2
    }),
    dateSaved: null
  }
}

/**
 * Moves an opening to a new offset.
 */
function moveOpening(state, { item, offset }) {
  const o = state.openings.findIndex((o) => o.id === item)
  return {
    ...state,
    openings: state.openings.toSpliced(o, 1, {
      ...state.openings[o],
      offset
    }),
    dateSaved: null
  }
}

/**
 * Deletes an opening.
 */
function deleteOpening(state, { item }) {
  return {
    ...state,
    openings: state.openings.filter((o) => o.id !== item),
    dateSaved: null
  }
}

/**
 * Adds a new kitchen unit.
 */
function addUnit(state, { type, width, variant, style }) {
  const id = state.units.reduce((id, u) => Math.max(id, u.id), -1) + 1
  return {
    ...state,
    units: state.units.concat({
      id,
      type,
      width,
      depth: type === 'wall' ? 300 : style?.includes('shallow') ? 282 : 573,
      height: type === 'base' ? 840 : 2130,
      variant,
      style,
      pos: new Vector3(0, 0, 0),
      rotation: 0
    }),
    dateSaved: null
  }
}

/**
 * Moves a kitchen unit to a new position. Any snapping MUST be calculated by
 * the caller, as state updates are deferred and this routine can only return
 * a new state
 */
function moveUnit(state, { unit, pos, rotation }) {
  const n = state.units.findIndex((u) => u.id === unit)
  return {
    ...state,
    units: state.units.toSpliced(n, 1, { ...state.units[n], pos, rotation }),
    dateSaved: null
  }
}

/**
 * Deletes a kitchen unit.
 */
function deleteUnit(state, { unit }) {
  return {
    ...state,
    units: state.units.filter((u) => u.id !== unit),
    dateSaved: null
  }
}

/**
 * Adds an item to the shopping cart.
 */
function addToCart(state, { unit, finish }) {
  const cart = state.cart.concat({
    ...unit,
    depth:
      unit.type === 'wall' ? 300 : unit.style?.includes('shallow') ? 282 : 573,
    height: unit.type === 'base' ? 840 : 2130,
    finish,
    id: state.cart.reduce((id, u) => Math.max(id, u.id), -1) + 1
  })
  return {
    ...state,
    cart
  }
}

/**
 * Resets the cart to an empty state.
 */
function resetCart(state) {
  return {
    ...state,
    cart: []
  }
}

/**
 * Removes an item from the cart.
 */
function removeCartItem(state, { item }) {
  const match =
    item.type === 'appliance'
      ? state.cart.findIndex((u) => u.code === item.code)
      : state.cart.findIndex((u) => u.id === item.unit.id)
  if (match < 0) return state // Item not found in cart
  return {
    ...state,
    cart: state.cart.toSpliced(match, 1)
  }
}
