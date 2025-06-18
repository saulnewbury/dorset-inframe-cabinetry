'use client'

import { useParams, useRouter } from 'next/navigation'
import { useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/Button'
import TextInput from '@/components/TextInput'

export default function PasswordResetPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const { resetId } = useParams()
  const router = useRouter()
  const form = useRef(null)

  useLayoutEffect(() => {
    // Check if the resetId is valid
    if (!resetId) {
      setMessage('Invalid reset link')
      return
    }
  }, [resetId])

  const canSubmit = password && confirmPassword
  const disabled = !!message

  return isError ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="mt-4">An error occurred. Please try again.</p>
      <p className="flex justify-end gap-8 col-span-2 mt-4">
        <Button primary={true} onClick={() => setIsError(false)}>
          Try again
        </Button>
      </p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Password Reset</h1>
      <form
        ref={form}
        className={twMerge(
          'text-base flex flex-col gap-y-4',
          message && ' grayscale-[0.65] opacity-60'
        )}
        onSubmit={doReset}
      >
        <TextInput
          name="password"
          label="New password"
          type="password"
          value={password}
          disabled={disabled}
          autoComplete="new-password"
          onChange={(value) => {
            setPassword(value)
            form.current['confirm-password'].setCustomValidity(
              value !== confirmPassword ? 'Passwords do not match' : ''
            )
          }}
        />
        <TextInput
          name="confirm-password"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          disabled={disabled}
          autoComplete="new-password"
          onChange={(value) => {
            setConfirmPassword(value)
            form.current['confirm-password'].setCustomValidity(
              value !== password ? 'Passwords do not match' : ''
            )
          }}
        />
        <p className="flex justify-end gap-8 col-span-2 mt-4">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={!canSubmit || disabled}
          >
            Save
          </Button>
        </p>
      </form>
      <p className="mt-6">{message}</p>
    </div>
  )

  function onClose() {
    router.replace('/')
  }

  async function doReset(e) {
    e.preventDefault()
    try {
      setMessage('Please wait...')
      // Call API to reset password
      const res = await fetch(`/api/user/new-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resetId, password })
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      setMessage('')
      if (data.error) {
        console.warn(data.error)
        setIsError(true)
      } else router.replace('/')
    } catch (err) {
      console.error(err)
      setIsError(true)
    }
  }
}
