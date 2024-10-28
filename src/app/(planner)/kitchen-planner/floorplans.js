// starting shapes
export const square = (l = 5.15) => {
  return [
    {
      id: 0,
      x: -l / 2,
      z: -l / 2,
      color: '#D9D8D8',
      features: [{ type: 'window', width: 1.8, height: 0.8, offset: 0.53 }]
    }, // top left
    {
      id: 1,
      x: l / 2,
      z: -l / 2,
      color: '#D9D8D8',
      features: [{ type: 'door:left:in', width: 1.2, offset: 0.5 }]
    }, // top right
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
