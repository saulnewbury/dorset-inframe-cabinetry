import { useContext, useLayoutEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import Button from '@/components/Button'

import { tallUnitStyles } from '@/model/itemStyles'
import { useMemo } from 'react'

export default function ChooseTallUnit({
  variant = 'With door',
  onClose = () => {}
}) {
  const [, dispatch] = useContext(ModelContext)
  const [width, setWidth] = useState(300)
  const [style, setStyle] = useState('')
  const options = tallUnitStyles[variant]
  const widths = useMemo(
    () => [...new Set(options.map((o) => o.sizes).flat())],
    [options]
  )
  useLayoutEffect(() => {
    setWidth(widths[0])
  }, [widths])
  return (
    <form onSubmit={selectUnit} className="[&>p]:my-4">
      {/* Width */}
      <p className="flex gap-4">
        <span className="text-gray-400">Width (mm):</span>
        <select
          value={width}
          onChange={(ev) => {
            setWidth(parseInt(ev.target.value))
            setStyle('')
          }}
        >
          {widths.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </p>
      {/* Styles */}
      <div>
        {options.map(
          (unit) =>
            unit.sizes.includes(width) && (
              <TallUnitCard
                key={unit.id}
                {...unit}
                price={unit.prices[unit.sizes.indexOf(width)]}
                isActive={style === unit.id}
                onClick={setStyle}
              />
            )
        )}
      </div>
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
      type: 'tall',
      variant,
      width,
      style
    })
    onClose()
  }
}

function TallUnitCard({ id, title, price, images, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={clsx(
        'w-full flex gap-3 items-center p-3 border-2 rounded-md',
        isActive ? 'border-cyan-600' : 'border-transparent'
      )}
    >
      <img src={images[0].src} alt="" className="h-20" />
      <div className="text-left">
        <p>{title}</p>
        <p>Price: £{price}</p>
      </div>
    </button>
  )
}
