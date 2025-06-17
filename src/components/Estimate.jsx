import { useContext } from 'react'
import { ModelContext } from '@/model/context'
import {
  baseUnitStyles,
  wallUnitStyles,
  tallUnitStyles
} from '@/model/itemStyles'
import SvgIcon from './SvgIcon'
import Button from './Button'

export default function Estimate({
  isFloating = true,
  onShowSummary = () => {},
  onProceed = () => {}
}) {
  const [model] = useContext(ModelContext)

  const total =
    (model?.units.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0) +
    (model?.cart.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0)

  return isFloating ? (
    <div className="fixed top-[95px] right-[20px] z-40 bg-white">
      <p className="text-xs">Estimate:</p>
      <p className="font-bold">£{total.toFixed(2)}</p>
    </div>
  ) : (
    <div className="w-[240px] max-w-[25vw] [&>p]:my-3 bg-lightGrey border border-1 border-darkBlue p-4">
      <p>Your estimate:</p>
      <p className="font-bold text-lg">£{total.toFixed(2)}</p>
      <p>
        <button className="underline text-sm" onClick={onShowSummary}>
          Summary
        </button>
      </p>
      <p className="py-3">
        <button>
          <SvgIcon shape="printer" />
        </button>
      </p>
      <p>
        <Button primary classes={'w-full'} onClick={onProceed}>
          Proceed
        </Button>
      </p>
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
