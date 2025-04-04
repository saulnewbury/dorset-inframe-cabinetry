import { useContext, useRef, useState } from 'react'
import { ModelContext } from '@/model/context'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'

export default function SaveModel({
  items,
  price,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const [model, dispatch] = useContext(ModelContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isExisting, setExisting] = useState(false)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const form = useRef(null)

  const canSubmit = (name || isExisting) && email && password
  const disabled = !!message

  return result ? (
    <div>
      {result.error ? (
        <p>Save failed: {result.error}</p>
      ) : result.isVerified ? (
        <p>Success! Your design has been saved.</p>
      ) : (
        <p>
          Your model has been saved, and will be kept for 5 days. Please click
          the link in the email we&#39;ve sent you to verify your email address.
        </p>
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
        {result.isVerified && (
          <Button onClick={() => onSubmit(result.id)} primary={true}>
            Submit for review
          </Button>
        )}
      </p>
    </div>
  ) : (
    <div>
      <h2 className="text-lg font-bold">Save Model</h2>
      <form
        ref={form}
        onSubmit={saveModel}
        className={
          'text-base grid grid-cols-[1fr,auto] gap-x-16 gap-y-4' +
          (message ? ' grayscale-[0.65] opacity-60' : '')
        }
      >
        <p className="text-darkGrey text-sm col-span-2 mb-6">
          {isExisting ? (
            <span>
              New user?{' '}
              <a
                href="#new-user"
                onClick={(ev) => setUserType(ev, false)}
                className="hover:text-[#0061ff] hover:underline"
              >
                Create account
              </a>
            </span>
          ) : (
            <span>
              Existing user?{' '}
              <a
                href="#log-in"
                onClick={(ev) => setUserType(ev, true)}
                className="hover:text-[#0061ff] hover:underline"
              >
                Log in
              </a>
            </span>
          )}
        </p>
        <div className="flex flex-col gap-y-6">
          {!isExisting && (
            <TextInput
              name="name"
              label="Name"
              type="text"
              value={name}
              disabled={disabled}
              onChange={(value) => {
                setName(value)
                form.current['name'].setCustomValidity(
                  /^[\w\s\d]*$/.test(name)
                    ? ''
                    : 'Name can only contain letters, numbers and spaces'
                )
              }}
            />
          )}
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
            onChange={(value) => {
              setPassword(value)
              if (!isExisting) {
                form.current['confirm-password'].setCustomValidity(
                  value !== confirmPassword ? 'Passwords do not match' : ''
                )
              }
            }}
          />
          {!isExisting && (
            <TextInput
              name="confirm-password"
              label="Confirm password"
              type="password"
              disabled={disabled}
              autoComplete="new-password"
              onChange={(value) => {
                setConfirmPassword(value)
                form.current['confirm-password'].setCustomValidity(
                  value !== password ? 'Passwords do not match' : ''
                )
              }}
            />
          )}
        </div>
        <div className="text-lg">
          <p>Total items: {items}</p>
          <p>Est. price: £{price}</p>
        </div>
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
      <p className="mt-6 text-red">{message}</p>
    </div>
  )

  /**
   * Handles form submission. Sends the model to the server to be saved and,
   * on success, updates the model itself with the date and id.
   */
  async function saveModel(ev) {
    ev.preventDefault()
    setMessage('Saving model...')
    try {
      const res = await fetch('/api/model/save', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          modelData: model
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        setMessage('Error saving model')
        return
      }
      const data = await res.json()
      setMessage('')
      if (!data.error) {
        dispatch({
          id: 'setId',
          modelId: data.id,
          dateSaved: data.created
        })
      }
      setResult(data)
    } catch (err) {
      setMessage(err.message)
      console.error(err)
    }
  }

  function setUserType(ev, isExisting) {
    ev.preventDefault()
    setExisting(isExisting)
  }
}
