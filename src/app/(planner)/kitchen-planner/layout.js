'use client'
import { useRef, useState, useEffect } from 'react'

// Components
import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'
import IntroMessage from './IntroMessage'
import List from './List'

import { CanvasContext } from '../../../context'
import PerspectiveContextProvider from './perspectiveContextProvider'

// for dev perposes only
import single from '@/lib/images/example-cabinet-single-door.jpg'
import double from '@/lib/images/example-cabinet-double-door.jpg'

const items = [
  {
    image: single,
    info: {
      category: 'Base Cabinet',
      desc: 'Two Doors',
      width: 80,
      height: 80,
      price: 30.0
    },
    multiple: 2,
    total: 60.0
  },
  {
    image: double,
    info: {
      category: 'Base Cabinet',
      desc: 'Two Doors',
      width: 80,
      height: 80,
      price: 30.0
    },
    multiple: 2,
    total: 60.0
  }
]

export default function Layout({ children }) {
  const [ref, setRef] = useState({})
  const kitchenPlanner = useRef()
  const [showList, setShowList] = useState()

  useEffect(() => {
    setRef(kitchenPlanner) // give ref to CanvasContext
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator
          openList={() => {
            setShowList(true)
          }}
        />
        <CanvasContext.Provider value={ref}>
          <List
            items={items}
            showList={showList}
            closeList={() => {
              setShowList(false)
            }}
          />
          <IntroMessage />
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
