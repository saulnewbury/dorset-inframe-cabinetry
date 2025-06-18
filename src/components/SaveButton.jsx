import { useContext, useEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import { SessionContext } from '@/context'

import ModelSavedDialog from './ModelSaved'
import SubmitModelDialog from './SubmitModel'

import SvgIcon from './SvgIcon'
import Button from './Button'
import { twMerge } from 'tailwind-merge'

export default function SaveButton({ title, setShowLogin = () => {} }) {
  const [isSave, setIsSave] = useState(false)
  const [showModelSaved, setShowModelSaved] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [saveResult, setResult] = useState(null)
  const [model, dispatch] = useContext(ModelContext)
  const [session] = useContext(SessionContext)

  const canSave = model.units.length + model.cart.length > 0

  useEffect(() => {
    if (session && isSave) {
      setIsSave(false)
      setShowLogin(false)
      saveModel()
    }
  }, [session, isSave])

  return (
    <span className={twMerge('inline-block relative', title && 'w-full')}>
      {title ? (
        <Button
          primary
          classes="w-full"
          onClick={saveModel}
          disabled={!canSave}
        >
          {title}
        </Button>
      ) : (
        <button
          className="inline-block relative disabled:cursor-not-allowed"
          onClick={saveModel}
          title="Save and submit"
          disabled={!canSave}
        >
          <SvgIcon shape="save" />
        </button>
      )}

      {showModelSaved && (
        <ModelSavedDialog
          result={saveResult}
          onClose={() => {
            setShowModelSaved(false)
          }}
          onSubmit={() => {
            setShowModelSaved(false)
            setShowSubmitModal(true)
          }}
        />
      )}

      {showSubmitModal && (
        <SubmitModelDialog onClose={() => setShowSubmitModal(false)} />
      )}
    </span>
  )

  async function saveModel() {
    if (!session) {
      setIsSave(true)
      setShowLogin(true)
      return
    }
    try {
      if (model.dateSaved) {
        // If already saved and not changed since, just continue.
        setResult({})
      } else {
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
        setResult(data)
      }
    } catch (err) {
      console.error(err)
      setResult({ error: err.message })
    } finally {
      setShowModelSaved(true)
    }
  }
}
