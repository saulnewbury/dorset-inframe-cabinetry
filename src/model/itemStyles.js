// Door images:
import singleDoor from '@/lib/images/openings/single-door.webp'
import doubleDoor from '@/lib/images/openings/double-door.webp'

import singleWindow from '@/lib/images/openings/single-window.webp'
import doubleWindow from '@/lib/images/openings/double-window.webp'

/**
 * Options for door styles.
 */
export const doorStyles = [
  { id: 'single-door', title: 'Solid Door', image: singleDoor },
  { id: 'double-door', title: 'Double Door', image: doubleDoor }
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
    { type: 'drawer', ratio: 2 },
    { type: 'drawer', ratio: 2 },
    { type: 'drawer', ratio: 1 }
  ],
  '4-drawer': [
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 },
    { type: 'drawer', ratio: 1 }
  ],
  'oven-single': [
    { type: 'drawer', ratio: 1.2 },
    { type: 'oven', ovenType: 'single', ratio: 6 }
  ],
  'oven-double': [{ type: 'oven', ovenType: 'double' }],
  'oven-compact': [
    { type: 'drawer', ratio: 2.7 },
    { type: 'oven', ovenType: 'compact', ratio: 4.5 }
  ],
  'tall-doors': [
    { type: 'door', ratio: 153 },
    {
      type: 'door',
      style: 'split',
      orientation: 'vertical',
      doorRatio: [60, 40],
      ratio: 1776
    }
  ],
  'tall-drawers': [
    { type: 'drawer', ratio: 250 },
    { type: 'drawer', ratio: 250 },
    { type: 'drawer', ratio: 150 },
    { type: 'door', ratio: 980 },
    { type: 'door', ratio: 150 }
  ],
  '4-doors': [
    {
      type: 'door',
      style: 'fourDoors',
      orientation: 'vertical',
      verticalRatio: [60, 40]
    }
  ],
  'tall-oven': [
    { type: 'door', ratio: 725 },
    { type: 'oven', ovenType: 'single', ratio: 600 },
    { type: 'door', ratio: 560 }
  ],
  'tall-oven-double': [
    { type: 'door', ratio: 425 },
    { type: 'oven', ovenType: 'double', ratio: 1065 },
    { type: 'door', ratio: 570 }
  ],
  'tall-oven-compact': [
    { type: 'door', ratio: 1090 },
    { type: 'oven', ovenType: 'compact', ratio: 450 },
    { type: 'door', ratio: 570 }
  ],
  '50-50': [
    {
      type: 'door',
      style: 'split',
      orientation: 'vertical',
      doorRatio: [50, 50],
      ratio: 1780
    },
    { type: 'door', ratio: 150 }
  ],
  '60-40': [
    {
      type: 'door',
      style: 'split',
      orientation: 'vertical',
      doorRatio: [60, 40],
      ratio: 1780
    },
    { type: 'door', ratio: 150 }
  ],
  '70-30': [
    {
      type: 'door',
      style: 'split',
      orientation: 'vertical',
      doorRatio: [70, 30],
      ratio: 1780
    },
    { type: 'door', ratio: 150 }
  ]
}

const basins = {
  'standard-single': {
    type: 'standard',
    height: 0.22,
    depth: 0.455,
    doubleBasin: false
  },
  'standard-twin': {
    type: 'standard',
    height: 0.22,
    depth: 0.455,
    doubleBasin: true
  },
  'belfast-single': {
    type: 'belfast',
    height: 0.22,
    depth: 0.455,
    doubleBasin: false
  },
  'belfast-twin': {
    type: 'belfast',
    height: 0.22,
    depth: 0.455,
    doubleBasin: true
  }
}

const baseUnitConfig = {
  baseUnit: true,
  tall: false,
  carcassDepth: 0.575,
  carcassHeight: 0.759
}

