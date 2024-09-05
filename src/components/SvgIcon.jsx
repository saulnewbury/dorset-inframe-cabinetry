'use client'

import list from '@/lib/icons/list.svg'
import login from '@/lib/icons/login.svg'

const icons = [
  { icon: list, shape: 'list' },
  { icon: login, shape: 'login' }
]

export default function SvgIcon({ shape = '', alt = undefined }) {
  return icons.map((item, i) => {
    if (item.shape === shape) {
      return (
        <svg
          key={i}
          className='svg-icon inline-block'
          width={`${item.icon.width}`}
          height={`${item.icon.height}`}
          viewBox={`0 0 ${item.icon.width} ${item.icon.height}`}
          role='img'
          aria-label={alt}
        >
          <use href={item.icon.src + '#root'} stroke='currentcolor' />
        </svg>
      )
    }
  })
}
