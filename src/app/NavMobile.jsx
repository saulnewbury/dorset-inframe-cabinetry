'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

// Style sheet
import './nav.css'

// Components
import SvgIcon from '@/lib/components/SvgIcon'
import MenuButton from './MenuButton'
import SubmenuMob from './SubmenuMob'

// Static content
import { menuMob } from '@/lib/menu'

export default function NavMobile() {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  let pathname = usePathname()

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
    <nav className='bg-white fixed w-[100vw] px-[25px] sm:px-[37px] h-[4.5rem] flex justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid'>
      <div className='h-[max-content]'>
        <Link href='/'>
          <span className='font-medium cursor-pointer'>
            Dorset Inframe Cabinetry
          </span>
        </Link>
      </div>

      <div className='h-full flex items-center'>
        <div className='mr-[20px] sm:mr-[36px] inline-block relative cursor-pointer'>
          <SvgIcon shape='list' />
          <div className='w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center'>
            <span className='text-[#ffffff] text-[0.5rem] font-bold'>25</span>
          </div>
        </div>

        {/* <div className='mr-[20px] md:mr-[36px] inline-block cursor-pointer'>
          <span className='mr-[5px]'>Login</span>
          <SvgIcon shape='login' />
        </div> */}

        <div className='h-full w-[1px] bg-lightGrey mr-[20px] sm:mr-[37px]'></div>

        <MenuButton isVisible={isVisible} toggleNav={toggleNav} />
      </div>

      {createPortal(
        <div
          className={`mob-nav fixed top-[4.5rem] bg-white z-[100] font-medium text-[14px] leading-8 lg:hidden ${
            !isVisible ? 'hidden' : 'block'
          }`}
        >
          <div className='whitespace-nowrap'>
            {menuMob.map((item, i) => {
              return (
                <div
                  key={i}
                  className='link-container relative border-lightGrey h-full hover:text-[grey]'
                >
                  {item.url ? (
                    <Link
                      className={`link cursor-pointer flex items-center relative border-b border-lightGrey h-full py-[10px]`}
                      href={item.url}
                    >
                      <span className='px-[37px]'>{item.name}</span>
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
                      <span className='px-[37px]'>{item.name}</span>
                    </span>
                  )}
                  {item.submenu && (
                    <SubmenuMob
                      isMobile
                      items={item.submenu}
                      isOpen={item.name === isOpen} // compares instance name with state name
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
