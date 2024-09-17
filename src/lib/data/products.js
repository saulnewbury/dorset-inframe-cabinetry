// handles and knobs

import knob1a from '@/lib/images/products/knob1a.webp'
import knob1b from '@/lib/images/products/knob1b.webp'
import handle1a from '@/lib/images/products/handle1a.webp'
import handle1b from '@/lib/images/products/handle1b.webp'
import knob2a from '@/lib/images/products/knob2a.webp'
import knob2b from '@/lib/images/products/knob2b.webp'
import handle2a from '@/lib/images/products/handle2a.webp'
import handle2b from '@/lib/images/products/handle2b.webp'

import wallCabinet1a from '@/lib/images/products/wall-cabinet1a.jpg'
import wallCabinet1b from '@/lib/images/products/wall-cabinet1b.jpg'
import baseCabinet1a from '@/lib/images/products/base-cabinet1a.jpg'
import baseCabinet1b from '@/lib/images/products/base-cabinet1b.jpg'
import wallCabinet1aGrey from '@/lib/images/products/wall-cabinet1a-grey.jpg'
import wallCabinet1bGrey from '@/lib/images/products/wall-cabinet1b-grey.jpg'
import baseCabinet1aGrey from '@/lib/images/products/base-cabinet1a-grey.jpg'
import baseCabinet1bGrey from '@/lib/images/products/base-cabinet1b-grey.jpg'

const products = [
  {
    name: 'Cabinets',
    categories: [
      { name: 'All' },
      {
        name: 'Base cabinets',
        subCategories: [
          'For sink',
          'For corner',
          'For hob',
          'For hob and oven',
          'For washing machine'
        ]
      },
      {
        name: 'Wall cabinets',
        subCategories: [
          'With door',
          'For corner',
          'For sink',
          'For hob',
          'For hob and oven',
          'For washing machine'
        ]
      }
    ],
    items: [
      {
        id: crypto.randomUUID(),
        name: 'Floor cabinet',
        desc: 'Floor cabinet with door',
        categories: ['All', 'Base cabinets', 'For sink'],
        price: '£24.00',
        sizes: [
          { w: 66.6, h: 80 },
          { w: 71.6, h: 80 }
        ],
        options: [
          {
            instruction: 'Choose frame finish',
            options: [
              { name: 'Beige', hex: '#F5F3F0' },
              { name: 'Grey', hex: '#D8DADB' },
              { name: 'Pale green', hex: '#ECEDE8' },
              { name: 'Blue', hex: '#3B5771' },
              { name: 'Dark stone', hex: '#393D40' }
            ]
          }
        ],
        images: [
          {
            id: crypto.randomUUID(),
            src: baseCabinet1a,
            alt: '',
            name: 'Beige',
            size: { w: 66.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: baseCabinet1b,
            alt: '',
            name: 'Beige',
            size: { w: 66.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: baseCabinet1aGrey,
            alt: '',
            name: 'Grey',
            size: { w: 71.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: baseCabinet1bGrey,
            alt: '',
            name: 'Grey',
            size: { w: 71.6, h: 80 }
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Wall cabinet',
        desc: 'Wall cabinet with door',
        categories: ['All', 'Wall cabinets', 'With door'],
        price: '£24.00',
        sizes: [
          { w: 66.6, h: 80 },
          { w: 71.6, h: 80 }
        ],
        options: [
          {
            instruction: 'Choose frame finish',
            options: [
              { name: 'Beige', hex: '#F5F3F0' },
              { name: 'Grey', hex: '#D8DADB' },
              { name: 'Pale green', hex: '#ECEDE8' },
              { name: 'Blue', hex: '#3B5771' },
              { name: 'Dark stone', hex: '#393D40' }
            ]
          }
        ],
        images: [
          {
            id: crypto.randomUUID(),
            src: wallCabinet1a,
            alt: '',
            name: 'Beige',
            size: { w: 66.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: wallCabinet1b,
            alt: '',
            name: 'Beige',
            size: { w: 66.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: wallCabinet1aGrey,
            alt: '',
            name: 'Grey',
            size: { w: 71.6, h: 80 }
          },
          {
            id: crypto.randomUUID(),
            src: wallCabinet1bGrey,
            alt: '',
            name: 'Grey',
            size: { w: 71.6, h: 80 }
          }
        ]
      }
    ]
  },
  { name: 'Worktops' },
  {
    name: 'Handles and knobs',
    categories: [
      { name: 'All' },
      { name: 'Solid brass' },
      { name: 'Knobs' },
      { name: 'Black' },
      { name: 'Handles' }
    ],
    items: [
      {
        id: crypto.randomUUID(),
        name: 'Artem',
        desc: 'Solid brass door knob',
        categories: ['All', 'Solid brass', 'Knobs'],
        price: '£8.00',
        images: [
          { id: crypto.randomUUID(), src: knob1a, alt: '' },
          { id: crypto.randomUUID(), src: knob1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Lacie',
        desc: 'Solid brass handle',
        price: '£12.00',
        categories: ['All', 'Solid brass', 'Handles'],
        images: [
          { id: crypto.randomUUID(), src: handle1a, alt: '' },
          { id: crypto.randomUUID(), src: handle1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Aminta',
        desc: 'Cylindar door knob',
        price: '£10.00',
        categories: ['All', 'Black', 'Knobs'],
        images: [
          { id: crypto.randomUUID(), src: knob2a, alt: '' },
          { id: crypto.randomUUID(), src: knob2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Killain',
        desc: 'Hexagonal handle',
        price: '£16.00',
        categories: ['All', 'Black', 'Handles'],
        images: [
          { id: crypto.randomUUID(), src: handle2a, alt: '' },
          { id: crypto.randomUUID(), src: handle2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Artem',
        desc: 'Solid brass door knob',
        categories: ['All', 'Solid brass', 'Knobs'],
        price: '£8.00',
        images: [
          { id: crypto.randomUUID(), src: knob1a, alt: '' },
          { id: crypto.randomUUID(), src: knob1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Lacie',
        desc: 'Solid brass handle',
        price: '£12.00',
        categories: ['All', 'Solid brass', 'Handles'],
        images: [
          { id: crypto.randomUUID(), src: handle1a, alt: '' },
          { id: crypto.randomUUID(), src: handle1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Aminta',
        desc: 'Cylindar door knob',
        price: '£10.00',
        categories: ['All', 'Black', 'Knobs'],
        images: [
          { id: crypto.randomUUID(), src: knob2a, alt: '' },
          { id: crypto.randomUUID(), src: knob2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Killain',
        desc: 'Hexagonal handle',
        price: '£16.00',
        categories: ['All', 'Black', 'Handles'],
        images: [
          { id: crypto.randomUUID(), src: handle2a, alt: '' },
          { id: crypto.randomUUID(), src: handle2b, alt: '' }
        ]
      }
    ]
  }
]

export default products
