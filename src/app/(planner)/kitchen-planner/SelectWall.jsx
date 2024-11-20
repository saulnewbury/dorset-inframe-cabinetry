import { useContext } from 'react'
import { ModelContext } from '@/model/context'
import { radToDeg } from 'three/src/math/MathUtils'

/**
 * Component used in 'opening' dialogs to allow an initial wall to be selected.
 * Displays the walls as SVG elements on which the user can click to select.
 */
export default function SelectWall({ value, onChange = () => {} }) {
  const [model] = useContext(ModelContext)
  const b = boundingBox(model.walls[0] ?? [])
  const wrap = (a, n) => a[(n + a.length) % a.length]

  return (
    <svg
      viewBox={[b.left, b.top, b.width, b.height].join(' ')}
      onClick={getSegment}
      height='150'
    >
      {model.walls[0]?.map((from, n, a) => (
        <WallSegment
          key={from.id}
          id={from.id}
          from={from}
          to={wrap(a, n + 1)}
          prev={wrap(a, n - 1)}
          next={wrap(a, n + 2)}
          isHighlight={from.id === value}
        />
      ))}
    </svg>
  )

  function getSegment(ev) {
    const id = parseInt(ev.target.dataset.id ?? '')
    if (!isNaN(id)) onChange(id)
  }
}

/**
 * Child component to render a single wall, as an SVG polygon.
 */
function WallSegment({ id, from, to, prev, next, isHighlight }) {
  const dx = to.x - from.x
  const dz = to.z - from.z
  const len = Math.sqrt(dx * dx + dz * dz)
  const mid = { x: from.x + dx / 2, y: from.z + dz / 2 }
  const angle = Math.atan2(dz, dx)
  const anglePrev = Math.atan2(from.z - prev.z, from.x - prev.x)
  const angleNext = Math.atan2(next.z - to.z, next.x - to.x)
  const clamp = (a) => (Math.abs(a) < 3 ? a : 0)
  const ts = 0.4 * clamp(Math.tan((angle - anglePrev) / 2))
  const te = 0.4 * clamp(Math.tan((angleNext - angle) / 2))
  const points = [
    { x: mid.x + (len - te) / 2, y: mid.y + 0.2 },
    { x: mid.x + (len + te) / 2, y: mid.y - 0.2 },
    { x: mid.x - (len + ts) / 2, y: mid.y - 0.2 },
    { x: mid.x - (len - ts) / 2, y: mid.y + 0.2 }
  ]
  const colour = isHighlight ? '#74d3e8' : 'gray'
  return (
    <polygon
      data-id={id}
      points={points.map((p) => `${p.x},${p.y}`).join(' ')}
      fill={colour}
      stroke={colour}
      strokeWidth='0.01'
      transform={`rotate(${radToDeg(angle)} ${mid.x} ${mid.y})`}
      className='hover:cursor-pointer'
    />
  )
}

/**
 * Called to calculate the bounding box for the SVG. We use wall coordinates,
 * as in the ThreeJS scene.
 */
function boundingBox(points) {
  const { x, z } = points[0] ?? { x: 0, z: 0 }
  const r = { left: x, top: z, right: x, bottom: z }
  for (const p of points) {
    if (p.x < r.left) r.left = p.x
    else if (p.x > r.right) r.right = p.x
    if (p.z < r.top) r.top = p.z
    else if (p.z > r.bottom) r.bottom = p.z
  }
  // Expand the box a little, to ensure that walls don't fall off the edge.
  r.left -= 0.2
  r.top -= 0.2
  r.right += 0.2
  r.bottom += 0.2
  r.width = r.right - r.left
  r.height = r.bottom - r.top
  return r
}
