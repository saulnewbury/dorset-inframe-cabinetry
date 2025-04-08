import ChooseFloorPlan from '@/app/(planner)/kitchen-planner/dialog/ChooseFloorPlan'
import ChooseDoor from '@/app/(planner)/kitchen-planner/dialog/ChooseDoor'
import ChooseWindow from '@/app/(planner)/kitchen-planner/dialog/ChooseWindow'
import ChooseArch from '@/app/(planner)/kitchen-planner/dialog/ChooseArch'
import ChooseBaseUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseBaseUnit'
import ChooseTallUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseTallUnit'
import ChooseWallUnit from '@/app/(planner)/kitchen-planner/dialog/ChooseWallUnit'
import ChooseAddWall from '@/app/(planner)/kitchen-planner/dialog/ChooseAddWall'
import ChooseColours from '@/app/(planner)/kitchen-planner/dialog/ChooseColours'

import WeCanSupply from '@/app/(general)/WeCanSupply'
import { weSupplyAppliances } from '@/lib/data/weSupply'

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
        heading: 'Windows',
        component: ChooseWindow
      },
      {
        name: 'Add doors',
        heading: 'Doors',
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
    name: 'appliances',
    options: [
      {
        name: 'Appliances',
        heading: 'Appliances',
        component: WeCanSupply,
        data: weSupplyAppliances
      }
    ]
  },
  {
    name: 'worktop',
    options: [
      {
        name: 'Style worktop',
        heading: 'Style worktop',
        component: ChooseWallUnit
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
