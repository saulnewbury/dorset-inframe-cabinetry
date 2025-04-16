'use client'

import { useEffect, forwardRef, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import SvgIcon from '@/components/SvgIcon.jsx'
// import Items from './Items'

const Dialog = forwardRef(
  ({ closeContentBox, content, variant, Body, width }, ref) => {
    console.log(width)
    const container = useRef()
    useGSAP(() => {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, delay: 0.15 }
      )
    })
    return (
      <div
        ref={container}
        className='fixed z-[100] flex h-[100vh] w-[100vw] top-0 left-0 bg-overlay px-[98px] py-[40px] opacity-0'
      >
        {/* <div className='bg-white w-full h-full relative'> */}
        <div style={{ width: width }} className='bg-white h-full relative'>
          <button
            onClick={closeContentBox}
            className='cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[2rem] z-[900]'
            type='button'
          >
            <SvgIcon shape='close' />
          </button>
          <div
            className={`gutter-left h-full relative overflow-scroll gutter-right`}
          >
            <h2 className='py-[2rem] text-[18px]'>
              {content.heading}
              {variant && <span> / {variant}</span>}
            </h2>

            {/*
             ** Body is a component from sidebar.js (data).
             ** It is set as state at page.js level via child (SideBar.jsx)
             ** callback function handleContent.
             */}
            <Body variant={variant} onClose={closeContentBox} />

            {/* {content.name === 'Electricity' && <Items items={content.items} />} */}
            {/* {!content.items ? (
            <Body onClose={closeContentBox} />
          ) : (
            <Items items={content.items} />
          )} */}
          </div>
        </div>
      </div>
    )
  }
)

Dialog.displayName = 'Dialog'

export default Dialog
