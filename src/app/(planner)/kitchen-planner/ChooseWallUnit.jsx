import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'

import one_door from '@/assets/units/wall/1-door.jpg'
import two_door from '@/assets/units/wall/2-door.jpg'

const widths = [300, 350, 400, 450, 500, 550, 600, 560, 700, 750, 800]

export default function ChooseWallUnit({ onClose = () => {} }) {
  const [, dispatch] = useContext(ModelContext)
  const [width, setWidth] = useState(300)
  return (
    <form onSubmit={selectUnit} className="[&>p]:my-4">
      {/* Width */}
      <p>
        <span className="text-gray-400">Width (mm):</span>{' '}
        <select
          value={width}
          onChange={(ev) => {
            setWidth(ev.target.value)
          }}
        >
          {widths.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </p>
      {/* Preview */}
      <p>
        <img
          src={width < 600 ? one_door.src : two_door.src}
          alt=""
          className="h-32"
        />
      </p>
      {/* Submit button */}
      <p>
        <button
          type="submit"
          className="bg-blue-700 text-white rounded-md px-2 py-1 disabled:bg-gray-400"
        >
          Submit
        </button>
      </p>
    </form>
  )

  function selectUnit(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addUnit',
      type: 'wall',
      width
    })
    onClose()
  }
}
