'use client'
import { useState } from 'react'

import Link from 'next/link'
import Breadcrumbs from './Breadcrumbs'
import MenuDesktop from '@/components/MenuDesktop'
import Cart from '@/components/Cart'
import UserStatus from '@/components/UserStatus'

import { menu } from '@/lib/data/menu'

import '../nav.css'
import SaveButton from '@/components/SaveButton'

export default function NavDesktop({ showCart = true }) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <nav className="z-40 hidden lg:flex bg-white fixed w-[100vw] px-[37px] h-[4.5rem] justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid">
        {/* {isOpen && (
          <div className='backpanel bg-[#ffffff] h-[328px] w-full fixed top-[72px] left-0'></div>
        )} */}
        <div className="h-[max-content]">
          <Link href="/">
            <span className="font-medium cursor-pointer">
              Dorset Inframe Cabinetry
            </span>
          </Link>
        </div>

        <MenuDesktop menu={menu} />

        <div className="flex items-center justify-self-end h-full gap-x-[30px]">
          <SaveButton setShowLogin={setShowLogin} />
          {showCart && <Cart />}
          <UserStatus showLogin={showLogin} />
        </div>
      </nav>

      {showCart && <Breadcrumbs />}
    </>
  )
}
