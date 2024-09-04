'use client'

import Link from 'next/link'
import '@/nav.css'

export default function SubmenuMob({ items = '#', isOpen }) {
  return (
    <div className={`submenu-container leading-8 bottom-0`}>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } border-b border-lightGrey w-full py-[14px] flex flex-col`}
      >
        {items.map((item, i) => {
          return (
            <div
              key={i}
              className={`submenu-item flex relative text-black px-[37px] `}
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
