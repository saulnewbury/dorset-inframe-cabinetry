'use client'
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useContext,
  useEffect
} from 'react'

import {} from '@react-three/drei'

import { Canvas } from '@react-three/fiber'

import { PerspectiveContext } from '@/app/context.js'

import Experience from './Experience'
import P2D from './P2D'
import P3D from './P3D'

export default forwardRef(function KitchenPlanner(props, ref) {
  const [show, setShow] = useState(false)
  const { view } = useContext(PerspectiveContext)

  useEffect(() => {
    console.log(view)
  }, [view])

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
    <div className={`${show ? '' : 'hidden'} w-full h-full fixed`}>
      {view === '2d' ? <P2D /> : <P3D />}
    </div>
  )
})

// Try and create a div containng a canvas outside of the
// children, but I'd put a ref to it somehwere where the
// child components can find it.

// Use context or an imperative handle* latter best

// layout creates the instance of kitchenPlanner and obtains a ref to it.
// It passes that ref to the child components, and they can then use the
// current value of that ref to control the kitchen planner.

// Still an issue

// think about it like a dialog box - it exists but can be shown or hidden.
// IH allows you to have functions that show or hide the kitchen planner.
// Can be done implicitly using css selectors. Better that the child that
// needs it saying "I need you! Show yourself, punk!" And vice versa.

// new layout.

// useContext to get the ref
// ref var is an obj with .current - destructure. Then you can call with the value
// Imperative handle changes the nature of the ref. It means the parent can call
// functions inside that child component.
