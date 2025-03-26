'use client'
import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import Experience from './Experience'
import Camera from './Camera'
import ViewControls from './ViewControls'

import { useAppState } from '@/appState'
import { AppContext } from '@/context'

import { useScreenshot } from '@/lib/helpers/useScreenshot'

export default forwardRef(function KitchenPlanner(props, ref) {
  const { is3D, set3D } = useAppState()
  const [show, setShow] = useState(false)
  const [shrink, setCanvasShrink] = useState(false)
  const [refreshed, setRefreshed] = useState(false)

  const container = useRef()
  const overlay = useRef()

  // fade in animation for canvas when switching perspective
  useGSAP(() => {
    if (!refreshed) {
      // Using an overlay to hide a glitchy flash
      gsap.fromTo(
        overlay.current,
        { opacity: 1 },
        { opacity: 0, duration: 0.8, delay: 1 }
      )
      gsap.set(overlay.current, {
        visibility: 'hidden',
        duration: 0.8,
        delay: 1.8
      })
      setRefreshed(true)
    }
    if (is3D || !is3D || shrink || !shrink) {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.04 }
      )
    } else {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.01, delay: 0.04 }
      )
    }
  }, [is3D, shrink])

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
        },
        shrinkCanvas: () => {
          setCanvasShrink(true)
          setShow(true)
        },
        restoreCanvas: () => {
          setCanvasShrink(false)
          setShow(true)
        }
      }
    },
    []
  )

  const { takeScreenshot, SceneCapture } = useScreenshot(3840, 2160)

  const style = {
    height: '70%',
    width: '70%',
    backgroundColor: '#ffffff',
    marginTop: '6rem',
    marginLeft: '37px',
    border: 'solid',
    borderColor: 'rgb(229, 231, 235)',
    borderWidth: '1px'
  }

  return (
    <AppContext.Provider value={is3D}>
      <div
        ref={container}
        className={`canvas-container ${
          show ? '' : 'opacity-0'
        }  w-full h-full fixed`}
      >
        <Canvas frameloop='demand' shadows style={shrink ? style : ''}>
          <Camera is3D={is3D} />
          <Experience is3D={is3D} />
          <SceneCapture />
        </Canvas>
        <div
          ref={overlay}
          className='absolute bg-[white] w-[100vw] h-[70vw] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'
        ></div>
      </div>
      <ViewControls changePerspective={(bool) => set3D(bool)} is3D={is3D} />
      <div className='absolute bottom-3'>
        <button onClick={takeScreenshot}>Take Screenshot</button>
      </div>
    </AppContext.Provider>
  )
})
