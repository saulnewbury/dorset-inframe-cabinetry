import { useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { ModelContext } from '@/model/context'
import {
  baseUnitStyles,
  tallUnitStyles,
  wallUnitStyles
} from '@/model/itemStyles'
import SvgIcon from './SvgIcon'

export default function List({ onClose = () => {} }) {
  const [model] = useContext(ModelContext)

  // Compute the list of items in the kitchen planner model. This is a memoized
  // value that will only change when the model changes.
  const modelItems = useMemo(() => {
    const items = new Map()
    if (model?.units)
      model.units
        .map((u) => {
          switch (u.type) {
            case 'base':
              return baseInfo(u)
            case 'wall':
              return wallInfo(u)
            case 'tall':
              return tallInfo(u)
          }
        })
        .forEach((item) => {
          const key = [
            item.info.category,
            item.info.desc,
            item.width,
            item.info.finish ? JSON.stringify(item.info.finish) : ''
          ].join('~')
          const detail = items.get(key)
          const multiple = detail ? detail.multiple + 1 : 1
          const total = multiple * item.info.price
          items.set(key, { ...(detail ?? item), multiple, total })
        })
    return Array.from(items.values())
  }, [model])

  // Compute the list of other units in the shopping cart.
  const cartItems = useMemo(() => {
    const items = new Map()
    const cart = model?.cart.filter((u) => u.type !== 'appliance')
    if (cart)
      cart
        .map((u) => {
          switch (u.type) {
            case 'base':
              return baseInfo(u)
            case 'wall':
              return wallInfo(u)
            case 'tall':
              return tallInfo(u)
          }
        })
        .forEach((item) => {
          const key = [item.info.category, item.info.desc, item.width].join('~')
          const detail = items.get(key)
          const multiple = detail ? detail.multiple + 1 : 1
          const total = multiple * item.info.price
          items.set(key, { ...(detail ?? item), multiple, total })
        })
    return Array.from(items.values())
  }, [model])

  const modelPrice = modelItems.reduce((p, i) => p + i.total, 0)
  const cartPrice = cartItems.reduce((p, i) => p + i.total, 0)

  return createPortal(
    <div className="bg-[#0000003f] h-screen w-[100vw] fixed top-0 left-0 z-[500] flex justify-end items-center">
      <div className="w-[650px] bg-[white] text-xl relative min-h-screen max-h-screen overflow-y-scroll">
        <button
          className="flex gap-2 text-base cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[1.5rem] z-[900]"
          type="button"
          onClick={onClose}
        >
          <SvgIcon shape="close" />
          <span>Close</span>
        </button>
        {model?.units && (
          <div>
            <h2 className="pb-10 pt-14 font-bold px-14">
              Kitchen design (estimated total: £{modelPrice})
            </h2>
            <div className="relative">
              <div className="text-base relative px-14">
                {modelItems.map((item, idx) => (
                  <UnitInfo item={item} key={idx} />
                ))}
              </div>
            </div>
          </div>
        )}
        {model?.cart && (
          <div>
            <h2 className="pb-10 pt-14 font-bold px-14">
              Shopping cart (estimated total: £{cartPrice})
            </h2>
            <div className="relative">
              <div className="text-base px-14">
                {cartItems.map((item, idx) => (
                  <UnitInfo item={item} key={'unit-' + idx} />
                ))}
                {model?.cart
                  .filter((u) => u.type === 'appliance')
                  .map((item, idx) => (
                    <ApplianceInfo item={item} key={'appliance-' + idx} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function UnitInfo({ item }) {
  return (
    <div className="grid grid-cols-[8rem,1fr,4rem] items-center gap-x-4 mb-3 pb-3 border-b-[1px] border-solid border-[#c7c7c7]">
      <div className="w-[100px] h-[100px]">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="h-full object-contain" />
        )}
      </div>
      <div>
        <div>{item.info.desc}</div>
        <div>
          {item.info.width}mm x {item.info.height}mm{' '}
          {item.info.finish &&
            '[' +
              item.info.finish.map((f) => `${f[0]}: ${f[1]}`).join(', ') +
              ']'}
        </div>
        <div className="text-xs">
          x{item.multiple} @ £{item.info.price}
        </div>
      </div>
      <div className="font-bold text-right pr-2">£{item.total}</div>
    </div>
  )
}

function ApplianceInfo({ item }) {
  return (
    <div className="grid grid-cols-[8rem,1fr,4rem] gap-x-4 mb-3 pb-3 border-b-[1px] border-solid border-[#c7c7c7]">
      <div></div>
      <div>
        <div>Appliance</div>
        <div>{item.code}</div>
      </div>
      <div className="font-bold text-right pr-2">£tbd</div>
    </div>
  )
}

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
