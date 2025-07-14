import { useContext, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SessionContext } from '@/context'

import SvgIcon from '@/components/SvgIcon'
import LoginDialog from '@/components/LoginDialog'

export default function UserStatus({ showLogin = false }) {
  const [session, setSession] = useContext(SessionContext)
  const [showLoginModal, setShowLogin] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)

  useEffect(() => {
    if (showLogin) setShowLogin(true)
  }, [showLogin])

  return (
    <div className="link-container h-full">
      {session ? (
        <div className="link h-full flex flex-col items-center relative group">
          <button
            className="h-full z-index-10"
            onClick={() => setShowUserPopup(!showUserPopup)}
            title="Logged in"
          >
            <SvgIcon shape="user" />
          </button>
          <div
            className={twMerge(
              'submenu-container leading-8 absolute w-[max-content] translate-y-[100%] bottom-0 z-50 pt-1 hidden group-hover:block',
              showUserPopup ? 'block' : 'hidden'
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
        <div className="link h-full flex flex-col justify-center items-center">
          <button
            type="button"
            className="flex gap-x-2 cursor-pointer"
            onClick={() => {
              console.log('Login button clicked')
              setShowLogin(!showLoginModal)
            }}
          >
            <span>Login</span>
            <SvgIcon shape="login" />
          </button>
        </div>
      )}

      <LoginDialog
        isOpen={showLoginModal}
        onClose={() => {
          setShowLogin(false)
        }}
      />
    </div>
  )

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
