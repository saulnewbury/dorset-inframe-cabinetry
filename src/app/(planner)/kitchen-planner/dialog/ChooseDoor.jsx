import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'
import CabinetGrid from '@/app/(planner)/kitchen-planner/dialog/CabinetGrid'
import DialogInnerContainer from './DialogInnerContainer'

import { doorStyles as styles } from '@/model/itemStyles'
import Image from 'next/image'

/**
 * Dialog body component for choosing and adding a door.
 */
export default function ChooseDoor({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [wall, setWall] = useState(0)
  // Keep these states for the dispatch but don't show in UI
  const [opens, setOpens] = useState('out')
  const [handle, setHandle] = useState('left')

  return (
    <div className="[&>p]:my-3 text-[14px] flex gap-32">
      {/* Width */}
      <div className="py-8">
        <div className="bg-[#EEEFF1] p-12 h-[25rem] w-[20rem]">
          <p className="text-gray-400 mb-12">Select wall:</p>
          {/* Wall on which to insert the door */}
          <p>
            <SelectWall value={wall} onChange={setWall} />
          </p>
        </div>
      </div>
      <DialogInnerContainer classes="pt-12 pb-0">
        {/* Door style */}
        <p className="text-gray-400">Choose style:</p>
        <CabinetGrid classes="grid-cols-3">
          {styles.map((s) => (
            <DoorButton
              key={s.id}
              {...s}
              onClick={(styleId) => selectDoor(styleId)}
            />
          ))}
        </CabinetGrid>
      </DialogInnerContainer>
    </div>
  )

  function selectDoor(styleId) {
    const selectedStyle = styles.find((s) => s.id === styleId)
    if (!selectedStyle) return

    // const styleWidth = selectedStyle.width || width

    const styleWidth = selectedStyle.id === 'double-door' ? 1.8 : 1

    dispatch({
      id: 'addOpening',
      type: 'door',
      style: styleId,
      option: [handle, opens].join(':'),
      width: styleWidth,
      wall
    })
    onClose()
  }
}

/**
 * Component to display a door style option and allow it to be selected.
 */
function DoorButton({ id, title, image, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="flex flex-col items-center"
    >
      <div className="w-full aspect-square overflow-hidden mb-[1rem] hover:border-[0.5px] hover:border-blue">
        <Image src={image} alt="" />
      </div>
      <div className="text-center">
        <p>{title || 'Door'}</p>
        <p className="text-sm">Resizeable</p>
      </div>
    </button>
  )
}