export const baseUnitStyles = {
  'With door': [
    {
      id: 'base:1-door',
      props: { ...baseUnitConfig, panelConfig: panels['1-door'] },
      title: 'Base unit with single door',
      filterText: 'One door',
      sizes: [250, 300, 350, 400, 450, 500, 550, 600],
      prices: [80, 80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:2-door',
      props: { ...baseUnitConfig, panelConfig: panels['2-door'] },
      title: 'Base unit with two doors',
      filterText: 'Two doors',
      sizes: [650, 700, 750, 800, 850, 900, 950, 1000],
      prices: [80, 80, 80, 80, 80, 80, 80, 80]
    }
  ],
  'With drawers': [
    {
      id: 'base:2-drawer',
      props: { ...baseUnitConfig, panelConfig: panels['2-drawer'] },
      title: 'Base unit with two deep drawers',
      filterText: 'Two drawers',
      imageBase: 'base-2drawer',
      sizes: [
        300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
        1000
      ],
      prices: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:3-drawer',
      props: { ...baseUnitConfig, panelConfig: panels['3-drawer'] },
      title: 'Base unit with one shallow and two deep drawers',
      filterText: 'Three drawers',
      imageBase: 'base-3drawer',
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
      filterText: 'Four drawers',
      imageBase: 'base-4drawer',
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
      title: 'Base unit with standard single sink',
      filterText: 'Standard',
      sizes: [500],
      prices: [80]
    },
    {
      id: 'base:sink-double',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['2-door'],
        basinConfig: basins['standard-twin']
      },
      title: 'Base unit with double sink',
      filterText: 'Standard',
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
      title: 'Base unit with Belfast single sink',
      filterText: 'Belfast',
      carcassHeight: 0.593,
      sizes: [600],
      prices: [80]
    },
    {
      id: 'base:belfast-double',
      props: {
        ...baseUnitConfig,
        panelConfig: panels['2-door'],
        basinConfig: basins['belfast-twin']
      },
      title: 'Base unit with Belfast double sink',
      filterText: 'Belfast',
      carcassHeight: 0.593,
      sizes: [800],
      prices: [80]
    }
  ],
  'For oven': [
    {
      id: 'base:oven-single',
      props: { ...baseUnitConfig, panelConfig: panels['oven-single'] },
      title: 'Single oven',
      sizes: [636],
      prices: [80]
    },
    {
      id: 'base:oven-double',
      props: { ...baseUnitConfig, panelConfig: panels['oven-double'] },
      title: 'Double oven',
      sizes: [636],
      prices: [80]
    },
    {
      id: 'base:oven-compact',
      props: { ...baseUnitConfig, panelConfig: panels['oven-compact'] },
      title: 'Compact oven with drawer',
      sizes: [636],
      prices: [80]
    }
  ],
  'For dishwasher': [
    {
      id: 'base:appliance',
      props: { ...baseUnitConfig, depth: 282, panelConfig: panels['1-door'] },
      title: 'Unit for built-in appliance (e.g. dishwasher)',
      sizes: [636],
      prices: [80]
    }
  ],
  'For bin': [
    {
      id: 'base:bin',
      props: { ...baseUnitConfig, panelConfig: panels['1-door'] },
      title: 'Base unit for waste bin',
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    }
  ],
  'For corner': [
    {
      id: 'base:corner-left',
      props: {
        ...baseUnitConfig,
        openingOrientation: 'left',
        panelConfig: panels['1-door']
      },
      title: 'Corner unit (door left)',
      filterText: 'Open left',
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    },
    {
      id: 'base:corner-right',
      props: {
        ...baseUnitConfig,
        openingOrientation: 'right',
        panelConfig: panels['1-door']
      },
      filterText: 'Open right',
      title: 'Corner unit (door right)',
      sizes: [400, 450, 500, 600],
      prices: [80, 80, 80, 80]
    }
  ],
  'Counter only': [
    {
      id: 'base:counter-only',
      props: { ...baseUnitConfig, panelConfig: [{ type: 'none' }] },
      title: 'Counter only',
      sizes: [800],
      prices: [80]
    }
  ],
  'For island': [
    {
      id: 'base:shallow',
      props: {
        ...baseUnitConfig,
        carcassDepth: 0.282,
        panelConfig: panels['1-door']
      },
      title: 'Shallow unit for island (one door)',
      filterText: 'One door',
      sizes: [250, 300, 350, 400, 450, 500, 550, 600],
      prices: [80, 80, 80, 80, 80, 80, 80, 80]
    },
    {
      id: 'base:shallow-2door',
      props: {
        ...baseUnitConfig,
        carcassDepth: 0.282,
        panelConfig: panels['2-door']
      },
      title: 'Shallow unit for island (two doors)',
      filterText: 'Two door',
      sizes: [650, 700, 750, 800, 850, 900, 950, 1000],
      prices: [80, 80, 80, 80, 80, 80, 80, 80]
    }
  ]
}

