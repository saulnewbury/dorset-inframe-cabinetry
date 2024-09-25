'use client'

import { useContext, useEffect } from 'react'
import { PerspectiveContext } from '@/app/context.js'

import SvgIcon from '@/components/SvgIcon'

export default function Perspective() {
  const { changeView, view } = useContext(PerspectiveContext)
  useEffect(() => {
    // console.log(changeView)
  })

  return (
    <div className='absolute bottom-[40px] w-full flex justify-center'>
      <div className=''>
        <button
          type='button'
          data-perspective='2d'
          className={`${
            view === '2d' ? 'bg-[#F0F0EE]' : ''
          } hover:bg-[#F0F0EE] h-[50px] w-[50px] rounded-full mr-[12px]`}
          onClick={(e) => {
            changeView(e.currentTarget.dataset.perspective)
          }}
        >
          <SvgIcon classes='w-[22px] h-[22px]' shape='2d' />
        </button>
        <button
          type='button'
          data-perspective='3d'
          className={`${
            view === '3d' ? 'bg-[#F0F0EE]' : ''
          } hover:bg-[#F0F0EE] h-[50px] w-[50px] rounded-full`}
          onClick={(e) => {
            changeView(e.currentTarget.dataset.perspective)
          }}
        >
          <SvgIcon classes='w-[30px] h-[30px]' shape='3d' />
        </button>
      </div>
    </div>
  )
}
