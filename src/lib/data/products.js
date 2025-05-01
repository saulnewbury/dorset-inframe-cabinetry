// handles and knobs

import wallCabinet1a from '@/lib/images/products/wall-cabinet1a.jpg'
import wallCabinet1b from '@/lib/images/products/wall-cabinet1b.jpg'
import baseCabinet1a from '@/lib/images/products/base-cabinet1a.jpg'
import baseCabinet1b from '@/lib/images/products/base-cabinet1b.jpg'
import wallCabinet1aGrey from '@/lib/images/products/wall-cabinet1a-grey.jpg'
import wallCabinet1bGrey from '@/lib/images/products/wall-cabinet1b-grey.jpg'
import baseCabinet1aGrey from '@/lib/images/products/base-cabinet1a-grey.jpg'
import baseCabinet1bGrey from '@/lib/images/products/base-cabinet1b-grey.jpg'

import knobs from '@/lib/images/square/knobs-corston.webp'
import worktops from '@/lib/images/square/worksurface.webp'
import appliances from '@/lib/images/square/appliences-smeg.webp'
import storage from '@/lib/images/square/storage-accessories.webp'
import cabinets from '@/lib/images/cabinets.jpg'
import taps from '@/lib/images/square/taps-smeg.webp'

const products = [
  {
    name: 'Our cabinets',
    src: cabinets,
    url: '/products/cabinets',
    categories: [
      { name: 'All' },
      {
        name: 'Base cabinets',
        subCategories: [
          'For corner',
          'With door',
          'With drawers',
          'With sink',
          'For oven',
          'For dishwasher',
          'For bin',
          'For island',
          'Counter only'
        ]
      },
      {
        name: 'Tall cabinets',
        subCategories: ['Storage', 'Pantry', 'For oven', 'Fridge freezer']
      },
      {
        name: 'Wall cabinets',
        subCategories: ['Single door', 'Double doors']
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
  { name: 'Worktops', src: worktops, url: '/products/worktops' },
  {
    name: 'Handles and knobs',
    src: knobs,
    url: '/products/handles-and-knobs'
  },
  {
    name: 'Sinks and taps',
    src: taps,
    url: '/products/sinks-and-taps'
  },
  {
    name: 'Appliances',
    src: appliances,
    url: '/products/appliances'
  },
  {
    name: 'Storage accessories',
    src: storage,
    url: '/products/storage-accessories'
  }
]

export default products
