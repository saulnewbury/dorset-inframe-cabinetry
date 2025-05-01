// CustomOrbitControls.jsx
'use client'

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const CustomOrbitControls = forwardRef(
  (
    {
      is3D,
      enablePan = true,
      dragging = null,
      hover = null,
      onChange,
      ...props
    },
    ref
  ) => {
    const controlsRef = useRef()

    // Forward the ref and expose methods
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (controlsRef.current) {
          controlsRef.current.reset()
        }
      },
      getAzimuthalAngle: () => {
        return controlsRef.current ? controlsRef.current.getAzimuthalAngle() : 0
      },
      getPolarAngle: () => {
        return controlsRef.current ? controlsRef.current.getPolarAngle() : 0
      },
      update: () => {
        if (controlsRef.current) {
          controlsRef.current.update()
        }
      }
    }))

    useEffect(() => {
      if (!controlsRef.current) return

      const controls = controlsRef.current

      // Store the original mousedown handler
      const originalMouseDown = controls.onMouseDown

      // Override the mousedown handler with our own version
      controls.onMouseDown = function (event) {
        // If Ctrl+Left click, treat it as RIGHT click (PAN)
        if (event.ctrlKey && event.button === 0) {
          // Create a modified event with button set to RIGHT
          const modifiedEvent = {
            ...event,
            button: 2, // RIGHT mouse button
            preventDefault: event.preventDefault,
            stopPropagation: event.stopPropagation
          }

          // Call the original handler with our modified event
          originalMouseDown.call(this, modifiedEvent)
          return
        }

        // For all other cases, use the original handler
        originalMouseDown.call(this, event)
      }

      // Clean up when the component unmounts
      return () => {
        // Restore the original handler
        if (controls && originalMouseDown) {
          controls.onMouseDown = originalMouseDown
        }
      }
    }, [is3D]) // Only re-run if is3D changes

    return (
      <DreiOrbitControls
        ref={controlsRef}
        enableRotate={is3D}
        enablePan={is3D ? true : enablePan && !(dragging ?? hover)}
        minDistance={1.5}
        maxDistance={20}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.1}
        panSpeed={1}
        zoomSpeed={0.5}
        dampingFactor={is3D ? 0.1 : 0.3}
        mouseButtons={{
          LEFT: is3D ? THREE.MOUSE.ROTATE : null,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        target={[0, 1, 0]}
        onChange={onChange}
        {...props}
      />
    )
  }
)

CustomOrbitControls.displayName = 'CustomOrbitControls'

export default CustomOrbitControls
