export function isWithinRange(value, target) {
  const range = 0.01
  return value >= target - range && value <= target + range
}
