import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import Button from '@/components/Button'

import { baseUnitStyles as styles } from '@/model/itemStyles'

const widths = Object.keys(styles)

export default function ChooseBaseUnit({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [width, setWidth] = useState(300)
  const [style, setStyle] = useState('')
  return (
    <form onSubmit={selectUnit} className='[&>p]:my-4'>
      {/* Width */}
      <p>
        <span className='text-gray-400'>Width (mm):</span>{' '}
        <select
          value={width}
          onChange={(ev) => {
            setWidth(ev.target.value)
            setStyle('')
          }}
        >
          {widths.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </p>
      {/* Styles */}
      <p className='flex wrap gap-5'>
        {(styles[width] ?? []).map((unit) => (
          <BaseUnitButton
            key={unit.id}
            {...unit}
            isActive={style === unit.id}
            onClick={setStyle}
          />
        ))}
      </p>
      {/* Submit button */}
      <p>
        <Button primary disabled={!style}>
          Add
        </Button>
      </p>
    </form>
  )

  function selectUnit(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addUnit',
      type: 'base',
      width,
      style
    })
    onClose()
  }
}

function BaseUnitButton({ id, title, image, isActive, onClick }) {
  return (
    <button
      type='button'
      onClick={() => onClick(id)}
      className={clsx(
        'w-32 flex flex-col items-center p-3 border-2 rounded-sm',
        isActive ? 'border-cyan-600' : 'border-transparent'
      )}
    >
      <img src={image.src} alt='' className='h-32' />
      <span>{title}</span>
    </button>
  )
}
