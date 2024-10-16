// starting shapes
export const square = (l = 3.15) => {
  return [
    { id: 0, x: -l / 2, z: -l / 2, color: '#D9D8D8', line: false }, // top left
    { id: 1, x: l / 2, z: -l / 2, color: '#D9D8D8', line: false }, // top right
    { id: 2, x: l / 2, z: l / 2, color: '#D9D8D8', line: false }, // bottom right
    { id: 3, x: -l / 2, z: l / 2, color: '#D9D8D8', line: false } // bottom left
  ]
}

export const slice = (l = 3) => {
  return [
    { id: 0, x: -l / 2, z: -l / 2, color: '#D9D8D8', line: false },
    { id: 1, x: l / 8, z: -l / 2, color: '#D9D8D8', line: false },
    { id: 2, x: l / 2, z: -l / 8, color: '#D9D8D8', line: false },
    { id: 3, x: l / 2, z: l / 2, color: '#D9D8D8', line: false },
    { id: 4, x: -l / 2, z: l / 2, color: '#D9D8D8', line: false }
  ]
}
