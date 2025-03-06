import React, { useMemo } from 'react'
import { Edges } from '@react-three/drei'

export default function DrawerPanel({
  carcassDepth,
  carcassHeight,
  panelThickness,
  carcassInnerWidth,
  numHoles = 4,
  dividerThickness = 18,
  drawerThickness = 18, // Thickness of the drawer front in mm
  drawerGap = 2, // Gap between drawer and moulding frame in mm
  mouldingSize = 4, // Moulding size in mm
  frameInset = 4 // Frame inset in mm
}) {
  // Convert dimensions from mm to meters
  const frameHeight = carcassHeight + 26.2
  const pt = panelThickness / 1000
  const height = frameHeight / 1000
  const depth = carcassDepth / 1000
  const hOffset = carcassHeight / 1000 - frameHeight / 1000
  const drawerThicknessM = drawerThickness / 1000
  const drawerGapM = drawerGap / 1000
  const mouldingSizeM = mouldingSize / 1000
  const frameInsetM = frameInset / 1000
  const dividerThicknessM = dividerThickness / 1000

  const holeHeight = carcassHeight / 1000 - 9 / 1000
  const holeWidth = carcassInnerWidth / 1000
  const holeYOffset = pt

  // Calculate hole boundaries based on numHoles
  const drawerBoundaries = useMemo(() => {
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
  }, [holeHeight, holeWidth, holeYOffset, numHoles, dividerThicknessM, pt])

  // Create a drawer for each hole
  const DrawerPanels = () => {
    return drawerBoundaries.map((hole, index) => {
      // Calculate drawer dimensions with appropriate gaps
      // Account for frame inset, moulding size and drawer gap
      const totalInset = frameInsetM + mouldingSizeM + drawerGapM

      const drawerWidth = hole.right - hole.left - 2 * totalInset
      const drawerHeight = hole.top - hole.bottom - 2 * totalInset

      // Center position of the drawer
      const drawerX = (hole.left + hole.right) / 2
      const drawerY = (hole.bottom + hole.top) / 2

      return (
        <mesh
          key={`drawer-${index}`}
          position={[
            drawerX,
            drawerY,
            depth / 2 + drawerThicknessM / 2 - 0.001
          ]}
        >
          <boxGeometry args={[drawerWidth, drawerHeight, drawerThicknessM]} />
          <meshStandardMaterial color='white' />
          <Edges threshold={5} color='gray' />
        </mesh>
      )
    })
  }

  return (
    <group position={[0, height / 2 + hOffset, 0]}>
      <DrawerPanels />
    </group>
  )
}
