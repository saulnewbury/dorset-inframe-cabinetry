'use client'
import { twMerge } from 'tailwind-merge'

import list from '@/lib/icons/list.svg'
import login from '@/lib/icons/login.svg'
import shape from '@/lib/icons/shape.svg'
import features from '@/lib/icons/features.svg'
import openings from '@/lib/icons/openings.svg'
import elements from '@/lib/icons/elements.svg'
import close from '@/lib/icons/close.svg'

import square from '@/lib/icons/square-fplan.svg'
import notch from '@/lib/icons/notch-fplan.svg'
import slice from '@/lib/icons/slice-fplan.svg'
import squareDivide from '@/lib/icons/square-divide-fplan.svg'
import notchDivide from '@/lib/icons/notch-divide-fplan.svg'
import cornerDivide from '@/lib/icons/corner-divide-fplan.svg'

import icon2d from '@/lib/icons/2d-icon.svg'
import icon3d from '@/lib/icons/3d-icon.svg'

import tick from '@/lib/icons/tick.svg'

const icons = [
  { icon: list, shape: 'list' },
  { icon: login, shape: 'login' },
  { icon: shape, shape: 'shape' },
  { icon: features, shape: 'features' },
  { icon: openings, shape: 'openings' },
  { icon: elements, shape: 'elements' },
  { icon: close, shape: 'close' },
  { icon: square, shape: 'square' },
  { icon: notch, shape: 'notch' },
  { icon: slice, shape: 'slice' },
  { icon: squareDivide, shape: 'square-divide' },
  { icon: notchDivide, shape: 'notch-divide' },
  { icon: cornerDivide, shape: 'corner-divide' },
  { icon: tick, shape: 'tick' },
  { icon: icon2d, shape: '2d' },
  { icon: icon3d, shape: '3d' }
]

export default function SvgIcon({ shape = '', alt = undefined, classes = '' }) {
  return icons.map((item, i) => {
    if (item.shape === shape) {
      return (
        <svg
          key={i}
          className={twMerge(
            'svg-icon inline-block cursor-pointer fill-transparent stroke-[currentcolor]',
            classes
          )}
          width={`${item.icon.width}`}
          height={`${item.icon.height}`}
          viewBox={`0 0 ${item.icon.width} ${item.icon.height}`}
          role='img'
          aria-label={alt}
        >
          <use href={item.icon.src + '#root'} />
        </svg>
      )
    }
  })
}
