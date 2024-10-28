// Window
import { t } from '@/app/(planner)/kitchen-planner/const'

const w = 0.05
const d = t + t * 0.2

export const dim = { w, d }

export function casingDimensions(width, height) {
  // top bottom left right
  return [
    {
      pos: [-height / 2, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      len: width
    },
    {
      pos: [height / 2, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      len: width
    },
    {
      pos: [0, -width / 2, 0],
      rotation: [Math.PI / 2, 0, Math.PI / 2],
      len: height
    },
    {
      pos: [0, width / 2, 0],
      rotation: [Math.PI / 2, 0, Math.PI / 2],
      len: height
    }
  ]
}

export function frameDimensions(width, height) {
  // top bottom left right
  return [
    {
      pos: [-height / 2 + w / 2, 0, -d / 2],
      rotation: [0, 0, -Math.PI / 2],
      len: height
    },
    {
      pos: [height / 2 - w / 2, 0, -d / 2],
      rotation: [0, 0, Math.PI / 2],
      len: height
    },
    {
      pos: [0, -width / 2 + w / 2, -d / 2],
      rotation: [0, 0, 0],
      len: width
    },
    {
      // pos: [0, jamb / 2, 0],
      pos: [0, width / 2 - w / 2, -d / 2],
      rotation: [0, 0, Math.PI],
      len: width
    }
  ]
}
