'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

import '@/app/nav.css'

import Link from 'next/link'
import Button from '@/components/Button'
import MenuDesktop from '@/components/MenuDesktop'
import Cart from '@/components/Cart'
import UserStatus from '@/components/UserStatus'
import Estimate from '@/components/Estimate'

import { plannerMenu } from '@/lib/data/menu'
import SaveButton from '@/components/SaveButton'

export default function NavConfigurator() {
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <nav className="z-40 hidden bg-white fixed w-[100vw] px-[37px] h-[4.5rem] lg:grid grid-cols-[1fr_3fr_1fr] font-medium text-[14px] border-b border-lightGrey border-solid">
        <div className="h-full relative z-[500] flex items-center">
          <Link href="/" onClick={confirmNavigation}>
            <span className="font-medium cursor-pointer">
              Dorset Inframe Cabinetry
            </span>
          </Link>
        </div>

        <MenuDesktop menu={plannerMenu} />

        <div className="flex items-center justify-self-end h-full gap-x-[30px]">
          {/* <span className='inline-block cursor-pointer'>
            <span className='mr-[5px]'>Login</span>
            <SvgIcon shape='login' />
          </span> */}
          <SaveButton setShowLogin={setShowLogin} />

          <Cart />
          <UserStatus showLogin={showLogin} />
          <div className="h-[max-content] relative">
            <Link href="/" onClick={confirmNavigation}>
              <span className="font-medium cursor-pointer">Exit</span>
            </Link>
          </div>
        </div>
      </nav>

      <Estimate />

      {openConfirmation && (
        <ConfirmationDialog
          onClose={() => {
            setOpenConfirmation(false)
          }}
        />
      )}
    </>
  )

  function confirmNavigation(e) {
    e.preventDefault()
    setOpenConfirmation(true)
  }
}

function ConfirmationDialog({ onClose = () => {} }) {
  return createPortal(
    <div className="fixed left-0 top-0 h-[100vh] w-[100vw] flex items-center justify-center z-[999] bg-overlay">
      <div className="flex-col bg-white p-[4rem]">
        <p className="mb-[2rem]">Are you sure you want to leave the planner?</p>
        <div className="flex justify-center">
          <div
            className="w-[max-content] h-[max-content] mr-[20px]"
            onClick={onClose}
          >
            <Button classes="w-[10rem]">Cancel</Button>
          </div>
          <Button classes="w-[10rem]" href="/" primary={true}>
            Exit
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
