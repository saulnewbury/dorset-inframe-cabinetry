import ChooseFloorPlan from '@/app/(planner)/kitchen-planner/dialog/ChooseFloorPlan'
import ChooseDoor from '@/app/(planner)/kitchen-planner/dialog/ChooseDoor'
import ChooseWindow from '@/app/(planner)/kitchen-planner/dialog/ChooseWindow'
import ChooseArch from '@/app/(planner)/kitchen-planner/dialog/ChooseArch'
import ChooseBaseUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseBaseUnit'
import ChooseTallUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseTallUnit'
import ChooseWallUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseWallUnit'
import ChooseAddWall from '@/app/(planner)/kitchen-planner/dialog/ChooseAddWall'
import ChooseStyles from '@/app/(planner)/kitchen-planner/dialog/ChooseStyles'
import ChooseColours from '@/app/(planner)/kitchen-planner/dialog/ChooseColours'

import WeCanSupply from '@/app/(general)/WeCanSupply'
import { weSupplyAppliances } from '@/lib/data/weSupply'
import { weSupplySinksAndTaps } from '@/lib/data/weSupply'
import { weSupplyHandlesAndKnobs } from '@/lib/data/weSupply'
import { weSupplyStorageAndAccessories } from '@/lib/data/weSupply'

export const defineYourSpaceMenu = [
  {
    name: 'shape',
    options: [
      {
        fullWidth: true,
        name: 'Choose floor plan',
        heading: 'Select a general floor plan',
        component: ChooseFloorPlan
      }
    ]
  },
  {
    name: 'features',
    options: [
      {
        name: 'Add wall',
        heading: 'Add internal wall',
        component: ChooseAddWall
      }
    ]
  },
  {
    name: 'openings',
    options: [
      {
        name: 'Add windows',
        heading: 'Add resizable windows',
        component: ChooseWindow
      },
      {
        name: 'Add doors',
        heading: 'Add resizable doors',
        component: ChooseDoor
      },
      {
        name: 'Add wall openings',
        heading: 'Wall openings',
        component: ChooseArch
      }
    ]
  }
]

export const makeItYours = [
  {
    name: 'cabinets',
    options: [
      {
        fullWidth: true,
        name: 'Base units',
        heading: 'Base unit',
        component: ChooseBaseUnit,
        variants: [
          'For corner',
          'With door',
          'With drawers',
          'With sink',
          'For oven',
          'For dishwasher',
          'For bin',
          'Shallow',
          'Counter only'
        ]
      },
      {
        fullWidth: true,
        name: 'Tall units',
        heading: 'Tall cupboard',
        component: ChooseTallUnit,
        variants: ['Storage', 'Pantry', 'For oven', 'Fridge freezer']
      },
      {
        fullWidth: true,
        name: 'Wall unit',
        heading: 'Wall cupboards',
        component: ChooseWallUnit,
        variants: ['All wall units']
      }
    ]
  },
  {
    name: 'styles',
    options: [
      {
        fullWidth: true,
        name: 'Style your kitchen',
        heading: 'Style your kitchen',
        component: ChooseStyles
      }
    ]
  },
  {
    name: 'we supply',
    options: [
      {
        fullWidth: true,
        name: 'Appliances',
        heading: 'We supply appliances',
        component: () => <WeCanSupply {...weSupplyAppliances} isModal={true} />
      },
      {
        fullWidth: true,
        name: 'Sinks and taps',
        heading: 'We supply sinks and taps',
        component: () => (
          <WeCanSupply {...weSupplySinksAndTaps} isModal={true} />
        )
      },
      {
        fullWidth: true,
        name: 'Handles and knobs',
        heading: 'We supply handles and knobs',
        component: () => (
          <WeCanSupply {...weSupplyHandlesAndKnobs} isModal={true} />
        )
      },
      {
        fullWidth: true,
        name: 'Storage and accessories',
        heading: 'We supply storage and accessories',
        component: () => (
          <WeCanSupply {...weSupplyStorageAndAccessories} isModal={true} />
        )
      }
    ]
  },
  {
    name: 'your items',
    options: [
      {
        name: 'Your items',
        heading: 'Your selected items',
        component: ChooseWallUnit
      }
    ]
  }
]
