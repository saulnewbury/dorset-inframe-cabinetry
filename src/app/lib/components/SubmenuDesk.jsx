'use client'

import { useState } from 'react'
import Link from 'next/link'
import '@/nav.css'

import Flyout from '@/lib/components/Flyout.jsx'

export default function SubmenuDesk({ items = '#', isOpen, closeMenu }) {
  const [flyout, setFlyout] = useState(false)
  const [submenu, setSubmenu] = useState(undefined)
  const [entered, setEntered] = useState(false)

  function handleMouseEnter(e, flyout) {
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
    <div
      className='submenu-container leading-8 absolute w-[max-content] translate-y-[100%] bottom-0'
      onMouseLeave={() => setEntered(false)}
    >
      <div className={`${isOpen ? 'block' : 'hidden'} pt-6 flex flex-col`}>
        {items.map((item, i) => {
          return item.flyout ? (
            <div
              key={i}
              data-id={i}
              className={`submenu-item flex relative`}
              onMouseEnter={(e) => {
                handleMouseEnter(e, item.flyout)
                setEntered(true)
              }}
              onMouseLeave={handleMouseLeave}
            >
              <Link key={i} href={item.url} onClick={closeMenu}>
                {item.name}
              </Link>
              {flyout && <Flyout items={submenu} />}
            </div>
          ) : (
            <div
              key={i}
              className={`submenu-item flex relative`}
              onMouseEnter={() => setEntered(true)}
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
