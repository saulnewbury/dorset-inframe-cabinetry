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
      <form onSubmit={selectDoor} className='[&>p]:my-4'>
        {/* Width */}
        <p>
          <span className='text-gray-400'>Width (m):</span>{' '}
          <input
            type='number'
            min='0.5'
            step='0.1'
            value={width.toFixed(2)}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className='w-14'
          />
        </p>
        {/* Initial wall */}
        <p className='text-gray-400 pb-12'>Select wall:</p>
        <p className='pb-4'>
          <SelectWall value={wall} onChange={setWall} />
        </p>
        {/* Submit button */}
        <p>
          <Button type='submit' primary>
            Submit
          </Button>
        </p>
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
