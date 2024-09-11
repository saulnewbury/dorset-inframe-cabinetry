// handles and knobs

import knob1a from '@/lib/images/products/knob1a.webp'
import knob1b from '@/lib/images/products/knob1b.webp'
import handle1a from '@/lib/images/products/handle1a.webp'
import handle1b from '@/lib/images/products/handle1b.webp'
import knob2a from '@/lib/images/products/knob2a.webp'
import knob2b from '@/lib/images/products/knob2b.webp'
import handle2a from '@/lib/images/products/handle2a.webp'
import handle2b from '@/lib/images/products/handle2b.webp'

const products = [
  { name: 'Cabinets' },
  { name: 'Worktops' },
  {
    name: 'Handles and knobs',
    items: [
      {
        id: crypto.randomUUID(),
        name: 'Artem',
        desc: 'Solid brass door knob',
        categories: ['All', 'Solid brass', 'Knobs'],
        price: '£8',
        images: [
          { src: knob1a, alt: '' },
          { src: knob1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Lacie',
        desc: 'Solid brass handle',
        price: '£12',
        categories: ['All', 'Solid brass', 'Handles'],
        images: [
          { src: handle1a, alt: '' },
          { src: handle1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Aminta',
        desc: 'Cylindar door knob',
        price: '£10',
        categories: ['All', 'Black', 'Knobs'],
        images: [
          { src: knob2a, alt: '' },
          { src: knob2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Killain',
        desc: 'Hexagonal handle',
        price: '£16',
        categories: ['All', 'Black', 'Handles'],
        images: [
          { src: handle2a, alt: '' },
          { src: handle2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Artem',
        desc: 'Solid brass door knob',
        categories: ['All', 'Solid brass', 'Knobs'],
        price: '£8',
        images: [
          { src: knob1a, alt: '' },
          { src: knob1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Lacie',
        desc: 'Solid brass handle',
        price: '£12',
        categories: ['All', 'Solid brass', 'Handles'],
        images: [
          { src: handle1a, alt: '' },
          { src: handle1b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Aminta',
        desc: 'Cylindar door knob',
        price: '£10',
        categories: ['All', 'Black', 'Knobs'],
        images: [
          { src: knob2a, alt: '' },
          { src: knob2b, alt: '' }
        ]
      },
      {
        id: crypto.randomUUID(),
        name: 'Killain',
        desc: 'Hexagonal handle',
        price: '£16',
        categories: ['All', 'Black', 'Handles'],
        images: [
          { src: handle2a, alt: '' },
          { src: handle2b, alt: '' }
        ]
      }
    ]
  }
]

export default products
