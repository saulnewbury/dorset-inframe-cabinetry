import {
  baseUnitStyles,
  tallUnitStyles,
  wallUnitStyles
} from '@/model/itemStyles'

export function unitInfo(unit) {
  switch (unit.type) {
    case 'base':
      return baseInfo(unit)
    case 'wall':
      return wallInfo(unit)
    case 'tall':
      return tallInfo(unit)
    default:
      return null
  }
}

/**
 * Returns image and details for a base unit.
 */
function baseInfo(unit) {
  const inf =
    baseUnitStyles[unit.variant]?.find((s) => s.id === unit.style) ?? nullStyle
  const base = unit.style.replace(':', '-')
  const size = inf.sizes.indexOf(+unit.width)
  return {
    image: `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Base unit / ' + unit.variant,
      desc: inf.title,
      width: unit.width,
      height: unit.height,
      price: size < 0 ? NaN : inf.prices[size],
      finish: unit.finish
    }
  }
}

/**
 * Returns image and details for a wall unit.
 */
function wallInfo(unit) {
  const inf =
    wallUnitStyles.find((s) => s.sizes.includes(+unit.width)) ?? nullStyle
  const base = inf.id.replace(':', '-')
  const size = inf.sizes.indexOf(+unit.width)
  return {
    image: `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Wall unit',
      desc: inf.title,
      width: unit.width,
      height: 595,
      price: size < 0 ? NaN : inf.prices[size],
      finish: unit.finish
    }
  }
}

/**
 * Returns image and details for a tall cabinet.
 */
function tallInfo(unit) {
  const inf =
    tallUnitStyles[unit.variant]?.find((s) => s.id === unit.style) ?? nullStyle
  const base = inf.id.replace(':', '-')
  const size = inf.sizes.indexOf(+unit.width)
  return {
    image: `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Tall unit / ' + unit.variant,
      desc: inf.title,
      width: unit.width,
      height: unit.height,
      price: size < 0 ? NaN : inf.prices[size],
      finish: unit.finish
    }
  }
}
