// Starting shapes

export const square = () => {
  const wall = 2

  return [
    {
      id: 0,
      w: wall,
      h: 1,
      t: 0.15,
      x: -1,
      z: 0.5,
      theta: Math.PI * 0.0
    },
    {
      id: 1,
      w: wall,
      h: 1,
      t: 0.15,
      x: 1,
      z: 0.5,
      theta: Math.PI * 0.5
    }
  ]
}
// Floor plan takes responsibility for rendering the walls
// Reducer handles the geometry computations e.g.
// Child passes back info about itself (new position and
// angle [that's what's passed into it]) and then the reducer,
// calculates what happens as a result.
