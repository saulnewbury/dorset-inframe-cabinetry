'use client'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/context'
import { useAppState } from '@/appState'

import Estimate from '@/components/Estimate'
import SvgIcon from '@/components/SvgIcon'

export default function Page() {
  const ref = useContext(CanvasContext)
  const { snapshots, removeSnapshot } = useAppState()

  useEffect(() => {
    ref.current?.showCanvas()
    ref.current?.shrinkCanvas()

    return () => {
      ref.current?.hideCanvas()
      ref.current?.restoreCanvas()
    }
  }, [ref])

  return (
    <div className="min-h-[100vh] pt-[95px] pr-[20px] w-full flex flex-col items-end justify-start gap-y-4">
      <Estimate isFloating={false} />
      {snapshots.length > 0 && (
        <p className="w-[240px] max-w-[25vw]">Snapshots:</p>
      )}
      {snapshots.map((snapshot, id) => (
        <div
          key={id}
          className="w-[240px] max-w-[25vw] mb-4 bg-white p-4 border border-lightGrey relative"
        >
          <img
            src={snapshot}
            alt={`Snapshot ${id + 1}`}
            className="w-full h-auto mb-2 object-cover"
          />
          <button
            className="absolute top-2 right-2 focus:outline-none"
            onClick={() => removeSnapshot(snapshot)}
          >
            <SvgIcon
              shape="trash"
              classes="w-auto h-4 text-black hover:text-red "
            />
          </button>
        </div>
      ))}
    </div>
  )
}
