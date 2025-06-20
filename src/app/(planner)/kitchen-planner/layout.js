'use client'
import { useRef, useState, useEffect } from 'react'
import { CanvasContext } from '@/context'

// Components
import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'
// import IntroMessage from './IntroMessage'

import PerspectiveContextProvider from './perspectiveContextProvider'
import NavConfigMobile from './NavConfigMobile'

export default function Layout({ children }) {
  const [ref, setRef] = useState({})
  const kitchenPlanner = useRef()

  useEffect(() => {
    setRef(kitchenPlanner) // give ref to CanvasContext
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator />
        <NavConfigMobile />
        <CanvasContext.Provider value={ref}>
          {/* <IntroMessage show={!verifyId} /> */}
          <KitchenPlanner ref={kitchenPlanner} />
          {children}
        </CanvasContext.Provider>
      </PerspectiveContextProvider>
    </>
  )
}
