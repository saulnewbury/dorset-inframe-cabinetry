'use client'

import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import { SessionContext } from '@/context'
import { ModelContext } from '@/model/context'

import '../nav.css'

import SvgIcon from '@/components/SvgIcon'

import { menu } from '@/lib/data/menu'

import SubmenuDesk from './SubmenuDesk'
import Breadcrumbs from './Breadcrumbs'
import LoginDialog from '@/components/LoginDialog'
import Estimate from '@/components/Estimate'

export default function NavDesktop() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [model] = useContext(ModelContext)
  const [showLogin, setShowLogin] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [session, setSession] = useContext(SessionContext)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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

        <div className="links h-full flex items-center">
          {menu.map((item, i) => {
            return (
              <div
                key={i}
                className="link-container h-full"
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
                {item.submenu && (
                  <SubmenuDesk
                    className="dropdown"
                    items={item.submenu}
                    isOpen={item.name === isOpen} // compares instance url with state url
                    closeMenu={() => setIsOpen(false)}
                  />
                )}
              </div>
            )
          })}

          <span className="inline-block relative cursor-pointer mr-[18px]">
            <SvgIcon shape="list" />
            <div className="w-[0.9rem] h-[0.9rem] bg-[black] rounded-full absolute bottom-[4px] -right-[7px] flex justify-center items-center">
              <span className="text-[#ffffff] text-[0.5rem] font-bold">
                {model.units.length}
              </span>
            </div>
          </span>

          {session ? (
            <div className="relative">
              <button onClick={() => setShowUserPopup(!showUserPopup)}>
                <SvgIcon shape="user" />
              </button>
              <div
                className={twMerge(
                  'absolute top-full bg-white text-nowrap border border-darkGrey px-2 shadow-md flex-col gap-y-2',
                  showUserPopup ? 'flex' : 'hidden'
                )}
              >
                <button
                  onClick={() => {
                    setShowUserPopup(false)
                    doLogout()
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="inline-block cursor-pointer"
              onClick={() => setShowLogin(!showLogin)}
            >
              <span>Login</span>
              <SvgIcon shape="login" />
            </button>
          )}
        </div>
      </nav>
      <Breadcrumbs />

      <LoginDialog
        show={showLogin}
        isSave={false}
        onClose={() => {
          setShowLogin(false)
        }}
        onLogin={doLogin}
      />

      <Estimate />
    </>
  )

  function doLogin(session) {
    setShowLogin(false)
    setSession(session)
    sessionStorage.setItem('dc-session', JSON.stringify(session))
  }

  async function doLogout() {
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
        body: JSON.stringify({ sessionId: session.sessionId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
    } catch (err) {
      console.error(err)
    } finally {
      sessionStorage.removeItem('dc-session')
      setSession(null)
    }
  }
}
