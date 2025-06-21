import { useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { unitInfo } from '@/lib/helpers/unitInfo'
import { ModelContext } from '@/model/context'

import UnitRow from '@/components/UnitRow'
import ApplianceRow from '@/components/ApplianceRow'
import SvgIcon from './SvgIcon'

export default function List({ onClose = () => {} }) {
  const [model] = useContext(ModelContext)
  const appliances = model.units?.filter((u) => u.type === 'appliance') ?? []

  // Compute the list of items in the kitchen planner model. This is a memoized
  // value that will only change when the model changes.
  const units = useMemo(() => {
    const listItems = model?.units ?? []
    const items = new Map()
    listItems
      .map((u) => unitInfo(u))
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

  const price = units.reduce((p, i) => p + i.total, 0)

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
        <div>
          <h2 className="pb-10 pt-14 font-bold px-14">
            Kitchen contents (estimated total: £{price})
          </h2>
          <div className="relative">
            <div className="text-base relative px-14">
              {units.map((item, idx) => (
                <UnitRow item={item} key={'unit-' + idx} />
              ))}
              {appliances.map((item, idx) => (
                <ApplianceRow item={item} key={'appliance-' + idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
