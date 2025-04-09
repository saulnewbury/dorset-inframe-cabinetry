import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import SelectWall from './SelectWall'

import Button from '@/components/Button'
import DialogInnerContainer from './DialogInnerContainer'

import internalWallImage from '@/lib/images/internal-wall.webp'
import { Chela_One } from 'next/font/google'

export default function ChooseAddWall({ onClose }) {
  console.log(internalWallImage)
  const [, dispatch] = useContext(ModelContext)
  const [wall, setWall] = useState(0)
  return (
    <div className='flex'>
      <form onSubmit={addWall} className='[&>p]:my-4'>
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
        <img src={internalWallImage.src} className='h-full' alt='' />
      </DialogInnerContainer>
    </div>
  )

  function addWall(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addSegment',
      wall
    })
    onClose()
  }
}
