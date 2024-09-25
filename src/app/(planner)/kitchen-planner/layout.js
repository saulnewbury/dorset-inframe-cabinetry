'use client'
import { useRef, useState, useEffect } from 'react'

import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'

import { CanvasContext } from '../../context'
import PerspectiveContextProvider from './perspectiveContextProvider'

export default function Layout({ children }) {
  const [ref, setRef] = useState({})
  const kitchenPlanner = useRef()

  useEffect(() => {
    setRef(kitchenPlanner)
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator />
        <CanvasContext.Provider value={ref}>
          <KitchenPlanner ref={kitchenPlanner} />
          {children}
        </CanvasContext.Provider>
      </PerspectiveContextProvider>
    </>
  )
}

// use imperative handle when it's an action, rather
// than push it through a boolian variable.

// discover whether a page needs a layout in the middle
// layout can call a component that produces the menu bar.
