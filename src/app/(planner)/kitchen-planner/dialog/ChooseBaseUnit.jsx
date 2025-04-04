import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import { baseUnitStyles } from '@/model/itemStyles'

import CabinetGrid from '@/app/(planner)/kitchen-planner/dialog/CabinetGrid'
import CabinetGridContainer from '@/app/(planner)/kitchen-planner/dialog/CabinetGridContainer'
import UnitCard from './UnitCard'

export default function ChooseBaseUnit({
  variant = 'With door',
  onClose = () => {}
}) {
  const [, dispatch] = useContext(ModelContext)
  const [filter, setFilter] = useState('All')

  const options = baseUnitStyles[variant]
  const filterText = new Set(options.map((opt) => opt.filterText))
  const filtered =
    filter === 'All'
      ? options
      : options.filter((opt) => opt.filterText === filter)
  const widths = [...new Set(filtered.map((opt) => opt.sizes).flat())].sort(
    (a, b) => a - b
  )

  return (
    <CabinetGridContainer>
      {/* Filter */}
      <p className='flex gap-4'>
        {['All', ...filterText].map((f) => (
          <button
            key={f}
            type='button'
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
    </CabinetGridContainer>
  )

  function selectUnit(style, width) {
    dispatch({
      id: 'addUnit',
      type: 'base',
      variant,
      width,
      style
    })
    onClose()
  }
}
