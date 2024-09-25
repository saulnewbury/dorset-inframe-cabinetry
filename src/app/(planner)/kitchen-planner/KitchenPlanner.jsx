'use client'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useImperativeHandle, forwardRef } from 'react'

import Experience from './Experience'

export default forwardRef(function KitchenPlanner(props, ref) {
  const [show, setShow] = useState(false)

  useImperativeHandle(
    ref,
    () => {
      return {
        showCanvas: () => {
          console.log('show')
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
      <Canvas
        orthographic
        camera={{
          zoom: 150,
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 6, 0]
        }}
      >
        <Experience />
      </Canvas>
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
