import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

// Project components
import DialogInnerContainer from '@/app/(planner)/kitchen-planner/dialog/DialogInnerContainer'
import CabinetGrid from '@/app/(planner)/kitchen-planner/dialog/CabinetGrid'
import UnitCard from './UnitCard'

import { tallUnitStyles } from '@/model/itemStyles'

export default function ChooseTallUnit({
  variant = 'With door',
  onClose = () => {}
}) {
  const [, dispatch] = useContext(ModelContext)
  const [filter, setFilter] = useState('All')

  const options = tallUnitStyles[variant]
  const filterText = new Set(options.map((opt) => opt.filterText))
  const filtered =
    filter === 'All'
      ? options
      : options.filter((opt) => opt.filterText === filter)
  const widths = [...new Set(filtered.map((opt) => opt.sizes).flat())].sort(
    (a, b) => a - b
  )

  return (
    <DialogInnerContainer>
      {/* Filter */}
      <p className="flex gap-4">
        {['All', ...filterText].map((f) => (
          <button
            key={f}
            type="button"
            className={clsx(f === filter && 'border-black border-b-2')}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </p>
      {/* Styles */}
      <CabinetGrid>
        {widths.map((w) =>
          filtered
            .filter((opt) => opt.sizes.includes(w))
            .map((unit) => (
              <UnitCard
                key={`${unit.id}-${w}`}
                {...unit}
                width={w}
                onClick={() => selectUnit(unit.id, w)}
              />
            ))
        )}
      </CabinetGrid>
    </DialogInnerContainer>
  )

  function selectUnit(style, width) {
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

function TallUnitCard({ id, title, width, onClick }) {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
