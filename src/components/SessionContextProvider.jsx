'use client'

import { useState, useEffect } from 'react'
import { SessionContext } from '@/context'

export default function SessionContextProvider({ children }) {
  const [session, setSession] = useState(null)
  useEffect(() => {
    const data = sessionStorage.getItem('dc-session')
    if (data) {
      fetch('/api/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      })
        .then((rsp) => rsp.json())
        .then((ret) => {
          if (ret.sessionId) {
            setSession(ret)
          } else {
            console.warn('Session verification failed')
            setSession(null)
          }
        })
        .catch(() => {})
      setSession()
    }
  }, [])
  return (
    <SessionContext.Provider value={[session, setSession]}>
      {children}
    </SessionContext.Provider>
  )
}
