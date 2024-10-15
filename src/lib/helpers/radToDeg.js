export function radToDeg(rad) {
  return (rad * (180 / Math.PI) + 360) % 360
}

// const conv =
//   (orbitControls.current.getAzimuthalAngle() * (180 / Math.PI) + 360) % 360
