// CustomOrbitControls.jsx
'use client'

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import { OrbitControls as DreiOrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
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
    const panningRef = useRef(false)
    const { camera } = useThree()

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
      const controls = controlsRef.current
      if (!controls || !controls.domElement) return

      const domElement = controls.domElement
      let prevX = 0
      let prevY = 0

      // Custom implementation of panning
      function handlePan(event) {
        if (!panningRef.current) return

        const deltaX = event.clientX - prevX
        const deltaY = event.clientY - prevY
        prevX = event.clientX
        prevY = event.clientY

        // Pan the camera based on mouse movement
        // This mimics OrbitControls pan behavior without modifying internal state
        const offset = new THREE.Vector3()
        const position = camera.position.clone()
        const targetPosition = controls.target.clone()

        // Get the offset direction based on camera orientation
        offset.copy(position).sub(targetPosition)
        const targetDistance = offset.length()

        // Calculate pan speed based on zoom level
        const panSpeed = (controls.panSpeed * targetDistance) / 1000

        // Apply the pan movement
        offset.set(-deltaX * panSpeed, deltaY * panSpeed, 0)
        offset.applyQuaternion(camera.quaternion)

        position.add(offset)
        targetPosition.add(offset)

        camera.position.copy(position)
        controls.target.copy(targetPosition)

        controls.update()
      }

      function handlePointerDown(event) {
        if (event.ctrlKey && event.button === 0) {
          event.preventDefault()
          panningRef.current = true
          prevX = event.clientX
          prevY = event.clientY

          // Add listeners for move and up events
          window.addEventListener('pointermove', handlePointerMove, false)
          window.addEventListener('pointerup', handlePointerUp, false)
        }
      }

      function handlePointerMove(event) {
        if (panningRef.current) {
          event.preventDefault()
          handlePan(event)
        }
      }

      function handlePointerUp() {
        panningRef.current = false
        window.removeEventListener('pointermove', handlePointerMove, false)
        window.removeEventListener('pointerup', handlePointerUp, false)
      }

      // Add the main pointer down listener
      domElement.addEventListener('pointerdown', handlePointerDown, false)

      return () => {
        domElement.removeEventListener('pointerdown', handlePointerDown, false)
        window.removeEventListener('pointermove', handlePointerMove, false)
        window.removeEventListener('pointerup', handlePointerUp, false)
      }
    }, [camera])

    return (
      <DreiOrbitControls
        ref={controlsRef}
        enableRotate={is3D}
        enablePan={is3D ? true : enablePan && !(dragging ?? hover)}
        minDistance={1.5}
        maxDistance={20}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.1}
        panSpeed={is3D ? 0.3 : 0.6}
        zoomSpeed={0.5}
        dampingFactor={is3D ? 0.1 : 0.3}
        mouseButtons={{
          LEFT: is3D ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
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
