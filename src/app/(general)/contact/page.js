'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

import HeroText from '@/components/HeroText'
import TextInput from '@/components/TextInput'
import Textarea from '@/components/Textarea'

import Footer from '@/components/Footer'

export default function Page() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const form = useRef(null)
  return (
    <>
      <HeroText markup={'Contact'} />
      <section className='bg-[#F0F0EE] py-[6rem]'>
        <div className='gutter'>
          <div className='indent flex justify-between flex-col lg:flex-row'>
            <div className='mr-10'>
              <p className='mb-[1rem]'>We&apos;re here to help.</p>
              <p className='mb-[3rem] text-balance max-w-[30rem]'>
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
            <div className='lg:w-[50%] lg:pl-[100px]'>
              <form className='w-[400px] mt-[0rem] lg:mt-[0px]'>
                <TextInput
                  name='name'
                  label='Name'
                  type='text'
                  value={name}
                  // disabled={disabled}
                  // onChange={(value) => {
                  //   setName(value)
                  //   form.current['name'].setCustomValidity(
                  //     /^[\w\s\d]*$/.test(name)
                  //       ? ''
                  //       : 'Name can only contain letters, numbers and spaces'
                  //   )
                  // }}
                />
                <TextInput
                  name='email'
                  label='Email address'
                  type='email'
                  value={email}
                  // disabled={disabled}
                  // onChange={(value) => {
                  //   setEmail(value)
                  //   form.current['email'].setCustomValidity(
                  //     /^[\w\d.@]*$/.test(email)
                  //       ? ''
                  //       : 'Address must match the format of an email address'
                  //   )
                  // }}
                />

                <Textarea
                  name='email'
                  label='Message'
                  // type='text'
                  value={message}
                  // disabled={disabled}
                  // onChange={(value) => {
                  //   setEmail(value)
                  //   form.current['email'].setCustomValidity(
                  //     /^[\w\d.@]*$/.test(email)
                  //       ? ''
                  //       : 'Address must match the format of an email address'
                  //   )
                  // }}
                  onChange={(value) => {
                    setMessage(value)
                  }}
                />
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
