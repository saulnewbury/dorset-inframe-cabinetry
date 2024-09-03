'use client'

import { useState } from 'react'
import Link from 'next/link'
import '@/nav.css'

import Flyout from '@/lib/components/Flyout.jsx'

export default function Dropdown({ items = '#', isOpen, closeMenu, isMobile }) {
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
      className={`${
        !isMobile ? 'absolute translate-y-[100%] w-[max-content]' : ''
      } submenu-container leading-8 bottom-0`}
      onMouseLeave={() => setEntered(false)}
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
              className={`${
                entered ? 'text-[grey]' : ''
              } submenu-item flex relative ${isMobile ? 'px-[37px]' : ''}`}
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