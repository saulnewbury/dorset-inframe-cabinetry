'use client'
import { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { ModelContext } from '@/model/context'
import { CanvasContext, SessionContext } from '@/context'
import { useSearchParams } from 'next/navigation'

// Components
import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'
import IntroMessage from './IntroMessage'
import VerifyEmailDialog from './dialog/VerifyEmail'

import PerspectiveContextProvider from './perspectiveContextProvider'

export default function Layout({ children }) {
  const [ref, setRef] = useState({})
  const kitchenPlanner = useRef()
  const [model] = useContext(ModelContext)
  const search = useSearchParams()
  const [verifyId] = useState(search.get('verifyId')) // retain from initial URL
  const [session] = useContext(SessionContext)

  // Remove query string from URL after user has verified their email address.
  useEffect(() => {
    if (verifyId && session) {
      const url = new URL(window.location.href)
      url.searchParams.delete('verifyId')
      window.history.replaceState({}, document.title, url.toString())
    }
  }, [verifyId, session])

  useEffect(() => {
    setRef(kitchenPlanner) // give ref to CanvasContext
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator />

        <CanvasContext.Provider value={ref}>
          <VerifyEmailDialog
            verifyId={verifyId}
            onVerify={(session) => {
              doLogin(session)
              setShowSubmitModel(!!model.id)
            }}
          />
          {/* <IntroMessage show={!verifyId} /> */}
          <KitchenPlanner ref={kitchenPlanner} />
          {children}
        </CanvasContext.Provider>
      </PerspectiveContextProvider>
    </>
  )
}

const nullStyle = {
  id: 'null',
  title: 'Unknown',
  prices: [],
  sizes: [],
  filterText: 'Unknown'
}
