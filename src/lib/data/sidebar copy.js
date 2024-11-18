import placeholderA from '@/lib/images/placeholder-a.jpg'
import placeholderB from '@/lib/images/placeholder-b.jpg'

import ChooseFloorPlan from './ChooseFloorPlan'
import ChooseDoor from './ChooseDoor'
import ChooseWindow from './ChooseWindow'
import ChooseArch from './ChooseArch'
import ChooseBaseUnit from './ChooseBaseUnit'
import ChooseWallUnit from './ChooseWallUnit'
import ChooseAddWall from './ChooseAddWall'
import ChooseColours from './ChooseColours'
import { compact } from '@headlessui/react/dist/utils/render'

export const defineYourSpace = [
  {
    name: 'shape',
    options: [
      {
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
      },
      {
        name: 'Add separation area',
        heading: 'Add an area separation'
      },
      {
        name: 'Add sloped ceiling',
        heading: 'Add a sloped ceiling'
      }
    ]
  },
  {
    name: 'openings',
    options: [
      {
        name: 'Add windows',
        heading: 'Windows',
        component: ChooseWindow,
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Add doors',
        heading: 'Doors',
        component: ChooseDoor,
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Add wall openings',
        heading: 'Wall openings',
        component: ChooseArch,
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'elements',
    options: [
      {
        name: 'Structures',
        heading: 'Structures',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Electricity',
        heading: 'Electricity',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Heating',
        heading: 'Heating',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Ventilation',
        heading: 'Ventilation',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      },
      {
        name: 'Fittings',
        heading: 'Fittings',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA },
              { id: crypto.randomUUID(), src: placeholderB }
            ]
          }
        ]
      }
    ]
  }
]
