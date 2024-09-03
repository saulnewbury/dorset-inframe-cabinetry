'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

import './nav.css'

import SvgIcon from '@/lib/components/SvgIcon'

import { menuMob } from '@/lib/menuMob'

import Dropdown from '@/lib/components/Dropdown'

export default function NavMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    console.log(pathname)
  }, [pathname])

  return (
    <nav className='bg-white fixed w-[100vw] px-[37px] h-[4.5rem] flex justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid'>
      <div className='h-[max-content]'>
        <Link href='/'>
          <span className='font-medium cursor-pointer'>
            Dorset Inframe Cabinetry
          </span>
        </Link>
      </div>

      <div className='h-full flex items-center'>
        <div className='mr-[36px] inline-block relative cursor-pointer'>
          <SvgIcon shape='list' />
          <div className='w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center'>
            <span className='text-[#ffffff] text-[0.5rem] font-bold'>25</span>
          </div>
        </div>

        <div className='mr-[36px] inline-block cursor-pointer'>
          <span className='mr-[5px]'>Login</span>
          <SvgIcon shape='login' />
        </div>

        <div className='h-full w-[1px] bg-lightGrey mr-[36px]'></div>

        <button className=' h-[30px] w-[30px] relative'>
          <div className='h-[1px] w-full absolute bg-black top-[7px]'></div>
          <div className='h-[1px] w-full absolute bg-black bottom-[14.5px]'></div>
          <div className='h-[1px] w-full absolute bg-black bottom-[7px]'></div>
        </button>
      </div>

      {createPortal(
        <div className='mob-nav fixed top-[4.5rem] bg-white font-medium text-[14px] leading-8'>
          <div className='whitespace-nowrap'>
            {menuMob.map((item, i) => {
              return item.submenu ? (
                <div
                  key={i}
                  className='link-container relative border-lightGrey h-full'
                  onClick={() => {
                    if (!isOpen) {
                      setIsOpen(item.url)
                    } else {
                      setIsOpen(false)
                    }
                  }}
                >
                  <Link
                    className={`link ${
                      pathname.startsWith(item.url) ? 'active' : ''
                    } cursor-pointer flex items-center relative border-b border-lightGrey h-full py-[10px]`}
                    href={item.url}
                  >
                    <span className='px-[37px]'>{item.name}</span>
                  </Link>
                  <Dropdown
                    isMobile
                    items={item.submenu}
                    isOpen={item.url === isOpen} // compares instance url with state url
                    closeMenu={() => setIsOpen(false)}
                  />
                </div>
              ) : (
                <div key={i} className='link-container border-lightGrey h-full'>
                  <Link
                    className={`link ${
                      pathname.startsWith(item.url) ? 'active' : ''
                    } cursor-pointer flex items-center border-b border-lightGrey h-full py-[10px]`}
                    href={item.url}
                  >
                    <span className='px-[37px]'>{item.name}</span>
                  </Link>
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
