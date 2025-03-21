import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'

import Button from '@/components/Button'

import { doorStyles as styles } from '@/model/itemStyles'

/**
 * Dialog body component for choosing an adding a door.
 */
export default function ChooseDoor({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [style, setStyle] = useState()
  const [opens, setOpens] = useState('out')
  const [handle, setHandle] = useState('left')
  const [width, setWidth] = useState(1)
  const [wall, setWall] = useState(0)
  return (
    <form onSubmit={selectDoor} className='[&>p]:my-4'>
      {/* Types of door */}
      <p className='text-gray-400'>Choose style:</p>
      <div className='flex flex-wrap gap-5'>
        {styles.map((s) => (
          <DoorButton
            key={s.id}
            {...s}
            opens={opens}
            selected={style === s.id}
            onClick={setStyle}
          />
        ))}
      </div>
      <div className='flex mt-[2rem] mb-[2rem]'>
        {/* left */}
        <div className='inline-block mr-[2rem]'>
          {/* Initial wall */}
          <p className='text-gray-400 mb-[1rem]'>Select wall:</p>
          <p>
            <SelectWall value={wall} onChange={setWall} />
          </p>
        </div>
        {/* Right */}
        <div className='inline-block'>
          {/* Side of handle */}
          <p className='mb-[1rem] mt-[4rem]'>
            <span className='text-gray-400'>Handle:</span>{' '}
            <select value={handle} onChange={(e) => setHandle(e.target.value)}>
              <option value='left'>Left</option>
              <option value='right'>Right</option>
            </select>
          </p>
          {/* Direction of opening */}
          <p className='mb-[1rem]'>
            <span className='text-gray-400'>Opening:</span>{' '}
            <select value={opens} onChange={(e) => setOpens(e.target.value)}>
              <option value='out'>Out</option>
              <option value='in'>In</option>
            </select>
          </p>
          {/* Width */}
          <p className='mb-[1rem]'>
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
        </div>
      </div>
      {/* Submit button */}
      <Button primary disabled={!style}>
        Submit
      </Button>
    </form>
  )

  function selectDoor(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addOpening',
      type: 'door',
      style,
      option: [handle, opens].join(':'),
      width,
      wall
    })
    onClose()
  }
}

/**
 * Component to display a door style option.
 */
function DoorButton({ id, title, image, opens, selected, onClick = () => {} }) {
  return (
    <button
      type='button'
      onClick={() => onClick(id)}
      className='flex flex-col gap-[0.3rem]  border border-lightGrey '
    >
      <img
        src={image.src}
        alt=''
        className={clsx(
          'h-[200px] hover:border-cyan-500 rounded-sm hover:bg-[#f5f5f5] bg-[#ffffff]',
          selected ? 'border-blue-700 bg-[#f5f5f5]' : 'border-transparent'
        )}
      />
    </button>
  )
}
