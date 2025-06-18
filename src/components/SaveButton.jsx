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
        <Button primary classes="w-full" onClick={saveModel}>
          {title}
        </Button>
      ) : (
        <button
          className="inline-block relative"
          onClick={saveModel}
          title="Save and submit"
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
    } catch (err) {
      console.error(err)
      setResult({ error: err.message })
    } finally {
      setShowModelSaved(true)
    }
  }
}
