import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'
import CabinetGrid from '@/app/(planner)/kitchen-planner/dialog/CabinetGrid'
import DialogInnerContainer from './DialogInnerContainer'

import { doorStyles as styles } from '@/model/itemStyles'

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
    <div className='[&>p]:my-3 text-[14px] flex gap-10'>
      {/* Width */}
      <div className='flex py-8 mb-6'>
        <div className='mr-8 gap-5'>
          <p className='text-gray-400 mb-[5.3rem]'>Select wall:</p>
          {/* Wall on which to insert the door */}
          <p>
            <SelectWall value={wall} onChange={setWall} />
          </p>
        </div>
      </div>

      <DialogInnerContainer classes='pb-12'>
        {/* Door style */}
        <p className='text-gray-400'>Choose style:</p>
        <CabinetGrid classes='grid-cols-3'>
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
      type='button'
      onClick={() => onClick(id)}
      className='flex flex-col items-center'
    >
      <div className='w-full aspect-square overflow-hidden mb-[1rem] hover:border-[0.5px] hover:border-blue'>
        <img src={image.src} alt='' />
      </div>
      <div className='text-center'>
        <p>{title || 'Door'}</p>
        <p className='text-sm'>Resizeable</p>
      </div>
    </button>
  )
}
