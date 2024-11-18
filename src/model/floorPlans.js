export const floorPlans = {
  square: ((l = 5.15) => [
    { x: -l / 2, z: -l / 2 },
    { x: l / 2, z: -l / 2 },
    { x: l / 2, z: l / 2 },
    { x: -l / 2, z: l / 2 }
  ])(),

  slice: ((l = 5) => [
    { x: -l / 2, z: -l / 2 },
    { x: l / 8, z: -l / 2 },
    { x: l / 2, z: -l / 8 },
    { x: l / 2, z: l / 2 },
    { x: -l / 2, z: l / 2 }
  ])(),

  notch: ((l = 5) => [
    { x: -l / 2, z: -l / 2 },
    { x: l / 2 - l / 5, z: -l / 2 },
    { x: l / 2 - l / 5, z: -l / 2 + l / 5 },
    { x: l / 2, z: -l / 2 + l / 5 },
    { x: l / 2, z: l / 2 },
    { x: -l / 2, z: l / 2 }
  ])()
}
