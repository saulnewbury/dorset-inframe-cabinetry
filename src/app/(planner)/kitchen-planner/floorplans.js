// Starting shapes

// x and z are world coordinates

export const square = (l = 3) => {
  return [
    { id: 1, x: -l / 2, z: -l / 2 }, // top left
    { id: 2, x: l / 2, z: -l / 2 }, // top right
    { id: 3, x: l / 2, z: l / 2 }, // bottom right
    { id: 4, x: -l / 2, z: l / 2 } // bottom left
  ]
  // return [
  //   { id: 1, x: -l / 3, z: -l / 2 }, // top left
  //   { id: 2, x: l / 2, z: -l / 2 }, // top right
  //   { id: 3, x: l / 5, z: l / 2 }, // bottom right
  //   { id: 4, x: -l / 2, z: l / 2 } // bottom left
  // ]
}
// Floor plan takes responsibility for rendering the walls
// Reducer handles the geometry computations e.g.
// Child passes back info about itself (new position and
// angle [that's what's passed into it]) and then the reducer,
// calculates what happens as a result.
