import {
  baseUnitStyles,
  tallUnitStyles,
  wallUnitStyles
} from '@/model/itemStyles'

// handles and knobs

import knobs from '@/lib/images/square/knobs-corston.webp'
import worktops from '@/lib/images/square/worksurface.webp'
import appliances from '@/lib/images/square/appliences-smeg.webp'
import storage from '@/lib/images/square/storage-accessories.webp'
import cabinets from '@/lib/images/cabinets.jpg'
import taps from '@/lib/images/square/taps-smeg.webp'

const cabinetOptions = [
  {
    type: 'finish',
    instruction: 'Choose frame finish',
    options: [
      { name: 'Beige', hex: '#F5F3F0' },
      { name: 'Grey', hex: '#D8DADB' },
      { name: 'Pale green', hex: '#ECEDE8' },
      { name: 'Blue', hex: '#3B5771' },
      { name: 'Dark stone', hex: '#393D40' }
    ]
  }
]

const products = [
  {
    name: 'Our cabinets',
    src: cabinets,
    url: '/products/cabinets',
    categories: [
      { name: 'All' },
      {
        name: 'Base cabinets',
        subCategories: Object.keys(baseUnitStyles)
      },
      {
        name: 'Tall cabinets',
        subCategories: Object.keys(tallUnitStyles)
      },
      {
        name: 'Wall cabinets',
        subCategories: ['One door', 'Two doors']
      }
    ],
    items: [
      Object.entries(baseUnitStyles).flatMap(([key, options]) =>
        options.flatMap((opt) =>
          opt.sizes.map((w, n) => ({
            categories: ['All', 'Base cabinets', key],
            group: opt.id.replace(':', '-'),
            id: opt.id.replace(':', '-') + '-' + w,
            type: 'base',
            variant: key,
            style: opt.id,
            width: w,
            name: opt.title,
            desc: `Width: ${(w / 10).toFixed(1)}cm`,
            price: `£${opt.prices[n]}`,
            options: cabinetOptions
          }))
        )
      ),
      Object.entries(tallUnitStyles).flatMap(([key, options]) =>
        options.flatMap((opt) =>
          opt.sizes.map((w, n) => ({
            categories: ['All', 'Tall cabinets', key],
            group: opt.id.replace(':', '-'),
            id: opt.id.replace(':', '-') + '-' + w,
            type: 'tall',
            variant: key,
            style: opt.id,
            width: w,
            name: opt.title,
            desc: `Width: ${(w / 10).toFixed(1)}cm`,
            price: `£${opt.prices[n]}`,
            options: cabinetOptions
          }))
        )
      ),
      wallUnitStyles.flatMap((opt) =>
        opt.sizes.map((w, n) => ({
          categories: ['All', 'Wall cabinets', opt.filterText],
          group: opt.id.replace(':', '-'),
          id: opt.id.replace(':', '-') + '-' + w,
          type: 'wall',
          style: opt.id,
          width: w,
          name: opt.title,
          desc: `Width: ${(w / 10).toFixed(1)}cm`,
          price: `£${opt.prices[n]}`,
          options: cabinetOptions
        }))
      )
    ].flat()
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
