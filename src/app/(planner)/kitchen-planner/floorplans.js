// Starting shapes

export const square = () => {
  const wall = 2

  // gpz = end ? py / 2 : -(py / 2),
  //   gpx = px,

  return [
    {
      w: wall,
      h: 1,
      t: 0.15,
      x: -1,
      z: 0.5,
      theta: Math.PI * 0.0
    }
    // {
    //   w: wall,
    //   h: 1,
    //   t: 0.15,
    //   x: 1,
    //   z: 0.5,
    //   theta: Math.PI * 0
    // }
  ]
}
