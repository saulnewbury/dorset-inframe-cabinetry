export default function deriveLineColor(bgColorHex) {
  // Validate input: if not a proper hex color, return a default line color.
  if (
    !bgColorHex ||
    typeof bgColorHex !== 'string' ||
    !/^#?[0-9A-Fa-f]{6}$/.test(bgColorHex)
  ) {
    return '#989898' // Default fallback color
  }

  // Remove '#' if present.
  const hex = bgColorHex.startsWith('#') ? bgColorHex.slice(1) : bgColorHex

  // Parse the RGB components.
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Helper function to transform a single channel value.
  function transformChannel(c) {
    // Map channel value (0–255) to an index in [0, 127]
    // This mapping gives every index twice except possibly at the very end.
    const i = Math.floor(c / 2)

    // Calculate offset: at i = 0, offset is +49; at i = 127, offset is -88.
    const offset = 49 - (137 * i) / 127

    // Compute new channel value and ensure it stays within bounds.
    const newC = Math.round(c + offset)
    return Math.max(0, Math.min(255, newC))
  }

  // Transform each channel.
  const newR = transformChannel(r)
  const newG = transformChannel(g)
  const newB = transformChannel(b)

  // Convert the results back to a hex string.
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}
