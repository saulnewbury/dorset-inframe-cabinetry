import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import clsx from 'clsx'

import SelectWall from './SelectWall'

import Button from '@/components/Button'
import CabinetGrid from '@/app/(planner)/kitchen-planner/dialog/CabinetGrid'
import DialogInnerContainer from './DialogInnerContainer'

import { windowStyles as styles } from '@/model/itemStyles'
import Image from 'next/image'

/**
 * Dialog body component to allow user to choose and add a window to the model.
 */
export default function ChooseWindow({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [height, setHeight] = useState('normal')
  const [wall, setWall] = useState(0)

  return (
    <div className="[&>p]:my-3 text-[14px] flex gap-32">
      {/* Width */}
      <div className="py-8">
        <div className="bg-[#EEEFF1] p-12 h-[25rem] w-[20rem]">
          <p className="text-gray-400 mb-12">Select wall:</p>
          {/* Wall on which to insert the window */}
          <p>
            <SelectWall value={wall} onChange={setWall} />
          </p>
        </div>
      </div>
      <DialogInnerContainer classes="pt-12">
        {/* Window style */}
        <p className="text-gray-400">Choose style:</p>
        <CabinetGrid classes="grid-cols-3">
          {styles.map((s) => (
            <WindowButton
              key={s.id}
              {...s}
              wall={wall}
              height={height}
              dispatch={dispatch}
              onClose={onClose}
              onClick={selectWindow}
            />
          ))}
        </CabinetGrid>
      </DialogInnerContainer>
    </div>
  )

  function selectWindow(styleId) {
    const selectedStyle = styles.find((s) => s.id === styleId)
    if (!selectedStyle) return

    // const styleWidth = selectedStyle.width || 0.8

    const styleWidth = selectedStyle.id === 'double' ? 1.2 : 0.8

    dispatch({
      id: 'addOpening',
      type: 'window',
      style: styleId,
      option: height,
      width: styleWidth,
      wall
    })
    onClose()
  }
}

/**
 * Component to display a window style option and allow it to be selected.
 */
function WindowButton({ id, title, image, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="flex flex-col items-center"
    >
      <div className="w-full aspect-square overflow-hidden mb-[1rem] hover:border-[0.5px]  hover:border-blue">
        <Image src={image} alt="" />
      </div>
      <div className="text-center">
        <p>{title}</p>
      </div>
    </button>
  )
}
