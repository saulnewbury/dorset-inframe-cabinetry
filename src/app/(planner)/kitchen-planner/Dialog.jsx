import { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import SvgIcon from '@/components/SvgIcon.jsx'
import Items from './Items'

const Dialog = forwardRef(({ closeContentBox, content, Body }, ref) => {
  return (
    <div className='fixed z-[100] flex h-[100vh] w-[100vw] top-0 left-0 bg-overlay px-[98px] py-[40px]'>
      {/* <div className='bg-white w-full h-full relative'> */}
      <div className='bg-white w-full h-full relative'>
        <button
          onClick={closeContentBox}
          className='cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[2rem] z-[900]'
          type='button'
        >
          <SvgIcon shape='close' />
        </button>
        <div className='gutter h-full relative overflow-scroll '>
          <h2 className='py-[2rem] text-[18px]'>{content.heading}</h2>

          <Body onClose={closeContentBox} />
          {/* {content.name === 'Electricity' && <Items items={content.items} />} */}
        </div>
      </div>
    </div>
  )
})

Dialog.displayName = 'Dialog'

export default Dialog
