// Make sure cabinet colour stands out

export default function deriveLineColor(bgColorHex) {
  // Remove the '#' if present
  const hex = bgColorHex.startsWith('#') ? bgColorHex.slice(1) : bgColorHex

  // Extract the RGB components from the hex string
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Define the offset (88 in decimal)
  const offset = 88

  // Subtract the offset from each channel, using modulo 256 for wrapping
  const lineR = (r - offset + 256) % 256
  const lineG = (g - offset + 256) % 256
  const lineB = (b - offset + 256) % 256

  // Convert back to a two-character hexadecimal string
  const toHex = (n) => n.toString(16).padStart(2, '0')

  // Construct the resulting hex color string
  return `#${toHex(lineR)}${toHex(lineG)}${toHex(lineB)}`
}
