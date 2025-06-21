import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import {
  baseUnitStyles,
  wallUnitStyles,
  tallUnitStyles
} from '@/model/itemStyles'
import SvgIcon from './SvgIcon'
import SaveButton from './SaveButton'
import LoginDialog from './LoginDialog'

export default function Estimate({
  isFloating = true,
  onShowSummary = () => {}
}) {
  const [showLogin, setShowLogin] = useState(false)
  const [model] = useContext(ModelContext)

  const total =
    (model?.units.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0) +
    (model?.cart.reduce((acc, unit) => acc + getPrice(unit), 0) ?? 0)

  return isFloating ? (
    <div className="fixed top-[95px] right-[20px] z-40 bg-white text-right">
      <p className="text-xs">Estimate:</p>
      <p className="text-2xl leading-6 font-medium">£{total.toFixed(2)}</p>
    </div>
  ) : (
    <div className="w-[240px] max-w-[25vw] [&>p]:my-3 bg-lightGrey p-4">
      <p>Your estimate:</p>
      <p className="font-medium text-2xl">£{total.toFixed(2)}</p>
      <p>
        <button
          className="underline text-sm"
          onClick={() => onShowSummary(false)}
        >
          Summary
        </button>
      </p>
      {/* <p className="py-3">
        <button onClick={() => onShowSummary(true)}>
          <SvgIcon shape="printer" />
        </button>
      </p> */}
      <p className="!mt-6">
        <SaveButton title="Proceed" setShowLogin={setShowLogin} />
      </p>

      {showLogin && <LoginDialog onClose={() => setShowLogin(false)} />}
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
