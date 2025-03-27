'use client'
import { useRef, useState, useEffect, useContext, useMemo } from 'react'

// Components
import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'
import IntroMessage from './IntroMessage'
import List from './List'

import { CanvasContext } from '../../../context'
import PerspectiveContextProvider from './perspectiveContextProvider'
import { ModelContext } from '@/model/context'
import { baseUnitStyles, tallUnitStyles } from '@/model/itemStyles'

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
  const [model] = useContext(ModelContext)

  const items = useMemo(() => {
    const items = new Map()
    if (model?.units)
      model.units
        .map((u) => {
          switch (u.type) {
            case 'base':
              return baseInfo(u)
            case 'wall':
              return wallInfo(u)
            case 'tall':
              return tallInfo(u)
          }
        })
        .forEach((item) => {
          const key = [item.info.category, item.info.desc, item.width].join('~')
          const detail = items.get(key)
          const multiple = detail ? detail.multiple + 1 : 1
          const total = multiple * item.info.price
          items.set(key, { ...(detail ?? item), multiple, total })
        })
    return Array.from(items.values())
  }, [model])

  const count = items.reduce((ct, item) => ct + item.multiple, 0)

  useEffect(() => {
    setRef(kitchenPlanner) // give ref to CanvasContext
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator
          count={count}
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

function baseInfo(unit) {
  const inf = baseUnitStyles[unit.variant].find((s) => s.id === unit.style)
  const image = `/units/${unit.style.replace(':', '-')}-${
    unit.width
  }-front.webp`
  return {
    image,
    info: {
      category: 'Base Cabinet',
      desc: inf?.title ?? (+unit.width <= 600 ? 'One door' : 'Two doors'),
      width: unit.width,
      height: unit.height,
      price: inf?.price ?? Math.floor((1.4 * +unit.width) / 30)
    }
  }
}

function wallInfo(unit) {
  return {
    image: +unit.width < 600 ? single : double,
    info: {
      category: 'Wall Cabinet',
      desc: +unit.width < 600 ? 'One door' : 'Two doors',
      width: unit.width,
      height: 595,
      price: Math.floor(+unit.width / 30)
    }
  }
}

function tallInfo(unit) {
  const inf = tallUnitStyles[unit.variant].find((s) => s.id === unit.style)
  const image = `/units/${unit.style.replace(':', '-')}-${
    unit.width
  }-front.webp`
  return {
    image,
    info: {
      category: 'Base Cabinet',
      desc: inf?.title ?? (+unit.width <= 600 ? 'One door' : 'Two doors'),
      width: unit.width,
      height: unit.height,
      price: inf?.price ?? Math.floor((1.4 * +unit.width) / 30)
    }
  }
}
