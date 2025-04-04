import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import Image from 'next/image'

import submissionProcess from '@/assets/submission.svg'

export default function SubmitModel({ modelId, onClose = () => {} }) {
  const [timeframe, setTimeframe] = useState('')
  const [postcode, setPostcode] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const canSubmit = !!postcode
  const disabled = !!message

  return result ? (
    <div className="text-base">
      {result.error ? (
        <p>Submission failed: {result.error}</p>
      ) : (
        <>
          <h2 className="text-lg mb-4">
            Congratulations on submitting your design!
          </h2>
          <p>
            We will contact you within 48hrs to discuss details and timeframe,
            and to schedule a visit to conduct our own survey of the premises,
            should you decide to move forward with us.
          </p>
        </>
      )}
      <p className="mt-6 flex justify-end gap-8">
        <Button
          primary={!result.error}
          onClick={() => {
            setResult(null)
            onClose()
          }}
        >
          Close
        </Button>
      </p>
    </div>
  ) : (
    <div>
      <div className="flex justify-center mb-10">
        <Image src={submissionProcess} className="w-[75%] h-auto" />
      </div>
      <form onSubmit={submitModel}>
        <div className="flex flex-col gap-y-6">
          <TextInput
            name="timeframe"
            label="Project timeframe"
            value={timeframe}
            onChange={setTimeframe}
          />
          <TextInput
            name="postcode"
            label="Postcode"
            value={postcode}
            onChange={setPostcode}
          />
        </div>
        <p className="flex justify-end gap-8 col-span-2 mt-8">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={!canSubmit || disabled}
          >
            Next
          </Button>
        </p>
      </form>
      <p className="mt-6 text-red">{message}</p>
    </div>
  )

  async function submitModel(ev) {
    try {
      ev.preventDefault()
      setMessage('Submitting model...')
      const res = await fetch('/api/model/submit/' + modelId, {
        method: 'PATCH',
        body: JSON.stringify({
          timeframe,
          postcode
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        setMessage('Error submitting model')
        return
      }
      const data = await res.json()
      if (data.error) {
        setMessage(data.error)
        return
      }
      setResult(data)
    } catch (err) {
      setMessage(err.message)
      console.error(err)
    }
  }
}
