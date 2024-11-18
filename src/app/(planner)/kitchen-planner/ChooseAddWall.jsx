import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import SelectWall from './SelectWall'

export default function ChooseAddWall({ onClose }) {
  const [, dispatch] = useContext(ModelContext)
  const [wall, setWall] = useState(0)
  return (
    <form onSubmit={addWall} className="[&>p]:my-4">
      {/* Initial wall */}
      <p className="text-gray-400">Select wall:</p>
      <p>
        <SelectWall value={wall} onChange={setWall} />
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

  function addWall(ev) {
    ev.preventDefault()
    dispatch({
      id: 'addSegment',
      wall
    })
    onClose()
  }
}
