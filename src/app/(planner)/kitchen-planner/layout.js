'use client'
import { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { ModelContext } from '@/model/context'
import { useSearchParams } from 'next/navigation'

// Components
import KitchenPlanner from './KitchenPlanner'
import NavConfigurator from './NavConfigurator'
import IntroMessage from './IntroMessage'
import List from './List'
import LoginDialog from './dialog/LoginDialog'
import ModelSavedDialog from './dialog/ModelSaved'
import SubmitModelDialog from './dialog/SubmitModel'
import VerifyEmailDialog from './dialog/VerifyEmail'

import { CanvasContext } from '../../../context'
import PerspectiveContextProvider from './perspectiveContextProvider'
import {
  baseUnitStyles,
  tallUnitStyles,
  wallUnitStyles
} from '@/model/itemStyles'

export default function Layout({ children }) {
  const [ref, setRef] = useState({})
  const kitchenPlanner = useRef()
  const [showList, setShowList] = useState()
  const [showLogin, setShowLogin] = useState(false)
  const [showModelSaved, setShowModelSaved] = useState(false)
  const [showSubmitModel, setShowSubmitModel] = useState(false)
  const [isSave, setIsSave] = useState(false)
  const [saveResult, setSaveResult] = useState(null)
  const [model, dispatch] = useContext(ModelContext)
  const search = useSearchParams()
  const [verifyId] = useState(search.get('verifyId')) // retain from initial URL
  const [session, setSession] = useState(null)

  // Fetch session data from browser storage (if available).
  useEffect(() => {
    const sessionData = sessionStorage.getItem('sessionData')
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        if (new Date(session.expires).getTime() > Date.now()) {
          setSession(session)
        }
      } catch {}
    }
  }, [])

  // Remove query string from URL after user has verified their email address.
  useEffect(() => {
    if (verifyId && session) {
      const url = new URL(window.location.href)
      url.searchParams.delete('verifyId')
      window.history.replaceState({}, document.title, url.toString())
    }
  }, [verifyId, session])

  // Compute the list of items in the kitchen planner model. This is a memoized
  // value that will only change when the model changes.
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
  const totalPrice = items.reduce((ct, item) => ct + item.total, 0)

  useEffect(() => {
    setRef(kitchenPlanner) // give ref to CanvasContext
  }, [])

  return (
    <>
      <PerspectiveContextProvider>
        <NavConfigurator
          session={session}
          count={count}
          openList={() => setShowList(true)}
          saveModel={async () => {
            if (session && new Date(session.expires).getTime() > Date.now()) {
              setSaveResult(await doSaveModel())
              setShowModelSaved(true)
              return
            }
            setShowLogin(true)
            setIsSave(true)
          }}
          onLogOut={doLogout}
          onLogIn={() => setShowLogin(true)}
        />

        <CanvasContext.Provider value={ref}>
          <List
            items={items}
            showList={showList}
            closeList={() => setShowList(false)}
          />

          <LoginDialog
            show={showLogin}
            isSave={isSave}
            count={count}
            totalPrice={totalPrice}
            onClose={() => {
              setIsSave(false)
              setShowLogin(false)
            }}
            onLogin={doLogin}
          />

          <SubmitModelDialog
            show={showSubmitModel}
            onClose={() => setShowSubmitModel(false)}
          />

          <ModelSavedDialog
            show={showModelSaved}
            result={saveResult}
            onClose={() => {
              setShowModelSaved(false)
            }}
            onSubmit={() => {
              setShowModelSaved(false)
              setShowSubmitModel(true)
            }}
          />

          <VerifyEmailDialog
            verifyId={verifyId}
            onVerify={(session) => {
              doLogin(session)
              setShowSubmitModel(!!model.id)
            }}
          />
          <IntroMessage show={!verifyId} />
          <KitchenPlanner ref={kitchenPlanner} />
          {children}
        </CanvasContext.Provider>
      </PerspectiveContextProvider>
    </>
  )

  // Action handlers:

  async function doLogin(session) {
    setShowLogin(false)
    setSession(session)
    sessionStorage.setItem('sessionData', JSON.stringify(session))
    if (isSave) {
      setIsSave(false)
      setSaveResult(await doSaveModel())
      setShowModelSaved(true)
    }
  }

  async function doSaveModel() {
    try {
      const res = await fetch('/api/model/save', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: session.sessionId,
          modelData: model
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      // Check result.
      if (data.error) throw new Error(data.error)
      dispatch({
        id: 'setId',
        modelId: data.id,
        dateSaved: data.created
      })
      return data
    } catch (err) {
      console.error(err)
      return { error: err.message }
    }
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
      sessionStorage.removeItem('sessionData')
      setSession(null)
    }
  }
}

// use imperative handle when it's an action, rather
// than push it through a boolean variable.

// discover whether a page needs a layout in the middle
// layout can call a component that produces the menu bar.

function baseInfo(unit) {
  const inf = baseUnitStyles[unit.variant].find((s) => s.id === unit.style)
  const base = unit.style.replace(':', '-')
  return {
    image:
      unit.style === 'base:counter-only'
        ? null
        : `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Base unit / ' + unit.variant,
      desc: inf.title,
      width: unit.width,
      height: unit.height,
      price: inf.prices[inf.sizes.indexOf(+unit.width)]
    }
  }
}

function wallInfo(unit) {
  const inf = wallUnitStyles.find((s) => s.sizes.includes(+unit.width))
  const base = inf.id.replace(':', '-')
  return {
    image: `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Wall unit',
      desc: inf.title,
      width: unit.width,
      height: 595,
      price: inf.prices[inf.sizes.indexOf(+unit.width)]
    }
  }
}

function tallInfo(unit) {
  const inf = tallUnitStyles[unit.variant].find((s) => s.id === unit.style)
  const base = inf.id.replace(':', '-')
  return {
    image: `/units/${base}/${base}-${unit.width}-front.webp`,
    info: {
      category: 'Tall unit / ' + unit.variant,
      desc: inf.title,
      width: unit.width,
      height: unit.height,
      price: inf.prices[inf.sizes.indexOf(+unit.width)]
    }
  }
}
