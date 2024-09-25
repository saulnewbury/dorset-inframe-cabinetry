'use client'
import { useEffect, useContext } from 'react'
import { CanvasContext } from '@/app/context'

export default function Page() {
  const ref = useContext(CanvasContext)

  useEffect(() => {
    ref.current?.showCanvas()

    return () => {
      ref.current?.hideCanvas()
    }
  }, [ref])
  return <div>Make it yours</div>
}
