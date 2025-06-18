import { useContext, useEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import SvgIcon from '@/components/SvgIcon'
import List from '@/components/List'

export default function Cart() {
  const [showList, setShowList] = useState(false)
  const [model] = useContext(ModelContext)
  const items = model ? model.units.length + model.cart.length : 0

  return (
    <div>
      <button
        className="inline-block relative"
        onClick={() => setShowList(true)}
        title="View cart"
      >
        <SvgIcon shape="list" />
        <div className="w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center">
          <span className="text-[#ffffff] text-[0.5rem] font-bold">
            {items}
          </span>
        </div>
      </button>
      {showList && <List onClose={() => setShowList(false)} />}
    </div>
  )
}
