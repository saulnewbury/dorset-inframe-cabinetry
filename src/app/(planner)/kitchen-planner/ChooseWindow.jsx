import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'

import { windowStyles as styles } from '@/model/itemStyles'

/**
 * Dialog body component to allow user to choose and add a window to the model.
 */
export default function ChooseWindow({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [style, setStyle] = useState()
  const [height, setHeight] = useState('normal')
  const [width, setWidth] = useState(0.5)
  const [wall, setWall] = useState(0)
  return (
    <form onSubmit={selectWindow} className='[&>p]:my-3 text-[14px]'>
      {/* Window style */}
      <p className='text-gray-400'>Choose style:</p>
      <div className='flex flex-wrap gap-5'>
        {styles.map((s) => (
          <WindowButton
            key={s.id}
            {...s}
            selected={style === s.id}
            onClick={chooseStyle}
          />
        ))}
      </div>
      {/* Height (full or normal) */}
      <p>
        <span className='text-gray-400'>Height:</span>{' '}
        <select value={height} onChange={(e) => setHeight(e.target.value)}>
          <option value='normal'>Normal</option>
          <option value='full'>Full</option>
        </select>
      </p>
      {/* Width */}
      <p>
        <span className='text-gray-400'>Width (m):</span>{' '}
        <input
          type='number'
          min='0.3'
          step='0.1'
          value={width.toFixed(2)}
          onChange={(e) => setWidth(parseFloat(e.target.value))}
          className='w-14'
        />
      </p>
      <p className='text-gray-400'>Select wall:</p>
      {/* Wall on which to insert the window */}
      <p>
        <SelectWall value={wall} onChange={setWall} />
      </p>
      {/* Submit button */}
      <p>
        <button
          type='submit'
          disabled={!style}
          className='bg-blue-700 text-white rounded-md px-2 py-1 disabled:bg-red-400'
        >
          Submit
        </button>
      </p>
    </form>
  )

  function chooseStyle(s) {
    console.log(s)
    const w = styles.find((t) => t.id === style)?.width ?? 0.5
    const dw = styles.find((t) => t.id === s)?.width
    if (width === w) setWidth(dw)
    setStyle(s)
  }

  function selectWindow(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addOpening',
      type: 'window',
      style,
      option: height,
      width,
      wall
    })
    onClose()
  }
}

/**
 * Component to display a window style option and allow it to be selected.
 */
function WindowButton({ id, title, image, selected, onClick = () => {} }) {
  return (
    <button
      type='button'
      onClick={() => onClick(id)}
      className='flex flex-col gap-[0.3rem]'
    >
      <img
        src={image.src}
        alt=''
        className={clsx(
          'h-[200px] hover:border-cyan-500 rounded-sm bg-[#aaaaaa] object-cover',
          selected ? 'border-blue-700' : 'border-transparent'
        )}
      />
      <span>{title}</span>
    </button>
  )
}
