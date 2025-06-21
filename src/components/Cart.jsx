import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModelContext } from '@/model/context'

import SvgIcon from '@/components/SvgIcon'
import List from '@/components/List'

export default function Cart({ isCart = false }) {
  const [showList, setShowList] = useState(false)
  const [model] = useContext(ModelContext)
  const items = (isCart ? model?.cart.length : model?.units.length) ?? 0
  const router = useRouter()

  return (
    <div>
      <button
        className="inline-block relative"
        onClick={() => (isCart ? router.push('/view-cart') : setShowList(true))}
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
