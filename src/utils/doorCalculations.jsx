// utils/doorCalculations.js

/**
 * Calculate door boundaries for each hole based on the number of holes
 * @param {Object} params - Parameters for calculating door boundaries
 * @returns {Array} Array of hole boundary objects
 */
export function calculateDoorBoundaries({
  numHoles,
  holeHeight,
  holeWidth,
  holeYOffset,
  dividerThicknessM,
  pt
}) {
  const boundaries = []

  // Define hole boundaries
  const holeBottom = -holeHeight / 2 + holeYOffset
  const holeTop = holeHeight / 2 + holeYOffset - pt
  const totalHoleHeight = holeTop - holeBottom

  if (numHoles === 1) {
    // Single hole
    boundaries.push({
      bottom: holeBottom,
      top: holeTop,
      left: -holeWidth / 2,
      right: holeWidth / 2
    })
  } else if (numHoles === 3) {
    // Special case for 3 holes with ratio 8321 : 8312 : 4925
    const ratios = [8321, 8312, 4925]
    const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0)

    // Calculate available height after accounting for dividers
    const numDividers = numHoles - 1
    const availableHeight = totalHoleHeight - numDividers * dividerThicknessM

    // Create hole boundaries based on ratios
    let currentBottom = holeBottom

    for (let i = 0; i < numHoles; i++) {
      // Calculate the current hole height based on its ratio
      const currentHoleHeight = (ratios[i] / sumRatios) * availableHeight
      const currentTop = currentBottom + currentHoleHeight

      boundaries.push({
        bottom: currentBottom,
        top: currentTop,
        left: -holeWidth / 2,
        right: holeWidth / 2
      })

      currentBottom = currentTop + dividerThicknessM
    }
  } else {
    // Multiple holes with dividers (equal size)
    const numDividers = numHoles - 1
    const availableHeight = totalHoleHeight - numDividers * dividerThicknessM
    const singleHoleHeight = availableHeight / numHoles

    let currentBottom = holeBottom
    for (let i = 0; i < numHoles; i++) {
      const currentTop =
        i === numHoles - 1 ? holeTop : currentBottom + singleHoleHeight

      boundaries.push({
        bottom: currentBottom,
        top: currentTop,
        left: -holeWidth / 2,
        right: holeWidth / 2
      })

      currentBottom = currentTop + dividerThicknessM
    }
  }

  return boundaries
}

/**
 * Create a panel shape with hole
 * @param {Object} params - Parameters for creating panel shape
 * @returns {THREE.Shape} THREE.js shape with hole
 */
export function createPanelShape({
  THREE,
  width,
  height,
  holeInset,
  doorGapAtBottom = 0
}) {
  const panelShape = new THREE.Shape()

  // Create outer shape with proper gap adjustment
  // Note: We adjust the bottom edge up by doorGapAtBottom
  panelShape.moveTo(-width / 2, -height / 2 + doorGapAtBottom)
  panelShape.lineTo(width / 2, -height / 2 + doorGapAtBottom)
  panelShape.lineTo(width / 2, height / 2)
  panelShape.lineTo(-width / 2, height / 2)
  panelShape.lineTo(-width / 2, -height / 2 + doorGapAtBottom)

  // Create hole with proper gap adjustment
  const holeShape = new THREE.Path()
  holeShape.moveTo(
    -width / 2 + holeInset,
    -height / 2 + holeInset + doorGapAtBottom
  )
  holeShape.lineTo(
    width / 2 - holeInset,
    -height / 2 + holeInset + doorGapAtBottom
  )
  holeShape.lineTo(width / 2 - holeInset, height / 2 - holeInset)
  holeShape.lineTo(-width / 2 + holeInset, height / 2 - holeInset)
  holeShape.lineTo(
    -width / 2 + holeInset,
    -height / 2 + holeInset + doorGapAtBottom
  )

  // Add hole to panel shape
  panelShape.holes.push(holeShape)

  return panelShape
}
