// starting shapes
export const square = (l = 3) => {
  return [
    { id: 0, x: -l / 2, z: -l / 2, color: '#D9D8D8' }, // top left
    { id: 1, x: l / 2, z: -l / 2, color: '#D9D8D8' }, // top right
    { id: 2, x: l / 2, z: l / 2, color: '#D9D8D8' }, // bottom right
    { id: 3, x: -l / 2, z: l / 2, color: '#D9D8D8' } // bottom left
  ]
}

export const slice = (l = 3) => {
  return [
    { id: 0, x: -l / 2, z: -l / 2, color: '#D9D8D8' },
    { id: 1, x: l / 8, z: -l / 2, color: '#D9D8D8' },
    { id: 2, x: l / 2, z: -l / 8, color: '#D9D8D8' },
    { id: 3, x: l / 2, z: l / 2, color: '#D9D8D8' },
    { id: 4, x: -l / 2, z: l / 2, color: '#D9D8D8' }
  ]
}
