import { useContext, useState, useEffect, Fragment } from 'react'
import { ModelContext } from '@/model/context'

import fp_square from '@/assets/icons/square-fplan.svg'
import fp_slice from '@/assets/icons/slice-fplan.svg'
import fp_notch from '@/assets/icons/notch-fplan.svg'

import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'

const enclosedShapes = [
  { id: 'square', title: 'Square', plan: fp_square },
  { id: 'slice', title: 'Slice', plan: fp_slice },
  { id: 'notch', title: 'Notch', plan: fp_notch }
]

export default function ChooseFloorPlan({ onClose = () => {} }) {
  const [selected, setSelected] = useState(undefined)
  const [showContinueButton, setShowContinueButton] = useState(false)

  const [, dispatch] = useContext(ModelContext)

  useEffect(() => {
    if (selected === undefined) return
    setShowContinueButton(true)
  }, [selected])

  return (
    <div className='flex justify-center items-center h-full w-full absolute left-0 top-0'>
      <div className='flex-col mb-[2rem]'>
        <div className='mb-[1rem]'>Enclosed</div>
        <div className='flex justify-between gap-10'>
          {enclosedShapes.map((shape, i) => {
            return (
              <div
                key={i}
                className='w-[max-content] h-[max-content] relative'
                onClick={() => setSelected(shape.id)}
              >
                <SvgIcon
                  shape={shape.id}
                  classes={`${
                    shape.id === selected ? 'fill-lightBlue' : ''
                  } hover:fill-lightBlue w-[130px] h-[130px] xl:w-[10vw] xl:h-[10vw]`}
                />
                {/* {shape.id === selected && (
                  <SvgIcon
                    shape='tick'
                    classes='fill-blue stroke-[transparent] absolute left-[50%] bottom-0 -translate-x-[50%] translate-y-[50%]'
                  />
                )} */}
              </div>
            )
          })}
        </div>
      </div>
      {showContinueButton && (
        <div onClick={() => select(selected)}>
          <Button
            classes='absolute bottom-[5rem] left-[50%] -translate-x-[50%]'
            primary={true}
          >
            Continue
            {/* <div onClick={() => select(selected)}>Continue</div> */}
          </Button>
        </div>
      )}
    </div>
  )

  function select(shape) {
    console.log(shape)
    dispatch({ id: 'loadModel', shape })
    onClose()
  }
}
