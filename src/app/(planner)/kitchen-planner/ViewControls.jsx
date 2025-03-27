'use client'

import SvgIcon from '@/components/SvgIcon'

export default function ViewControls({
  changePerspective,
  is3D,
  shrink = false
}) {
  return (
    <div className={`absolute bottom-[40px] w-full flex justify-center`}>
      <div className={`${shrink ? 'mr-[calc(30%-74px)]' : ''}`}>
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
