// FrontPanels.jsx
import React, { useMemo } from 'react'
import DoorPanel from './DoorPanel'
import DrawerPanel from './DrawerPanel'
import { calculateDoorBoundaries } from '@/utils/doorCalculations'

export default function FrontPanels({
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  panelThickness,
  panelConfig
}) {
  // Convert dimensions from mm to meters
  const frameHeight = carcassHeight + 26.2
  const pt = panelThickness / 1000
  const height = frameHeight / 1000
  const hOffset = carcassHeight / 1000 - frameHeight / 1000
  const dividerThickness = 18 // Default divider thickness in mm
  const dividerThicknessM = dividerThickness / 1000

  const holeHeight = carcassHeight / 1000 - 9 / 1000
  const holeWidth = carcassInnerWidth / 1000
  const holeYOffset = pt

  // Extract ratios from panelConfig if available
  const ratios = panelConfig.map((panel) => panel.ratio || 1)

  // Calculate boundaries for all panels using the utility function
  const boundaries = useMemo(
    () =>
      calculateDoorBoundaries({
        numHoles: panelConfig.length,
        holeHeight,
        holeWidth,
        holeYOffset,
        dividerThicknessM,
        pt,
        ratios: ratios.length === panelConfig.length ? ratios : null
      }),
    [
      panelConfig,
      holeHeight,
      holeWidth,
      holeYOffset,
      dividerThicknessM,
      pt,
      ratios
    ]
  )

  return (
    <group position={[0, height / 2 + hOffset, 0]}>
      {boundaries.map((boundary, index) => {
        const config = panelConfig[index]

        // Common props for all panel types
        const commonProps = {
          key: `panel-${index}`,
          boundary,
          carcassDepth,
          carcassHeight,
          panelThickness
        }

        // Render the appropriate panel type based on configuration
        switch (config.type) {
          case 'drawer':
            return (
              <DrawerPanel
                {...commonProps}
                drawerHandleType={config.handleType || 'bar'}
              />
            )
          case 'door':
            return (
              <DoorPanel
                {...commonProps}
                doorStyle={config.style || 'single'}
                doorConfig={{
                  orientation: config.orientation || 'horizontal',
                  ratio: config.doorRatio || [1, 1]
                }}
              />
            )
          // Here you can add more panel types in the future
          default:
            console.warn(`Unknown panel type: ${config.type}`)
            return null
        }
      })}
    </group>
  )
}
