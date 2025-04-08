'use client'
import { twMerge } from 'tailwind-merge'

import list from '@/lib/icons/list.svg'
import login from '@/lib/icons/login.svg'
import shape from '@/lib/icons/shape.svg'
import features from '@/lib/icons/features.svg'
import openings from '@/lib/icons/openings.svg'
import elements from '@/lib/icons/elements.svg'
import cabinets from '@/lib/icons/cabinets.svg'
import worktop from '@/lib/icons/worktop.svg'
import appliances from '@/lib/icons/appliances.svg'
import yourItems from '@/lib/icons/your-items.svg'
import colors from '@/lib/icons/colors.svg'

import close from '@/lib/icons/close.svg'
import save from '@/lib/icons/save.svg'

import square from '@/lib/icons/square-fplan.svg'
import notch from '@/lib/icons/notch-fplan.svg'
import slice from '@/lib/icons/slice-fplan.svg'
import squareDivide from '@/lib/icons/square-divide-fplan.svg'
import notchDivide from '@/lib/icons/notch-divide-fplan.svg'
import cornerDivide from '@/lib/icons/corner-divide-fplan.svg'

import capture from '@/lib/icons/capture.svg'

import wallHandle from '@/lib/icons/wall-handle.svg'
import wallHandleRight from '@/lib/icons/wall-handle-right.svg'
import wallHandleLeft from '@/lib/icons/wall-handle-left.svg'
import wallHandleStrokeLeft from '@/lib/icons/wall-handle-stroke-left.svg'
import wallHandleStrokeRight from '@/lib/icons/wall-handle-stroke-right.svg'
import cornerHandle from '@/lib/icons/corner-handle.svg'
import cornerHandleCircle from '@/lib/icons/corner-handle-circle.svg'

import pen from '@/lib/icons/pen.svg'
import person from '@/lib/icons/person.svg'

import icon2d from '@/lib/icons/2d-icon.svg'
import icon3d from '@/lib/icons/3d-icon.svg'

import tick from '@/lib/icons/tick.svg'

const icons = [
  { icon: list, shape: 'list' },
  { icon: login, shape: 'login' },
  { icon: shape, shape: 'shape' },
  { icon: features, shape: 'features' },
  { icon: openings, shape: 'openings' },
  { icon: elements, shape: 'we supply' },
  { icon: cabinets, shape: 'cabinets' },
  { icon: colors, shape: 'colors' },
  { icon: yourItems, shape: 'your items' },
  { icon: close, shape: 'close' },
  { icon: square, shape: 'square' },
  { icon: notch, shape: 'notch' },
  { icon: slice, shape: 'slice' },
  { icon: squareDivide, shape: 'square-divide' },
  { icon: notchDivide, shape: 'notch-divide' },
  { icon: cornerDivide, shape: 'corner-divide' },
  { icon: tick, shape: 'tick' },
  { icon: capture, shape: 'capture' },
  { icon: wallHandle, shape: 'wall-handle' },
  { icon: wallHandleRight, shape: 'wall-handle-right' },
  { icon: wallHandleLeft, shape: 'wall-handle-left' },
  { icon: wallHandleStrokeLeft, shape: 'wall-handle-stroke-left' },
  { icon: wallHandleStrokeRight, shape: 'wall-handle-stroke-right' },
  { icon: cornerHandle, shape: 'corner-handle' },
  { icon: cornerHandleCircle, shape: 'corner-handle-circle' },
  { icon: icon2d, shape: '2d' },
  { icon: icon3d, shape: '3d' },
  { icon: pen, shape: 'pen' },
  { icon: save, shape: 'save' },
  { icon: person, shape: 'user' }
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
