'use client'
import { twMerge } from 'tailwind-merge'

// floor
import checkers from '@/lib/icons/floor/checkers.svg'
import diagonal from '@/lib/icons/floor/diagonal.svg'
import grid from '@/lib/icons/floor/grid.svg'
import horizontalLines from '@/lib/icons/floor/horizontal-lines.svg'
import verticalLines from '@/lib/icons/floor/vertical-lines.svg'

const svgPatterns = [
  // floor patterns
  { icon: checkers, shape: 'checkers' },
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
  color,
  classes = ''
}) {
  const style = color ? { fill: color } : { fill: '#ffffff' }

  return svgPatterns.map((item, i) => {
    if (item.shape === shape) {
      return (
        <svg
          key={i}
          className={twMerge('svg-icon inline-block cursor-pointer', classes)}
          style={style}
          // width={`${factor ? width * factor : item.icon.width}`}
          // height={`${factor ? height * factor : item.icon.height}`}
          width={`${width}`}
          height={`${height}`}
          viewBox={`0 0 ${width} ${height}`}
          role='img'
          aria-label={alt}
        >
          <use href={item.icon.src + '#root'} />
        </svg>
      )
    }
  })
}
