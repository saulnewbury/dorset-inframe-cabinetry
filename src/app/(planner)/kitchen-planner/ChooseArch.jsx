import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'

import SelectWall from './SelectWall'

import Button from '@/components/Button'

export default function ChooseArch({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [width, setWidth] = useState(0.7)
  const [wall, setWall] = useState(0)
  return (
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
      <p className='text-gray-400'>Select wall:</p>
      <p>
        <SelectWall value={wall} onChange={setWall} />
      </p>
      {/* Submit button */}
      <p>
        <Button>Submit</Button>
      </p>
    </form>
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
