// Door images:
import solid_2pane from '@/assets/doors/solid-double.webp'
import topGlass_2pane from '@/assets/doors/top-glass-2pane.svg'
import twinGlass_2pane from '@/assets/doors/twin-glass-2pane.svg'
import solid_1pane from '@/assets/doors/solid-single.webp'
import glass_1pane from '@/assets/doors/glass-1pane.svg'

import singleWindow from '@/assets/windows/single-sash.webp'
import doubleWindow from '@/assets/windows/double-sash.webp'

// Base unit images:
import base_600_door from '@/assets/units/base/600/with-door.jpg'
import base_600_2drawer from '@/assets/units/base/600/2-drawer.jpg'
import base_600_3drawer from '@/assets/units/base/600/3-drawer.jpg'
import base_600_4drawer from '@/assets/units/base/600/4-drawer.jpg'
import base_1000_2door from '@/assets/units/base/1000/2-door.jpg'

/**
 * Options for door styles.
 */
export const doorStyles = [
  { id: 'solid-1pane', title: 'Solid, 1 panel', image: solid_1pane },
  { id: 'solid-2pane', title: 'Solid, 2 panel', image: solid_2pane },
  { id: 'top-2pane', title: 'Glass top, 2 panel', image: topGlass_2pane },
  { id: 'twin-2pane', title: 'Glass, 2 panel', image: twinGlass_2pane },
  { id: 'glass-1pane', title: 'Glass, 1 panel', image: glass_1pane }
]

/**
 * Options for window styles.
 */
export const windowStyles = [
  { id: 'single', title: 'Single', image: singleWindow, width: 0.5 },
  { id: 'double', title: 'Double', image: doubleWindow, width: 0.8 }
  // { id: 'triple', title: 'Triple', image: triple_pane, width: 1.4 }
]

/**
 * Options for base units.
 */
const panels = {
  '1-door': [{ type: 'door', style: 'single' }],
  '2-door': [{ type: 'door', style: 'split' }],
  '2-drawer': [
    { type: 'drawer', ratio: 2 },
    { type: 'drawer', ratio: 2 }
  ],
  '3-drawer': [
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 2 }
  ],
  '4-drawer': [
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 }
  ],
  'oven-single': [
    { type: 'drawer', ratio: 1.2 },
    { type: 'oven', ovenType: 'single oven', ratio: 6 }
  ],
  'oven-double': [{ type: 'oven', ovenType: 'double oven' }],
  'oven-compact': [
    { type: 'oven', ovenType: 'single oven', ratio: 4.5 },
    { type: 'drawer', ratio: 2.7 }
  ]
}

const basins = {
  'standard-single': [
    { type: 'standard', height: 220, depth: 455, doubleBasin: false }
  ],
  'standard-twin': [
    { type: 'standard', height: 220, depth: 455, doubleBasin: true }
  ],
  'belfast-single': [
    { type: 'belfast', height: 220, depth: 455, doubleBasin: false }
  ],
  'belfast-twin': [
    { type: 'belfast', height: 220, depth: 455, doubleBasin: true }
  ]
}

const baseUnitConfig = {
  baseUnit: true,
  tall: false,
  depth: 575,
  height: 759
}

export const baseUnitStyles = {
  'With door': [
    {
      id: 'base:1-door',
      props: { ...baseUnitConfig, panelConfig: panels['1-door'] },
      title: 'Base unit with single door',
      images: [base_600_door],
      sizes: [300, 350, 400, 450, 500, 550, 600],
      prices: [80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:2-door',
      props: { baseUnit: true, tall: false, depth: 575, height: 759 },
      title: 'Base unit with two doors',
      images: [base_1000_2door],
      sizes: [650, 700, 750, 800, 850, 900, 950, 1000],
      prices: [80, 80, 80, 80, 80, 80, 80, 80]
    }
  ],
  'With drawers': [
    {
      id: 'base:2-drawer',
      props: { ...baseUnitConfig, panelConfig: panels['2-drawer'] },
      title: 'Base unit with two deep drawers',
      images: [base_600_2drawer],
      sizes: [
        300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
        1000
      ],
      prices: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:3-drawer',
      props: { ...baseUnitConfig, panelConfig: panels['3-drawer'] },
      title: 'Base unit with two shallow and one deep drawers',
      images: [base_600_3drawer],
      sizes: [
        300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
        1000
      ],
      prices: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:4-drawer',
      props: { ...baseUnitConfig, panelConfig: panels['4-drawer'] },
      title: 'Base unit with four drawers',
      images: [base_600_4drawer],
      sizes: [
        300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
        1000
      ],
      prices: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
    }
  ],
  'With sink': [
    {
      id: 'base:sink-single',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['1-door'],
        basinConfig: basins['standard-single']
      },
      title: 'Base unit with single basin',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    },
    {
      id: 'base:sink-double',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['1-door'],
        basinConfig: basins['standard-twin']
      },
      title: 'Base unit with double basin',
      images: [base_600_door],
      sizes: [800],
      prices: [80]
    },
    {
      id: 'base:belfast-single',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['1-door'],
        basinConfig: basins['belfast-single']
      },
      title: 'Base unit with single Belfast basin',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    },
    {
      id: 'base:belfast-double',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['1-door'],
        basinConfig: basins['belfast-twin']
      },
      title: 'Base unit with double Belfast basin',
      images: [base_600_door],
      sizes: [800],
      prices: [80]
    }
  ],
  'For oven': [
    {
      id: 'base:oven-double',
      props: { ...baseUnitConfig, panelConfig: panels['oven-double'] },
      title: 'Double oven',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    },
    {
      id: 'base:oven-single',
      props: { ...baseUnitConfig, panelConfig: panels['oven-single'] },
      title: 'Single oven',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    },
    {
      id: 'base:oven-compact',
      props: { ...baseUnitConfig, panelConfig: panels['oven-compact'] },
      title: 'Compact oven',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    }
  ],
  'For dishwasher': [
    {
      id: 'base:dishwasher',
      props: { ...baseUnitConfig, depth: 282, panelConfig: panels['1-door'] },
      title: 'Shallow unit for island',
      images: [base_600_door],
      sizes: [600],
      prices: [80]
    }
  ],
  'For bin': [
    {
      id: 'base:bin',
      props: { ...baseUnitConfig, panelConfig: panels['1-door'] },
      title: 'Base unit for waste bin',
      images: [base_600_door],
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    }
  ],
  'For corner': [
    {
      id: 'base:corner-left',
      props: { openingOrientation: 'left', panelConfig: panels['1-door'] },
      title: 'Corner unit (opening left)',
      images: [base_600_door],
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    },
    {
      id: 'base:corner-right',
      props: { openingOrientation: 'right', panelConfig: panels['1-door'] },
      title: 'Corner unit (opening right)',
      images: [base_600_door],
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    }
  ],
  'Counter only': [
    {
      id: 'base:counter-only',
      props: { openingOrientation: 'left', panelConfig: panels['1-door'] },
      title: 'Counter only',
      images: [base_600_door],
      sizes: [
        300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
        1000
      ],
      prices: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
    }
  ],
  Shallow: [
    {
      id: 'base:shallow',
      props: { ...baseUnitConfig, depth: 282, panelConfig: panels['1-door'] },
      title: 'Shallow unit for island',
      images: [base_600_door],
      sizes: [300, 350, 400, 450, 500, 550, 600],
      prices: [80, 80, 80, 80, 80, 80, 80]
    }
  ]
}
