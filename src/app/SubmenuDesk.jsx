'use client'

import { useState } from 'react'
import Link from 'next/link'
import '@/nav.css'

import Flyout from './Flyout.jsx'

export default function SubmenuDesk({ items = '#', isOpen }) {
  const [flyout, setFlyout] = useState(false)
  const [submenu, setSubmenu] = useState(undefined)

  function handleMouseEnter(flyout) {
    if (flyout) {
      setFlyout(true)
      setSubmenu(flyout)
    }
  }

  function handleMouseLeave() {
    setFlyout(false)
    setSubmenu(undefined)
  }

  return (
    <div className='submenu-container leading-8 absolute w-[max-content] translate-y-[100%] bottom-0 z-50'>
      <div className={`${isOpen ? 'block' : 'hidden'} pt-6 flex flex-col`}>
        {items.map((item, i) => {
          return item.flyout ? (
            <div
              key={i}
              data-id={i}
              className={`submenu-item flex relative`}
              onMouseEnter={() => {
                handleMouseEnter(item.flyout)
              }}
              onMouseLeave={handleMouseLeave}
            >
              <Link key={i} href={item.url}>
                {item.name}
              </Link>
              {flyout && <Flyout items={submenu} />}
            </div>
          ) : (
            <div key={i} className={`submenu-item flex relative`}>
              <Link key={i} href={item.url}>
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
