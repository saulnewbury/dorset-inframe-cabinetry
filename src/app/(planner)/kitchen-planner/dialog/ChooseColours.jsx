import { useContext, useState } from 'react'
import clsx from 'clsx'
import { HexColorPicker } from 'react-colorful'

import { ModelContext } from '@/model/context'

import wtTexture from '@/assets/textures/iStock-1126970577.jpg'

const worktops = [{ id: 'blue-marble', title: 'Blue marble', image: wtTexture }]

export default function ChooseColours({ onClose = () => {} }) {
  const [model, dispatch] = useContext(ModelContext)
  const [worktop, setWorktop] = useState(model.worktop)
  const [colour, setColour] = useState(model.colour)

  return (
    <form onSubmit={selectScheme} className="[&>p]:my-4">
      {/* Worktop style */}
      <p className="text-gray-400">Choose worktop:</p>
      <div className="flex flex-wrap gap-5">
        {worktops.map((w) => (
          <WorktopButton key={w.id} {...w} onClick={setWorktop} />
        ))}
      </div>
      {/* Unit colour */}
      <p className="text-gray-400">Choose unit colour:</p>
      <div>
        <HexColorPicker color={colour} onChange={setColour} />
      </div>
      {/* Submit button */}
      <p>
        <button
          type="submit"
          disabled={!worktop}
          className="bg-blue-700 text-white rounded-md px-2 py-1 disabled:bg-gray-400"
        >
          Submit
        </button>
      </p>
    </form>
  )

  function selectScheme(ev) {
    ev.preventDefault()
    dispatch({ id: 'setScheme', worktop, colour })
    onClose()
  }
}

function WorktopButton({ id, title, image, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="flex flex-col gap-4 items-center"
    >
      <img
        src={image.src}
        alt=""
        className={clsx(
          'h-[200px] p-2 pb-0 border-2 hover:border-cyan-500 rounded-sm bg-stone-100',
          selected ? 'border-blue-700' : 'border-transparent'
        )}
      />
      <span>{title}</span>
    </button>
  )
}
