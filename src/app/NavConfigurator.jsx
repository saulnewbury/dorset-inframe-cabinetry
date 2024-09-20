'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import './nav.css'

import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'

import { plannerMenu } from '@/lib/data/menu'

export default function NavDesktop() {
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  function confirmNavigation(e) {
    e.preventDefault()
    setOpenConfirmation(true)
  }

  return (
    <>
      <nav className='z-40 hidden  lg:flex bg-white fixed w-[100vw] px-[37px] h-[4.5rem] justify-between items-center font-medium text-[14px] border-b border-lightGrey border-solid'>
        <div className='h-[max-content] relative z-[500]'>
          <Link href='/' onClick={confirmNavigation}>
            <span className='font-medium cursor-pointer'>
              Dorset Inframe Cabinetry
            </span>
          </Link>
        </div>

        <div className='links h-[4.5rem] flex items-center justify-center absolute w-full m-auto'>
          {plannerMenu.map((item, i) => {
            return (
              <div key={i} className='link-container h-full inline-block'>
                <Link
                  className={`link ${
                    pathname.startsWith(item.url) ? 'active' : ''
                  } cursor-pointer mr-[36px] h-full flex items-center relative`}
                  href={item.url}
                >
                  <span>{item.name}</span>
                </Link>
              </div>
            )
          })}
        </div>

        <div className='flex items-center'>
          {/* <span className='inline-block cursor-pointer'>
            <span className='mr-[5px]'>Login</span>
            <SvgIcon shape='login' />
          </span> */}
          <span className='inline-block relative cursor-pointer mr-[30px]'>
            <SvgIcon shape='list' />
            <div className='w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center'>
              <span className='text-[#ffffff] text-[0.5rem] font-bold'>25</span>
            </div>
          </span>

          <div className='h-[max-content] relative'>
            <Link href='/' onClick={confirmNavigation}>
              <span className='font-medium cursor-pointer'>Exit</span>
            </Link>
          </div>
        </div>
      </nav>
      {openConfirmation &&
        createPortal(
          <div className='absolute left-0 top-0 h-[100vh] w-[100vw] flex items-center justify-center z-[999] bg-overlay'>
            <div className='flex-col bg-white p-[4rem]'>
              <p className='mb-[2rem]'>
                Are you sure you to leave the planner?
              </p>
              <div className='flex justify-center'>
                <div
                  className='w-[max-content] h-[max-content] mr-[20px]'
                  onClick={() => {
                    setOpenConfirmation(false)
                  }}
                >
                  <Button classes='w-[10rem]'>Cancel</Button>
                </div>
                <Button classes='w-[10rem]' href='/' primary={true}>
                  Exit
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
