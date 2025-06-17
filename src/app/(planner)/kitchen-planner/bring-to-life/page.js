'use client'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/context'
import Estimate from '@/components/Estimate'
export default function Page() {
  const ref = useContext(CanvasContext)

  useEffect(() => {
    ref.current?.showCanvas()
    ref.current?.shrinkCanvas()

    return () => {
      ref.current?.hideCanvas()
      ref.current?.restoreCanvas()
    }
  }, [ref])
  return (
    <div className="h-[100vh] w-full">
      <Estimate isFloating={false} />
    </div>
  )
}
