'use client'

import { useContext } from 'react'
import { PerspectiveContext } from '@/app/context.js'

import SvgIcon from '@/components/SvgIcon'

export default function ViewControls({ changePerspective, is3D }) {
  return (
    <div className='absolute bottom-[40px] w-full flex justify-center'>
      <div className=''>
        <button
          type='button'
          className={`${
            !is3D ? 'bg-[#F0F0EE]' : ''
          } hover:bg-[#F0F0EE] h-[50px] w-[50px] rounded-full mr-[12px]`}
          onClick={(e) => {
            changePerspective(false)
          }}
        >
          <SvgIcon classes='w-[22px] h-[22px]' shape='2d' />
        </button>
        <button
          type='button'
          className={`${
            is3D ? 'bg-[#F0F0EE]' : ''
          } hover:bg-[#F0F0EE] h-[50px] w-[50px] rounded-full`}
          onClick={(e) => {
            changePerspective(true)
          }}
        >
          <SvgIcon classes='w-[30px] h-[30px]' shape='3d' />
        </button>
      </div>
    </div>
  )
}
