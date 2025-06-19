import { useContext, useState } from 'react'
import { ModelContext } from '@/model/context'
import SelectWall from './SelectWall'

import Button from '@/components/Button'
import DialogInnerContainer from './DialogInnerContainer'

import internalWallImage from '@/lib/images/internal-wall.webp'
import { Chela_One } from 'next/font/google'
import Image from 'next/image'

export default function ChooseAddWall({ onClose }) {
  // console.log(internalWallImage)
  const [, dispatch] = useContext(ModelContext)
  const [wall, setWall] = useState(0)
  return (
    <div className="flex">
      <form onSubmit={addWall} className="[&>p]:my-4  py-8">
        <div className="bg-[#EEEFF1] p-12 w-[20rem]">
          {/* Initial wall */}
          <p className="text-gray-400 mb-12 text-[14px]">Place wall:</p>
          <p className="pb-10">
            <SelectWall value={wall} onChange={setWall} />
          </p>
          {/* Submit button */}
          <p>
            <Button type="submit" primary>
              Submit
            </Button>
          </p>
        </div>
      </form>
      <DialogInnerContainer classes="pt-12 h-[45rem]">
        <Image src={internalWallImage} className="h-full" alt="" />
      </DialogInnerContainer>
    </div>
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
