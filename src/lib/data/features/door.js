// Wall thickness
import { t } from '@/app/(planner)/kitchen-planner/const'

const height = 2.2,
  width = 1.2

export const cw = 0.05
export const d = t + t * 0.4

// order: left right top
export const casing = [
  {
    pos: [-width / 2 + cw / 2, 0, -d / 2],
    rotation: [0, 0, -Math.PI / 2],
    len: height
  },
  {
    pos: [width / 2 - cw / 2, 0, -d / 2],
    rotation: [0, 0, Math.PI / 2],
    len: height
  },
  {
    pos: [0, height / 2 - cw / 2, -d / 2],
    rotation: [0, 0, Math.PI],
    len: width
  }
]

export const sw = cw / 2

export const sd = t + t * 0.3

// left right top
export const stops = [
  {
    pos: [-width / 2 + sw / 2 + cw, -cw / 2, -sd / 2],
    rotation: [0, 0, -Math.PI / 2],
    len: height - cw
  },
  {
    pos: [width / 2 - sw / 2 - cw, -cw / 2, -sd / 2],
    rotation: [0, 0, Math.PI / 2],
    len: height
  },
  {
    pos: [0, height / 2 - sw / 2 - cw, -sd / 2],
    rotation: [0, 0, Math.PI],
    len: width - cw * 2
  }
]
