import Wall from './Wall'
import { square } from './floorplans'

export default function FloorPlan() {
  const walls = square()
  return walls.map((wall, i) => <Wall key={i} params={wall} />)
}
