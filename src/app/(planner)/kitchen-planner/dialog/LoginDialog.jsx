import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Button from '@/components/Button'
import TextInput from '@/components/TextInput'

export default function LoginDialog({
  show,
  isSave,
  items,
  price,
  onClose = () => {},
  onLogin = () => {}
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isExisting, setExisting] = useState(true)
  const [message, setMessage] = useState('')
  const [isProblem, setIsProblem] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const form = useRef(null)

  const canSubmit = email && password && (isExisting || name)
  const disabled = !!message

  return (
    show && (
      <div className='bg-[#0000003f] h-[100vh] w-[100vw] absolute z-[500] flex justify-center items-center'>
        <div className='w-[600px] bg-[white] text-xl p-12 relative '>
          {isProblem ? (
            <div>
              <p>
                There was a problem with the account. Please check your email
                address and password and try again. Or create a new account.
              </p>
              <p className='flex justify-end gap-8 col-span-2 mt-4'>
                <Button
                  type='button'
                  primary={true}
                  onClick={setIsProblem(false)}
                >
                  Close
                </Button>
              </p>
            </div>
          ) : isReset ? (
            <div>
              <p>
                A password reset link has been sent to your email address.
                Please check your inbox.
              </p>
              <p className='flex justify-end gap-8 col-span-2 mt-4'>
                <Button
                  type='button'
                  primary={true}
                  onClick={() => setIsReset(false)}
                >
                  Close
                </Button>
              </p>
            </div>
          ) : (
            <div>
              <h2 className='text-lg font-bold'>
                {isExisting ? 'Log In' : 'Create Account'}
              </h2>
              <form
                ref={form}
                onSubmit={doLogin}
                className={twMerge(
                  'text-base grid gap-x-16 gap-y-4',
                  isSave && 'grid-cols-[1fr,auto]',
                  message && ' grayscale-[0.65] opacity-60'
                )}
              >
                <p className='text-darkGrey text-sm col-span-2 mb-6'>
                  {isExisting ? (
                    <span>
                      New user?{' '}
                      <a
                        href='#new-user'
                        onClick={(ev) => setUserType(ev, false)}
                        className='hover:text-[#0061ff] hover:underline'
                      >
                        Create account
                      </a>
                    </span>
                  ) : (
                    <span>
                      Existing user?{' '}
                      <a
                        href='#log-in'
                        onClick={(ev) => setUserType(ev, true)}
                        className='hover:text-[#0061ff] hover:underline'
                      >
                        Log in
                      </a>
                    </span>
                  )}
                </p>
                <div className='flex flex-col'>
                  {!isExisting && (
                    <TextInput
                      name='name'
                      label='Name'
                      type='text'
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
                    name='email'
                    label='Email address'
                    type='email'
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
                    name='password'
                    label='Password'
                    type='password'
                    value={password}
                    disabled={disabled}
                    autoComplete='new-password'
                    onChange={(value) => {
                      setPassword(value)
                      if (!isExisting) {
                        form.current['confirm-password'].setCustomValidity(
                          value !== confirmPassword
                            ? 'Passwords do not match'
                            : ''
                        )
                      }
                    }}
                  />
                  {isExisting ? (
                    <p>
                      <a
                        className='text-[#b0b0b0] text-sm hover:text-blue hover:underline italic'
                        href='#forgot'
                        onClick={forgotPassword}
                      >
                        Forgot password
                      </a>
                    </p>
                  ) : (
                    <TextInput
                      name='confirm-password'
                      label='Confirm password'
                      type='password'
                      value={confirmPassword}
                      disabled={disabled}
                      autoComplete='new-password'
                      onChange={(value) => {
                        setConfirmPassword(value)
                        form.current['confirm-password'].setCustomValidity(
                          value !== password ? 'Passwords do not match' : ''
                        )
                      }}
                    />
                  )}
                </div>
                {isSave && (
                  <div className='text-lg'>
                    <p>Total items: {items}</p>
                    <p>Est. price: £{price}</p>
                  </div>
                )}
                <p className='flex justify-end gap-8 col-span-2 mt-4'>
                  <Button type='button' onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    primary={true}
                    disabled={!canSubmit || disabled}
                  >
                    Save
                  </Button>
                </p>
              </form>
              <p className='mt-6'>{message}</p>
            </div>
          )}
        </div>
      </div>
    )
  )

  /**
   * Handles form submission. Sends the model to the server to be saved and,
   * on success, updates the model itself with the date and id.
   */
  async function doLogin(ev) {
    ev.preventDefault()
    try {
      setMessage('Please wait...')
      const res = await fetch(
        isExisting ? '/api/user/login' : '/api/user/create',
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      // Check result.
      if (data.error) throw new Error(data.error)
      setMessage('')
      onLogin(data)
    } catch (err) {
      console.error(err)
      setMessage('')
      setIsProblem(true)
    }
  }

  function setUserType(ev, isExisting) {
    ev.preventDefault()
    setExisting(isExisting)
  }

  async function forgotPassword(ev) {
    ev.preventDefault()
    if (!email) {
      form.current['email'].setCustomValidity('Email address is required')
      form.current['email'].reportValidity()
      return
    }
    try {
      setMessage('Please wait...')
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      // Check result.
      if (data.error) throw new Error(data.error)
      console.log(data)
      setMessage('')
      setIsReset(true)
    } catch (err) {
      console.error(err)
      setMessage('')
      setIsProblem(true)
    }
  }
}
