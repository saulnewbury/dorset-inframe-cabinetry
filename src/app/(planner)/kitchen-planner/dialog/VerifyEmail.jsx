import { useRef, useState } from 'react'

import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

export default function VerifyEmail({
  requestId,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const form = useRef(null)

  const canSubmit = email && password
  const disabled = !!message

  return result ? (
    <div>
      {result.error ? (
        <p>Verification failed: {result.error}</p>
      ) : (
        <p>Success! Your email address has been verified.</p>
      )}
      <p className="mt-6 flex justify-end gap-8">
        <Button
          onClick={() => {
            setResult(null)
            onClose()
          }}
        >
          Close
        </Button>
        {result.canSubmit && (
          <Button onClick={() => onSubmit(requestId)} primary={true}>
            Submit for review
          </Button>
        )}
      </p>
    </div>
  ) : (
    <form ref={form} className="text-base" onSubmit={doVerify}>
      <p className="mb-4">
        Please verify your email address by logging in, below.
      </p>
      <div className="flex flex-col gap-y-6">
        <TextInput
          name="email"
          label="Email address"
          type="email"
          value={email}
          disabled={disabled}
          onChange={(value) => {
            setEmail(value)
            form.current['email'].setCustomValidity(
              /^[\w\d.@]*$/.test(email)
                ? ''
                : 'Address must match the format of an email address'
            )
          }}
        />
        <TextInput
          name="password"
          label="Password"
          type="password"
          value={password}
          disabled={disabled}
          autoComplete="new-password"
          onChange={setPassword}
        />
      </div>
      <p className="flex justify-end gap-8 mt-6">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" primary={true} disabled={!canSubmit || disabled}>
          Next
        </Button>
      </p>
      <p className="mt-6 text-red">{message}</p>
    </form>
  )

  async function doVerify(ev) {
    ev.preventDefault()
    try {
      setMessage('Verifying email address...')
      const res = await fetch('/api/model/verify', {
        method: 'POST',
        body: JSON.stringify({ email, password, requestId })
      })
      if (!res.ok) throw new Error('Verification failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setMessage(err.message)
    }
  }
}
