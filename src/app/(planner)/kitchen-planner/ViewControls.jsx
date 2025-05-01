'use client'

import SvgIcon from '@/components/SvgIcon'

export default function ViewControls({
  changePerspective,
  is3D,
  shrink = false
}) {
  return (
    <div
      className={`absolute left-[50%] -translate-x-[50%] bottom-[40px] flex justify-center bg-red-500 ${
        shrink ? 'left-[calc(30%+74px+37px)]' : ''
      }`}
    >
      <div className='flex items-center justify-center rounded-full bg-lightBlue h-[50px] px-1'>
        <button
          type='button'
          className={`${
            !is3D ? 'bg-[#ffffff] shadow-md' : ''
          }  h-[40px] w-[40px] rounded-full mr-[8px] flex items-center justify-center `}
          onClick={() => {
            changePerspective(false)
          }}
        >
          <SvgIcon classes='w-[16px] h-[16px]' shape='2d' />
        </button>
        <button
          type='button'
          className={`${
            is3D ? 'bg-[#ffffff] shadow-md' : ''
          }  h-[40px] w-[40px] rounded-full flex items-center justify-center`}
          onClick={() => {
            changePerspective(true)
          }}
        >
          <SvgIcon classes='w-[24px] h-[24px]' shape='3d' />
        </button>
      </div>
    </div>
  )
}
