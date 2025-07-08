import { useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ModelContext } from '@/model/context'
import { twMerge } from 'tailwind-merge'

import SvgIcon from '@/components/SvgIcon'
import List from '@/components/List'

export default function Cart({ isCart = false }) {
  const [showList, setShowList] = useState(false)
  const [model] = useContext(ModelContext)
  const items = (isCart ? model?.cart.length : model?.units.length) ?? 0
  const router = useRouter()
  const path = usePathname()

  return (
    <div className="link-container h-full">
      <div
        className={twMerge(
          'link h-full flex items-center relative',
          path.endsWith('view-cart') && 'active'
        )}
      >
        <button
          className="h-full relative"
          onClick={() =>
            isCart ? router.push('/view-cart') : setShowList(true)
          }
          title="View cart"
        >
          <SvgIcon shape={isCart ? 'cart' : 'list'} />
          <div className="w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute top-[45%] -right-[7px] flex justify-center items-center">
            <span className="text-[#ffffff] text-[0.5rem] font-bold">
              {items}
            </span>
          </div>
        </button>
        {showList && <List onClose={() => setShowList(false)} />}
      </div>
    </div>
  )
}
