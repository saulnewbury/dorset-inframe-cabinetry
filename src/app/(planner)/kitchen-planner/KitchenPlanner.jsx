'use client'
import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import Experience from './Experience'
import Camera from './Camera'
import ViewControls from './ViewControls'

export default forwardRef(function KitchenPlanner(props, ref) {
  const [show, setShow] = useState(false)
  const [is3D, set3D] = useState(false)

  const container = useRef()

  // fade in animation for canvas when switching perspective
  useGSAP(() => {
    if (is3D) {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      )
    } else {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.01 }
      )
    }
  }, [is3D])

  // show only on relavent pages
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
      ref={container}
      className={`canvas-container ${show ? '' : 'hidden'} w-full h-full fixed`}
    >
      <Canvas frameloop='demand' shadows>
        <Camera is3D={is3D} />
        <Experience is3D={is3D} />
      </Canvas>
      <ViewControls changePerspective={(bool) => set3D(bool)} is3D={is3D} />
    </div>
  )
})
