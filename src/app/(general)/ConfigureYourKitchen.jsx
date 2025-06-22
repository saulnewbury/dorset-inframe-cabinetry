'use client'

import { twMerge } from 'tailwind-merge'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import { SessionContext } from '@/context'
import { useRouter } from 'next/navigation'

import Button from '@/components/Button'
import Image from 'next/image'
import LoginDialog from '@/components/LoginDialog'
import kitchenSketch from '@/lib/images/kitchen-sketch.jpg'

export default function ConfigureYourKitchen({ classes = '' }) {
  const [showChooser, setShowChooser] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [model, dispatch] = useContext(ModelContext)
  const [session, setSession] = useContext(SessionContext)
  const router = useRouter()
  const hasModel = model && !model.dateSaved

  return (
    <>
      <section
        className={twMerge(
          'relative gutter w-[100vw] h-[100vh] max-h-[800px] md:mt-[60px]',
          classes
        )}
      >
        <div className="md:px-[5rem] h-full max-h-[800px] max-w-[800px] relative top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <div className="absolute h-full w-full top-0 left-0">
            <Image
              src={kitchenSketch}
              fill
              className="object-cover opacity-50"
              alt=""
            />
          </div>
          <div className="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center ">
            <h1 className="header mb-[2rem]">Design your kitchen today</h1>
            <div className="flex gap-4">
              {hasModel ? (
                <Button
                  href={'/kitchen-planner/make-it-yours'}
                  replace={true}
                  primary={true}
                >
                  Continue your design
                </Button>
              ) : session ? (
                <Button onClick={() => setShowChooser(true)} primary={true}>
                  Your saved designs
                </Button>
              ) : (
                <Button onClick={() => setShowLogin(true)} primary={true}>
                  Log on to see your designs
                </Button>
              )}
              <Button
                href={'/kitchen-planner/define-your-space'}
                replace={true}
                onClick={resetModel}
              >
                Start from scratch
              </Button>
            </div>
          </div>
        </div>

        {showChooser && (
          <ChooseModel
            onClose={() => setShowChooser(false)}
            onChosen={loadSavedModel}
          />
        )}
      </section>
      {showLogin && (
        <LoginDialog
          onClose={() => {
            setShowLogin(false)
          }}
        />
      )}
    </>
  )

  async function loadSavedModel(id) {
    setShowChooser(false)
    const rsp = await fetch(`/api/model/${id}?sessionId=${session.sessionId}`)
    if (!rsp.ok) {
      alert('Failed to load model: ' + rsp.statusText)
      return
    }
    const data = await rsp.json()
    if (data.error) {
      alert('Failed to load model: ' + data.error)
      return
    }
    dispatch({
      id: 'setModel',
      model: JSON.parse(data.model.modelData)
    })
    router.replace('/kitchen-planner/make-it-yours')
  }

  function resetModel(ev) {
    const hasModel =
      model && (model.units.length > 0 || model.openings.length > 0)
    if (
      hasModel &&
      !window.confirm(
        'Really start from scratch? Your current design will be lost.'
      )
    ) {
      ev.preventDefault()
      return
    }
    dispatch({ id: 'resetModel' })
  }
}

function ChooseModel({ onClose = () => {}, onChosen = () => {} }) {
  const [models, setModels] = useState([])
  const [session] = useContext(SessionContext)

  const loadModelsCB = useCallback(loadModels, [session, setModels])

  useEffect(() => {
    const t = setTimeout(loadModelsCB, 20)
    return () => clearTimeout(t)
  }, [loadModelsCB])

  return (
    <div className="fixed top-0 left-0 h-[100vh] w-[100vw] bg-[#0000003f] z-[500] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">Choose a saved design</h2>
        <p className="mb-4">Select a design to continue working on it.</p>
        {/* Placeholder for saved designs list */}
        <ul className="space-y-2">
          {models.map((model) => (
            <li
              key={model.id}
              className="flex w-full p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChosen(model.id)
              }}
            >
              <span className="grow">
                Created {new Date(model.created).toLocaleDateString()}
              </span>
              {model.submitted && (
                <span className="text-green-500">Submitted</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </p>
      </div>
    </div>
  )

  async function loadModels() {
    const rsp = await fetch('/api/model/list?sessionId=' + session.sessionId)
    if (!rsp.ok) {
      alert('Failed to load models:' + rsp.statusText)
      return
    }
    const data = await rsp.json()
    if (data.error) {
      alert('Failed to load models: ' + data.error)
      return
    }
    setModels(data.models)
  }
}
