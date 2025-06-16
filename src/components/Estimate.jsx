import { useContext } from 'react'
import { ModelContext } from '@/model/context'
import {
  baseUnitStyles,
  wallUnitStyles,
  tallUnitStyles
} from '@/model/itemStyles'

export default function Estimate() {
  const [model] = useContext(ModelContext)
  const total =
    (model?.units.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0) +
    (model?.cart.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0)
  return (
    <div className="fixed top-[90px] right-[20px] z-40 flex flex-col items-end bg-white">
      <span className="text-xs">Estimate:</span>
      <span className="font-bold">£{total.toFixed(2)}</span>
    </div>
  )

  function getPrice(unit) {
    let inf
    switch (unit.type) {
      case 'base':
        inf = baseUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
        break
      case 'wall':
        inf = wallUnitStyles.find((s) => s.sizes.includes(+unit.width))
        break
      case 'tall':
        inf = tallUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
        break
      default:
        return 0
    }
    const size = inf?.sizes.indexOf(+unit.width) ?? -1
    // console.log('getPrice', unit, inf, size)
    return size < 0 ? 0 : inf.prices[size] ?? 0
  }
}
