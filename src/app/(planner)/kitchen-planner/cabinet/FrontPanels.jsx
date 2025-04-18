// FrontPanels.jsx
import React, { useMemo } from 'react'
import DoorPanel from './DoorPanel'
import DrawerPanel from './DrawerPanel'
import Oven from './Oven'
import { calculateDoorBoundaries } from '@/utils/doorCalculations'

export default function FrontPanels({
  color,
  lineColor,
  carcassDepth,
  carcassHeight,
  carcassInnerWidth,
  panelThickness,
  panelConfig
}) {
  // Calculated values
  const frameHeight = carcassHeight + 0.0262
  const dividerThickness = 0.018 // Default divider thickness in meters
  const hOffset = carcassHeight - frameHeight

  const holeHeight = carcassHeight - 0.009
  const holeWidth = carcassInnerWidth
  const holeYOffset = panelThickness

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
        dividerThickness,
        panelThickness,
        ratios: ratios.length === panelConfig.length ? ratios : null
      }),
    [
      panelConfig,
      holeHeight,
      holeWidth,
      holeYOffset,
      dividerThickness,
      panelThickness,
      ratios
    ]
  )

  return (
    <group position={[0, frameHeight / 2 + hOffset, 0]}>
      {boundaries.map((boundary, index) => {
        const config = panelConfig[index]

        // Common props for all panel types
        const commonProps = {
          color,
          lineColor,
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
                key={`panel-${index}`}
                {...commonProps}
                drawerHandleType={config.handleType || 'bar'}
              />
            )
          case 'oven':
            return (
              <Oven
                key={`panel-${index}`}
                {...commonProps}
                type={config.ovenType || 'single'}
                ovenHandleType={config.handleType || 'bar'}
                compartmentRatio={config.compartmentRatio || [2, 3]}
              />
            )
          case 'door':
            return (
              <DoorPanel
                key={`panel-${index}`}
                {...commonProps}
                doorStyle={config.style || 'single'}
                doorConfig={{
                  orientation: config.orientation || 'horizontal',
                  ratio: config.doorRatio || [1, 1],
                  verticalRatio: config.verticalRatio || [1, 1],
                  horizontalRatio: config.horizontalRatio || [1, 1]
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
