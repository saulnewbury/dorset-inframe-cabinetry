'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/nav.css'

// let temp
export default function SubmenuMob({ items = '#', isOpen }) {
  const pathname = usePathname()

  return (
    <div className={`submenu-container leading-8 bottom-0`}>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } border-b border-lightGrey w-full py-[14px] flex flex-col`}
      >
        {items.map((item, i) => {
          console.log(item.url)
          return (
            <div
              key={i}
              className={`submenu-item ${
                pathname.endsWith(item.url) ? 'active' : ''
              } flex relative text-black px-[37px] `}
            >
              <Link className='w-full' key={i} href={item.url}>
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
