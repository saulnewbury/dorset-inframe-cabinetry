'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import './nav.css'

import { usePathname } from 'next/navigation'

export default function SubmenuDesk({ items = '#', isOpen }) {
  const pathname = usePathname()

  return (
    <div className='submenu-container leading-8 absolute w-[max-content] translate-y-[100%] bottom-0 z-50 pt-1'>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } px-7 py-5 flex flex-col bg-white shadow-[0_14px_32px_-9px_rgba(0,0,0,0.1)] -ml-7`}
      >
        {items.map((item, i) => {
          return item.flyout ? (
            <Fragment key={item.id}>
              <div
                data-id={i}
                className={`${
                  pathname.endsWith(item.url) ? 'active' : ''
                } submenu-item flex relative`}
              >
                <Link href={item.url}>{item.name}</Link>
              </div>
              {item.flyout &&
                item.flyout.map((sub, i) => {
                  if (i == 0) return
                  return (
                    <div
                      key={sub.id}
                      data-id={i}
                      className={`${
                        pathname.endsWith(sub.url) ? 'active' : ''
                      } submenu-item flex relative`}
                    >
                      <Link href={sub.url}>{sub.name}</Link>
                    </div>
                  )
                })}
            </Fragment>
          ) : (
            i !== 0 && (
              <div
                key={item.id}
                className={`${
                  pathname.endsWith(item.url) ? 'active' : ''
                } submenu-item flex relative`}
              >
                <Link href={item.url}>{item.name}</Link>
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}
