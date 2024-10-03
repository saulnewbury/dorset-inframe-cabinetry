export function calculateAdjacent(hypotenuse, thetaInDegrees) {
  // Convert theta from degrees to radians
  let thetaInRadians = thetaInDegrees * (Math.PI / 180)

  // Calculate the adjacent side
  // let adjacent = hypotenuse * Math.cos(thetaInRadians)
  let adjacent = hypotenuse * Math.cos(thetaInDegrees)

  return adjacent
}

export function calculateOpposite(hypotenuse, thetaInDegrees) {
  // Convert theta from degrees to radians
  let thetaInRadians = thetaInDegrees * (Math.PI / 180)

  // Calculate the opposite side
  // let opposite = hypotenuse * Math.sin(thetaInRadians)
  let opposite = hypotenuse * Math.sin(thetaInDegrees)

  return opposite
}
