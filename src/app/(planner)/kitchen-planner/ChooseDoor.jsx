import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'

import { doorStyles as styles } from '@/model/itemStyles'

/**
 * Dialog body component for choosing an adding a door.
 */
export default function ChooseDoor({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [style, setStyle] = useState()
  const [opens, setOpens] = useState('out')
  const [handle, setHandle] = useState('left')
  const [width, setWidth] = useState(0.7)
  const [wall, setWall] = useState(0)
  return (
    <form onSubmit={selectDoor} className="[&>p]:my-4">
      {/* Types of door */}
      <p className="text-gray-400">Choose style:</p>
      <div className="flex flex-wrap gap-5">
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
      {/* Side of handle */}
      <p>
        <span className="text-gray-400">Handle:</span>{' '}
        <select value={handle} onChange={(e) => setHandle(e.target.value)}>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </p>
      {/* Direction of opening */}
      <p>
        <span className="text-gray-400">Opening:</span>{' '}
        <select value={opens} onChange={(e) => setOpens(e.target.value)}>
          <option value="out">Out</option>
          <option value="in">In</option>
        </select>
      </p>
      {/* Width */}
      <p>
        <span className="text-gray-400">Width (m):</span>{' '}
        <input
          type="number"
          min="0.5"
          step="0.1"
          value={width.toFixed(2)}
          onChange={(e) => setWidth(parseFloat(e.target.value))}
          className="w-14"
        />
      </p>
      {/* Initial wall */}
      <p className="text-gray-400">Select wall:</p>
      <p>
        <SelectWall value={wall} onChange={setWall} />
      </p>
      {/* Submit button */}
      <p>
        <button
          type="submit"
          disabled={!style}
          className="bg-blue-700 text-white rounded-md px-2 py-1 disabled:bg-gray-400"
        >
          Submit
        </button>
      </p>
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
      type="button"
      onClick={() => onClick(id)}
      className="flex flex-col gap-4"
    >
      <img
        src={image.src}
        alt=""
        className={clsx(
          'h-[200px] p-2 pb-0 border-2 hover:border-cyan-500 rounded-sm bg-stone-100',
          selected ? 'border-blue-700' : 'border-transparent',
          opens == 'right' && '-scale-x-100'
        )}
      />
      <span>{title}</span>
    </button>
  )
}
