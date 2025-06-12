'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import SparkMD5 from 'spark-md5'

import HeroText from '@/components/HeroText'
import TextInput from '@/components/TextInput'
import Textarea from '@/components/Textarea'
import Script from 'next/script'

import Footer from '@/components/Footer'

const contactCracker = 'contactCracker'
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const isRecaptcha = !!recaptchaSiteKey

export default function Page() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const form = useRef(null)
  return (
    <>
      {isRecaptcha && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`}
        />
      )}
      <HeroText markup={'Contact'} />
      <section className="bg-[#F0F0EE] py-[6rem]">
        <div className="gutter">
          <div className="indent flex justify-between flex-col lg:flex-row">
            <div className="mr-10">
              <p className="mb-[1rem]">We&apos;re here to help.</p>
              <p className="mb-[3rem] text-balance max-w-[30rem]">
                Get in touch and a member of our team will contact you as soon
                as possible.
              </p>
              {/* <p className='mb-[3rem]'>We&apos;re here to help.</p> */}
              {/* <p>t: 01300 345 555</p>
              <p>m: 07800 851 267</p>
              <p>
                e: 
                <Link href='mailto:malcolm@townandcountryjoinery.co.uk'>
                  malcolm@townandcountryjoinery.co.uk
                </Link>{' '}
              </p> */}
            </div>
            <div className="lg:w-[50%] lg:pl-[100px]">
              <form
                className="w-[400px] mt-[0rem] lg:mt-[0px]"
                onSubmit={onSubmit}
              >
                <div className="group/name">
                  <TextInput
                    name="name"
                    label="Name"
                    type="text"
                    value={name}
                    pattern="^[a-zA-Z\s]{2,100}$"
                    onChange={(text) => setName(text)}
                  />
                  <div className="hidden -mt-3 text-xs italic text-darkGrey group-has-[:focus]/name:block">
                    2-200 characters
                  </div>
                </div>
                <div className="group/email">
                  <TextInput
                    name="email"
                    label="Email address"
                    type="email"
                    value={email}
                    pattern="^[\w\d._%+-]+@[\w\d.-]+\.[a-zA-Z]{2,}$"
                    onChange={(text) => setEmail(text)}
                  />
                  <div className="hidden -mt-3 text-xs italic text-darkGrey group-has-[:focus]/email:block">
                    Your own email address
                  </div>
                </div>

                <Textarea
                  name="message"
                  label="Message"
                  value={message}
                  onChange={(text) => setMessage(text)}
                />
                <button
                  type="submit"
                  className="bg-darkGrey text-white px-6 py-3 mt-4"
                >
                  Submit
                </button>
                <p>{error}</p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )

  function onSubmit(e) {
    e.preventDefault()
    if (isRecaptcha) {
      const grecaptcha = globalThis.grecaptcha
      grecaptcha.enterprise.ready(async () => {
        try {
          const token = await grecaptcha.enterprise.execute(recaptchaSiteKey, {
            action: 'comment'
          })
          submitForm(token)
        } catch (error) {
          console.error('Error getting reCAPTCHA token:', error)
          setError(
            'An error occurred while verifying that you are not a bot. Please try again.'
          )
        }
      })
    } else {
      submitForm(getRandomToken())
    }
  }

  /**
   * Submit form data to the server.
   */
  async function submitForm(token) {
    try {
      setError('Submitting...')
      // Handle form submission
      const ret = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message, token, isRecaptcha })
      })
      if (!ret.ok) throw new Error('Failed to submit form')
      const data = await ret.json()
      if (data.error) {
        throw new Error(data.error)
      }
      // Thank user for submission
      setError('Thank you for your message! We will get back to you soon.')
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while submitting the form.'
      )
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
    hash.append(contactCracker)
    return digits + '.' + hash.end()
  }
}
