'use client'
import { twMerge } from 'tailwind-merge'

// floor
import checkers from '@/lib/icons/floor/checkers.svg'
import checkers2 from '@/lib/icons/floor/checkers2.svg'
import diagonal from '@/lib/icons/floor/diagonal.svg'
import grid from '@/lib/icons/floor/grid.svg'
import horizontalLines from '@/lib/icons/floor/horizontal-lines.svg'
import verticalLines from '@/lib/icons/floor/vertical-lines.svg'

const svgPatterns = [
  // floor patterns
  { icon: checkers, shape: 'checkers' },
  { icon: checkers2, shape: 'checkers2' },
  { icon: diagonal, shape: 'diagonal' },
  { icon: grid, shape: 'grid' },
  { icon: horizontalLines, shape: 'horizontal-lines' },
  { icon: verticalLines, shape: 'vertical-lines' }
]

export default function SvgFloorPattern({
  shape = '',
  alt = undefined,
  factor = null,
  width = null,
  height = null,
  mainColor,
  classes = ''
}) {
  const style = mainColor ? { fill: mainColor } : { fill: '#ffffff' }

  return svgPatterns.map((item, i) => {
    if (item.shape === shape) {
      return (
        <svg
          key={i}
          className={twMerge('svg-icon inline-block cursor-pointer', classes)}
          style={style}
          width={`${factor ? width * factor : item.icon.width}`}
          height={`${factor ? height * factor : item.icon.height}`}
          viewBox={`0 0 ${width ? width : item.icon.width} ${
            height ? height : item.icon.height
          }`}
          role='img'
          aria-label={alt}
        >
          <use href={item.icon.src + '#root'} />
        </svg>
      )
    }
  })
}
