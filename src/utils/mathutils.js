/**
 * @typedef {{
 *    x: number
 *    z: number
 * }} Point
 */

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
export function intersection(p1, p2, p3, p4) {
  if (!p3 || !p4) return undefined
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
 * Calculates the nearest point on a radial grid line, emanating from the
 * given centre.
 * @param {Point} pt   - Current drag position
 * @param {Point} from - Grid origin
 * @returns {Point}
 */
export function radialIntersect(pt, from) {
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
