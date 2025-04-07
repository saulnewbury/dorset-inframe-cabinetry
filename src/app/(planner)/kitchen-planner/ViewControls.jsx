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
      <div>
        <button
          type='button'
          className={`${
            !is3D ? 'bg-[#F0F0EE]' : ''
          } hover:bg-[#F0F0EE] h-[50px] w-[50px] rounded-full mr-[12px]`}
          onClick={() => {
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
          onClick={() => {
            changePerspective(true)
          }}
        >
          <SvgIcon classes='w-[30px] h-[30px]' shape='3d' />
        </button>
      </div>
    </div>
  )
}
