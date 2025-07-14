import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ModelContext } from '@/model/context'
import SparkMD5 from 'spark-md5'

import Button from '@/components/Button'
import TextInput from '@/components/TextInput'

const quoteCracker = 'quoteCracker'
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const isRecaptcha = !!recaptchaSiteKey

export default function SubmitCartDialog({ isOpen, onClose = () => {} }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [postcode, setPostcode] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [model, dispatch] = useContext(ModelContext)
  const form = useRef(null)
  const dialog = useRef(null)
  const [mounted, setMounted] = useState(false)

  const canSubmit = !!postcode
  const disabled = !!message

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      dialog.current.autofocus = true
      dialog.current.showModal()
    } else dialog.current?.close()
  }, [isOpen])

  return (
    mounted &&
    createPortal(
      <dialog ref={dialog} onCancel={onClose}>
        <div className="bg-[#0000003f] h-[100vh] w-[100vw] fixed top-0 left-0 z-[500] flex justify-center items-center">
          <div className="w-[600px] bg-[white] p-12 relative ">
            {result ? (
              <div className="text-base">
                {result.error ? (
                  <p>Submission failed: {result.error}</p>
                ) : (
                  <>
                    <h2 className="text-lg mb-4">
                      Congratulations on submitting your request!
                    </h2>
                    <p>
                      We will contact you within 48hrs to provide you with a
                      quote for the items you have requested.
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
              <div className="text-base">
                <form ref={form} onSubmit={doSubmit}>
                  <h2 className="text-xl font-medium mb-4">
                    Submit your request for a quote:
                  </h2>
                  <p className="mb-6">
                    All items are made to order, so please tell us about you and
                    your location.
                  </p>
                  <div className="flex flex-col gap-y-6">
                    <TextInput
                      name="name"
                      label="Your name"
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
                <p className="mt-6">{message}</p>
              </div>
            )}
          </div>
        </div>
      </dialog>,
      document.body
    )
  )

  function doSubmit(e) {
    e.preventDefault()
    if (isRecaptcha) {
      const grecaptcha = globalThis.grecaptcha
      grecaptcha.enterprise.ready(async () => {
        try {
          const token = await grecaptcha.enterprise.execute(recaptchaSiteKey, {
            action: 'submitCart'
          })
          submitCart(token)
        } catch (error) {
          console.error('Error getting reCAPTCHA token:', error)
          setMessage(
            'An error occurred while verifying that you are not a bot. Please try again.'
          )
        }
      })
    } else {
      submitCart(getRandomToken())
    }
  }

  async function submitCart(token) {
    try {
      setMessage('Please wait...')
      const res = await fetch('/api/cart/submit/', {
        method: 'POST',
        body: JSON.stringify({
          token,
          cart: model.cart,
          name,
          email,
          postcode,
          isRecaptcha
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessage('')
      setResult(data)
      dispatch({
        id: 'resetCart'
      })
    } catch (err) {
      console.error(err)
      setMessage('')
      setResult({ error: err.message })
    }
  }

  /**
   * Generate a random token for fallback spam protection. A robot scraping
   * the web page will not be able to generate this token, so it provides a
   * basic level of spam protection.
   */
  function getRandomToken() {
    const randomBytes = new Uint8Array(16)
    globalThis.crypto.getRandomValues(randomBytes)
    const digits = Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('')
    const hash = new SparkMD5()
    hash.append(digits)
    hash.append(quoteCracker)
    return digits + '.' + hash.end()
  }
}