const tallUnitConfig = {
  baseUnit: true,
  tall: true,
  carcassDepth: 0.575,
  carcassHeight: 2.001
}

export const tallUnitStyles = {
  Storage: [
    {
      id: 'tall:storage-doors',
      props: { ...tallUnitConfig, panelConfig: panels['tall-doors'] },
      title: 'Tall storage unit with doors',
      filterText: 'With doors',
      sizes: [300, 400, 500, 600],
      prices: [80, 80, 80, 80]
    },
    {
      id: 'tall:storage-drawers',
      props: { ...tallUnitConfig, panelConfig: panels['tall-drawers'] },
      title: 'Tall storage unit with doors and drawers',
      filterText: 'With drawers',
      sizes: [500, 600],
      prices: [80, 80]
    }
  ],
  Pantry: [
    {
      id: 'tall:pantry',
      props: { ...tallUnitConfig, panelConfig: panels['4-doors'] },
      title: 'Tall pantry unit with 4 doors',
      sizes: [800, 900, 1000],
      prices: [80, 80, 80]
    }
  ],
  'For oven': [
    {
      id: 'tall:oven-single',
      props: { ...tallUnitConfig, panelConfig: panels['tall-oven'] },
      title: 'Tall unit for oven',
      sizes: [636],
      prices: [80]
    },
    {
      id: 'tall:oven-double',
      props: { ...tallUnitConfig, panelConfig: panels['tall-oven-double'] },
      title: 'Tall unit for double oven',
      sizes: [636],
      prices: [80]
    },
    {
      id: 'tall:oven-compact',
      props: { ...tallUnitConfig, panelConfig: panels['tall-oven-compact'] },
      title: 'Tall unit for compact oven',
      sizes: [636],
      prices: [80]
    }
  ],
  'Fridge freezer': [
    {
      id: 'tall:fridge-50-50',
      props: { ...tallUnitConfig, panelConfig: panels['50-50'] },
      title: 'Tall unit for fridge-freezer (50-50)',
      sizes: [600],
      prices: [80]
    },
    {
      id: 'tall:fridge-60-40',
      props: { ...tallUnitConfig, panelConfig: panels['60-40'] },
      title: 'Tall unit for fridge-freezer (60-40)',
      sizes: [600],
      prices: [80]
    },
    {
      id: 'tall:fridge-70-30',
      props: { ...tallUnitConfig, panelConfig: panels['70-30'] },
      title: 'Tall unit for fridge-freezer (70-30)',
      sizes: [600],
      prices: [80]
    }
  ]
}

const wallUnitConfig = {
  baseUnit: false,
  tall: false,
  carcassDepth: 0.282,
  carcassHeight: 0.759
}

export const wallUnitStyles = [
  {
    id: 'wall:1-door',
    props: { ...wallUnitConfig, panelConfig: panels['1-door'] },
    title: 'Wall unit with single door',
    filterText: 'One door',
    sizes: [300, 350, 400, 450, 500, 550],
    prices: [80, 80, 80, 80, 80, 80]
  },
  {
    id: 'wall:2-door',
    props: { ...wallUnitConfig, panelConfig: panels['2-door'] },
    title: 'Wall unit with two doors',
    filterText: 'Two doors',
    sizes: [600, 650, 700, 750, 800],
    prices: [80, 80, 80, 80, 80]
  }
]
