// Window

const height = 1.1,
  width = 1.4,
  totalHeightFromFloor = 1

export const casing = [
  {
    pos: [-width / 2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    len: height
  },
  {
    pos: [width / 2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    len: height
  },
  {
    pos: [0, -height / 2, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    len: width
  },
  {
    pos: [0, height / 2, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    len: width
  }
]
