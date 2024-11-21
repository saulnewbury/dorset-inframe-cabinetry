import placeholderA from '@/lib/images/placeholder-a.jpg'
import placeholderB from '@/lib/images/placeholder-b.jpg'

import ChooseFloorPlan from '@/app/(planner)/kitchen-planner/ChooseFloorPlan'
import ChooseDoor from '@/app/(planner)/kitchen-planner/ChooseDoor'
import ChooseWindow from '@/app/(planner)/kitchen-planner/ChooseWindow'
import ChooseArch from '@/app/(planner)/kitchen-planner/ChooseArch'
import ChooseBaseUnit from '@/app/(planner)/kitchen-planner/ChooseBaseUnit'
import ChooseWallUnit from '@/app/(planner)/kitchen-planner/ChooseWallUnit'
import ChooseAddWall from '@/app/(planner)/kitchen-planner/ChooseAddWall'
import ChooseColours from '@/app/(planner)/kitchen-planner/ChooseColours'

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
      }
      // {
      //   name: 'Add separation area',
      //   heading: 'Add an area separation'
      // },
      // {
      //   name: 'Add sloped ceiling',
      //   heading: 'Add a sloped ceiling'
      // }
    ]
  },
  {
    name: 'openings',
    options: [
      {
        name: 'Add windows',
        heading: 'Windows',
        component: ChooseWindow
        // items: [
        //   {
        //     name: 'item1',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item2',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item3',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item4',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item5',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item6',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item7',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item8',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   }
        // ]
      },
      {
        name: 'Add doors',
        heading: 'Doors',
        component: ChooseDoor
        // items: [
        //   {
        //     name: 'item1',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item2',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item3',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item4',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item5',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item6',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item7',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   },
        //   {
        //     name: 'item8',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA },
        //       { id: crypto.randomUUID(), src: placeholderB }
        //     ]
        //   }
        // ]
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
        name: 'Base units',
        heading: 'Choose a base unit',
        component: ChooseBaseUnit
        // items: [
        //   {
        //     name: 'item1',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item2',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item3',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item4',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item5',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item6',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item7',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   },
        //   {
        //     name: 'item8',
        //     desc: 'A brief description',
        //     images: [
        //       { id: crypto.randomUUID(), src: placeholderA, alt: '' },
        //       { id: crypto.randomUUID(), src: placeholderB, alt: '' }
        //     ]
        //   }
        // ]
      },
      {
        name: 'Electricity',
        heading: 'Electricity',
        items: [
          {
            name: 'item1',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
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
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
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
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
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
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item2',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item3',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item4',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item5',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item6',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item7',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          },
          {
            name: 'item8',
            desc: 'A brief description',
            images: [
              { id: crypto.randomUUID(), src: placeholderA, alt: '' },
              { id: crypto.randomUUID(), src: placeholderB, alt: '' }
            ]
          }
        ]
      }
    ]
  }
  // {
  //   name: 'Something else',
  //   options: [
  //     {
  //       name: 'Base units',
  //       heading: 'Choose a base unit',
  //       items: [
  //         {
  //           name: 'item1',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item2',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item3',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item4',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item5',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item6',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item7',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item8',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Electricity',
  //       heading: 'Electricity',
  //       items: [
  //         {
  //           name: 'item1',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item2',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item3',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item4',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item5',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item6',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item7',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item8',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Heating',
  //       heading: 'Heating',
  //       items: [
  //         {
  //           name: 'item1',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item2',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item3',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item4',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item5',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item6',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item7',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item8',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Ventilation',
  //       heading: 'Ventilation',
  //       items: [
  //         {
  //           name: 'item1',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item2',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item3',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item4',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item5',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item6',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item7',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item8',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Fittings',
  //       heading: 'Fittings',
  //       items: [
  //         {
  //           name: 'item1',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item2',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item3',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item4',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item5',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item6',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item7',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         },
  //         {
  //           name: 'item8',
  //           desc: 'A brief description',
  //           images: [
  //             { id: crypto.randomUUID(), src: placeholderA },
  //             { id: crypto.randomUUID(), src: placeholderB }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
]
