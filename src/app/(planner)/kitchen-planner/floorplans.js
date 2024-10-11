// starting shapes
export const square = (l = 3) => {
  return [
    { id: 1, x: -l / 2, z: -l / 2 }, // top left
    { id: 2, x: l / 2, z: -l / 2 }, // top right
    { id: 3, x: l / 2, z: l / 2 }, // bottom right
    { id: 4, x: -l / 2, z: l / 2 } // bottom left
  ]
}

export const slice = (l = 3) => {
  return [
    { id: 1, x: -l / 2, z: -l / 2 },
    { id: 2, x: l / 8, z: -l / 2 },
    { id: 3, x: l / 2, z: -l / 8 },
    { id: 4, x: l / 2, z: l / 2 },
    { id: 5, x: -l / 2, z: l / 2 }
  ]
}
