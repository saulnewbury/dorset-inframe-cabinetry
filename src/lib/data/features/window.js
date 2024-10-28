// Window
import { t } from '@/app/(planner)/kitchen-planner/const'

const jamb = 0.8,
  head = 1.2,
  totalHeightFromFloor = 1 + jamb / 2

const w = 0.05
const d = t + t * 0.2

export const dim = { w, d, totalHeightFromFloor }

export const casing = [
  {
    pos: [-jamb / 2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    len: head
  },
  {
    pos: [jamb / 2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    len: head
  },
  {
    pos: [0, -head / 2, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    len: jamb
  },
  {
    pos: [0, head / 2, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    len: jamb
  }
]

// top bottom left right
export const frame = [
  {
    pos: [-jamb / 2 + w / 2, 0, -d / 2],
    rotation: [0, 0, -Math.PI / 2],
    len: jamb
  },
  {
    pos: [jamb / 2 - w / 2, 0, -d / 2],
    rotation: [0, 0, Math.PI / 2],
    len: jamb
  },
  {
    pos: [0, -head / 2 + w / 2, -d / 2],
    rotation: [0, 0, 0],
    len: head
  },
  {
    // pos: [0, jamb / 2, 0],
    pos: [0, head / 2 - w / 2, -d / 2],
    rotation: [0, 0, Math.PI],
    len: head
  }
]
