import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'

import SelectWall from './SelectWall'

import Button from '@/components/Button'
import DialogInnerContainer from './DialogInnerContainer'

import internalWallOpening from '@/lib/images/internal-wall-opening.webp'

export default function ChooseArch({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [width, setWidth] = useState(0.7)
  const [wall, setWall] = useState(0)
  return (
    <div className='flex'>
      <form onSubmit={selectDoor} className='[&>p]:my-4 py-8'>
        <div className='bg-[#EEEFF1] p-12 w-[20rem]'>
          {/* Width */}
          <p className='text-gray-400 text-[14px] pb-4'>
            <span>Width (m):</span>
            &nbsp; &nbsp;
            <input
              type='number'
              min='0.5'
              step='0.1'
              value={width.toFixed(2)}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className='w-14 bg-transparent border-bottom border-b-[0.5px] border-blue'
            />
          </p>
          {/* Initial wall */}
          <p className='text-gray-400 mb-12  text-[14px]'>Select wall:</p>
          <p className='pb-12'>
            <SelectWall value={wall} onChange={setWall} />
          </p>
          {/* Submit button */}
          <p>
            <Button type='submit' primary>
              Submit
            </Button>
          </p>
        </div>
      </form>
      <DialogInnerContainer classes='pb-12 h-[45rem]'>
        <img src={internalWallOpening.src} className='h-full' alt='' />
      </DialogInnerContainer>
    </div>
  )

  function selectDoor(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addOpening',
      type: 'arch',
      width,
      wall
    })
    onClose()
  }
}
