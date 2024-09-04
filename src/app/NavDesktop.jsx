'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import './nav.css'

import SvgIcon from '@/lib/components/SvgIcon'

import { menuDesk } from '@/lib/menu'

import SubmenuDesk from '@/SubmenuDesk'

export default function NavDesktop() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className='hidden lg:flex bg-white fixed w-[100vw] px-[37px] h-[4.5rem] justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid'>
      <div className='h-[max-content]'>
        <Link href='/'>
          <span className='font-medium cursor-pointer'>
            Dorset Inframe Cabinetry
          </span>
        </Link>
      </div>

      {isOpen && (
        <div className='backpanel bg-white h-[360px] w-full fixed top-[72px] left-0'></div>
      )}

      <div className='links h-full flex items-center'>
        {menuDesk.map((item, i) => {
          return item.submenu ? (
            <div
              key={i}
              className='link-container h-full'
              onMouseEnter={() => setIsOpen(item.name)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <Link
                className={`link ${
                  pathname.startsWith(item.url) ? 'active' : ''
                } cursor-pointer mr-[36px] h-full flex items-center relative`}
                href={item.url}
              >
                <span>{item.name}</span>
              </Link>
              <SubmenuDesk
                className='dropdown'
                items={item.submenu}
                isOpen={item.name === isOpen} // compares instance url with state url
                closeMenu={() => setIsOpen(false)}
              />
            </div>
          ) : (
            <div key={i} className='link-container h-full'>
              <Link
                className={`link ${
                  pathname.startsWith(item.url) ? 'active' : ''
                } cursor-pointer mr-[36px] h-full flex items-center`}
                href={item.url}
              >
                <span>{item.name}</span>
              </Link>
            </div>
          )
        })}

        <span className='inline-block relative cursor-pointer'>
          <SvgIcon shape='list' />
          <div className='w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center'>
            <span className='text-[#ffffff] text-[0.5rem] font-bold'>25</span>
          </div>
        </span>

        {/* <span className='inline-block cursor-pointer'>
          <span className='mr-[5px]'>Login</span>
          <SvgIcon shape='login' />
        </span> */}
      </div>
    </nav>
  )
}
