import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import { wallUnitStyles } from '@/model/itemStyles'

export default function ChooseWallUnit({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [filter, setFilter] = useState('All')

  const options = wallUnitStyles
  const filterText = new Set(options.map((opt) => opt.filterText))
  const filtered =
    filter === 'All'
      ? options
      : options.filter((opt) => opt.filterText === filter)
  const widths = [...new Set(filtered.map((opt) => opt.sizes).flat())].sort(
    (a, b) => a - b
  )

  return (
    <div className="[&>p]:my-4">
      {/* Filter */}
      <p className="flex gap-4">
        {['All', ...filterText].map((f) => (
          <button
            type="button"
            className={clsx(f === filter && 'border-black border-b-2')}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </p>
      {/* Styles */}
      <div className="flex flex-wrap gap-4">
        {widths.map((w) =>
          filtered
            .filter((opt) => opt.sizes.includes(w))
            .map((unit) => (
              <WallUnitCard
                key={`${unit.id}-${w}`}
                {...unit}
                width={w}
                onClick={() => selectUnit(unit.id, w)}
              />
            ))
        )}
      </div>
    </div>
  )

  function selectUnit(style, width) {
    dispatch({
      id: 'addUnit',
      type: 'wall',
      style,
      width
    })
    onClose()
  }
}

function WallUnitCard({ id, title, width, onClick }) {
  const [isHover, setHover] = useState(false)
  const style = id.replace(':', '-')
  const images = [
    `/units/${style}/${style}-${width}-front.webp`,
    `/units/${style}/${style}-${width}-side.webp`
  ]
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="w-[180px] flex flex-col gap-3 items-center p-3 border-2 rounded-md hover:border-cyan-600 border-transparent"
    >
      <div
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <img
          src={isHover ? images[1] : images[0]}
          alt=""
          className="h-[180px]"
        />
      </div>
      <div className="text-center">
        <p>{title}</p>
        <p className="text-sm">w: {width}mm</p>
      </div>
    </button>
  )
}
