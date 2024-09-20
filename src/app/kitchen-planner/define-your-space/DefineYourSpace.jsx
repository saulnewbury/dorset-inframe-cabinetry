'use client'
import { useState, Fragment, useEffect } from 'react'
import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'

const enclosedShapes = ['square', 'slice', 'notch']
const openPlanShapes = ['square-divide', 'corner-divide', 'notch-divide']

export default function DefineYourSpace() {
  const [selected, setSelected] = useState(undefined)
  const [showContinueButton, setShowContinueButton] = useState(false)

  useEffect(() => {
    if (selected === undefined) return
    setShowContinueButton(true)
  }, [selected])

  return (
    <div className='flex justify-center items-center h-full w-full absolute left-0 top-0'>
      <div className='w-[376px]'>
        <div className='flex-col mb-[2rem]'>
          <div className='mb-[1rem]'>Enclosed</div>
          <div className='flex justify-between'>
            {enclosedShapes.map((shape, i) => {
              return (
                <Fragment key={i}>
                  <div
                    className='w-[max-content] h-[max-content] relative'
                    onClick={() => setSelected(shape)}
                  >
                    <SvgIcon
                      shape={shape}
                      classes={`${
                        shape === selected ? 'fill-lightBlue' : ''
                      } hover:fill-lightBlue `}
                    />
                    {shape === selected && (
                      <SvgIcon
                        shape='tick'
                        classes='fill-blue stroke-[transparent] absolute left-[50%] bottom-0 -translate-x-[50%] translate-y-[50%]'
                      />
                    )}
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>
        <div className='flex-col'>
          <div className='mb-[1rem]'>Open plan</div>
          <div className='flex justify-between'>
            {openPlanShapes.map((shape, i) => {
              return (
                <Fragment key={i}>
                  <div
                    className='w-[max-content] h-[max-content] relative'
                    onClick={() => {
                      setSelected(shape)
                    }}
                  >
                    <SvgIcon
                      shape={shape}
                      classes={`${
                        shape === selected ? 'fill-lightBlue' : ''
                      } hover:fill-lightBlue `}
                    />
                    {shape === selected && (
                      <SvgIcon
                        shape='tick'
                        classes='fill-blue stroke-[transparent] absolute left-[50%] bottom-0 -translate-x-[50%] translate-y-[50%]'
                      />
                    )}
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>
        {showContinueButton && (
          <Button
            classes='absolute bottom-[5rem] left-[50%] -translate-x-[50%]'
            primary={true}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
