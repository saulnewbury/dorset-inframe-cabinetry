'use client'
import { useState, useImperativeHandle, forwardRef, useContext } from 'react'

import { PerspectiveContext } from '@/app/context.js'

import P2D from './P2D'
import P3D from './P3D'

export default forwardRef(function KitchenPlanner(props, ref) {
  const [show, setShow] = useState(false)
  const { view } = useContext(PerspectiveContext)

  useImperativeHandle(
    ref,
    () => {
      return {
        showCanvas: () => {
          setShow(true)
        },
        hideCanvas: () => {
          setShow(false)
        }
      }
    },
    []
  )

  return (
    <div
      className={`canvas-container ${show ? '' : 'hidden'} w-full h-full fixed`}
    >
      {view === '2d' ? <P2D /> : <P3D />}
    </div>
  )
})
