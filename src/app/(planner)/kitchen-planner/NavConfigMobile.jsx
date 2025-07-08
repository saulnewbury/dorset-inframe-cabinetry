'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

// Style sheet
import '@/app/nav.css'

// Components
import MenuButton from '@/components/MenuButton'
import SubmenuMob from '@/components/SubmenuMob'
import Cart from '@/components/Cart'
import SaveButton from '@/components/SaveButton'

// Static content
import { plannerMenu as menu } from '@/lib/data/menu'

export default function NavMobile() {
  const [portal, setPortal] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // Entire menu
  const [isOpen, setIsOpen] = useState(false) // Submenu
  const [showLogin, setShowLogin] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setPortal(true)
  }, [])

  useEffect(() => {
    setIsVisible(false)
  }, [pathname])

  function toggleNav() {
    setIsVisible(!isVisible)
    if (!isVisible) {
      setIsOpen(false)
    }
  }

  return (
    <nav className="z-50 gutter bg-white fixed w-full h-[4.5rem] flex justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid lg:hidden">
      <div className="h-[max-content]">
        <Link href="/">
          <span className="font-medium cursor-pointer">
            Dorset Inframe Cabinetry
          </span>
        </Link>
      </div>

      <div className="h-full flex items-center gap-x-5">
        <SaveButton setShowLogin={setShowLogin} />
        <Cart />

        {/* <div className='mr-[20px] md:mr-[36px] inline-block cursor-pointer'>
          <span className='mr-[5px]'>Login</span>
          <SvgIcon shape='login' />
        </div> */}

        <div className="h-full w-[1px] bg-lightGrey" />

        <MenuButton isVisible={isVisible} toggleNav={toggleNav} />
      </div>

      {portal &&
        createPortal(
          <div
            className={`mob-nav fixed top-[4.5rem] bg-white z-[999] font-medium text-[14px] leading-8 lg:hidden ${
              !isVisible ? 'hidden' : 'block'
            }`}
          >
            <div className="whitespace-nowrap">
              {menu.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="link-container relative border-lightGrey h-full hover:text-[grey]"
                  >
                    {!item.submenu ? (
                      <Link
                        className={`link cursor-pointer flex items-center relative border-b border-lightGrey h-full py-[10px]`}
                        href={item.url}
                        onClick={() => {
                          const str = pathname.split('/').at(-1)
                          if (item.url.endsWith('/' + str)) setIsVisible(false)
                        }}
                      >
                        <span className="px-[37px]">{item.name}</span>
                      </Link>
                    ) : (
                      <span
                        onClick={() => {
                          if (item.name === isOpen) {
                            setIsOpen(false)
                          } else {
                            setIsOpen(item.name)
                          }
                        }}
                        className={`link cursor-pointer flex items-center relative border-b border-lightGrey h-full py-[10px]`}
                      >
                        <span className="px-[37px]">{item.name}</span>
                      </span>
                    )}
                    {item.submenu && (
                      <SubmenuMob
                        isMobile
                        items={item.submenu}
                        isOpen={item.name === isOpen} // compares instance name with state name
                        hideMenu={() => {
                          setIsVisible(false)
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </nav>
  )
}
