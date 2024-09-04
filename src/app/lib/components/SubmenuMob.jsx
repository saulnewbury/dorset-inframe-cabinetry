'use client'

import Link from 'next/link'
import '@/nav.css'

export default function SubmenuMob({
  items = '#',
  isOpen,
  closeMenu,
  isMobile
}) {
  return (
    <div
      className={`${
        !isMobile ? 'absolute translate-y-[100%] w-[max-content]' : ''
      } submenu-container leading-8 bottom-0`}
    >
      <div
        className={`${isOpen ? 'block' : 'hidden'} ${
          isMobile ? 'border-b border-lightGrey w-full py-[14px]' : 'pt-6'
        } flex flex-col`}
      >
        {items.map((item, i) => {
          return (
            <div
              key={i}
              className={`submenu-item flex relative text-black ${
                isMobile ? 'px-[37px]' : ''
              }`}
            >
              <Link key={i} href={item.url} onClick={closeMenu}>
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
