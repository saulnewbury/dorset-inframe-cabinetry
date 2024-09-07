'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './nav.css'

// let temp
export default function SubmenuMob({ items = '#', isOpen, hideMenu }) {
  const pathname = usePathname()

  return (
    <div className={`submenu-container leading-8 bottom-0`}>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } border-b border-lightGrey w-full py-[14px] flex flex-col`}
      >
        {items.map((item, i) => {
          return item.flyout ? (
            item.flyout.map((sub, i) => {
              return (
                <div
                  key={i}
                  className={`submenu-item ${
                    pathname.endsWith(sub.url) ? 'active' : ''
                  } flex relative text-black px-[37px] `}
                >
                  <Link
                    className='w-full'
                    key={i}
                    href={sub.url}
                    onClick={() => {
                      const str = pathname.split('/').slice(-1)[0]
                      if (sub.url.endsWith('/' + str)) hideMenu()
                    }}
                  >
                    {sub.name}
                  </Link>
                </div>
              )
            })
          ) : (
            <div
              key={i}
              className={`submenu-item ${
                pathname.endsWith(item.url) ? 'active' : ''
              } flex relative text-black px-[37px] `}
            >
              <Link
                className='w-full'
                key={i}
                href={item.url}
                onClick={() => {
                  const str = pathname.split('/').slice(-1)[0]
                  if (item.url.endsWith('/' + str)) hideMenu()
                }}
              >
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
