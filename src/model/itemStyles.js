// Door images:
import solid_2pane from '@/assets/doors/solid-double.webp'
import topGlass_2pane from '@/assets/doors/top-glass-2pane.svg'
import twinGlass_2pane from '@/assets/doors/twin-glass-2pane.svg'
import solid_1pane from '@/assets/doors/solid-single.webp'
import glass_1pane from '@/assets/doors/glass-1pane.svg'

// Window images:
import single_pane from '@/assets/windows/single.svg'
import double_pane from '@/assets/windows/double.svg'
import triple_pane from '@/assets/windows/triple.svg'

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

export const baseUnitStyles = {
  300: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  350: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  400: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  450: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  500: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  550: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  600: [
    { id: 'door', title: 'Single door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  650: [
    { id: 'door:door', title: 'Double door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  700: [
    { id: 'door:door', title: 'Double door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  750: [
    { id: 'door:door', title: 'Double door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  800: [
    { id: 'door:door', title: 'Double door', image: base_600_door, price: 80 },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  850: [
    {
      id: 'door:door',
      title: 'Double door',
      image: base_1000_2door,
      price: 80
    },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  900: [
    {
      id: 'door:door',
      title: 'Double door',
      image: base_1000_2door,
      price: 80
    },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  950: [
    {
      id: 'door:door',
      title: 'Double door',
      image: base_1000_2door,
      price: 80
    },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ],
  1000: [
    {
      id: 'door:door',
      title: 'Double door',
      image: base_1000_2door,
      price: 80
    },
    {
      id: '2-drawer',
      title: 'Two drawers',
      image: base_600_2drawer,
      price: 80
    },
    {
      id: '3-drawer',
      title: 'Three drawers',
      image: base_600_3drawer,
      price: 80
    },
    {
      id: '4-drawer',
      title: 'Four drawers',
      image: base_600_4drawer,
      price: 80
    }
  ]
}
