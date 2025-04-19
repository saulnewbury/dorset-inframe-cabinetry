'use client'

// Modules
import { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react'
import {
  OrbitControls,
  useHelper,
  BakeShadows,
  SoftShadows
} from '@react-three/drei'
import * as THREE from 'three'

// Helpers
import { radToDeg } from '@/lib/helpers/radToDeg'

// Data
import { ModelContext } from '@/model/context'

// Objects
import Wall from './Wall'
import Corner from './Corner'
import KitchenUnit from './KitchenUnit'
import Floor from './Floor'

import { wh } from '@/const'

/**
 * @typedef {{
 *    x: number
 *    z: number
 * }} Point
 * @typedef {{
 *    type: string
 *    offset: number
 * }} Feature
 */

/**
 * Corners are drawn with data from the points array, and walls are
 * drawn from the points. Hovering over a corner sends that's corners
 * – point – coordinates back to the parent, which Handle consumes to
 * get it's start position. Then on drag Handle updates points with
 * it's newlocations thereby updating the corners.
 */

export default function Experience({ is3D }) {
  const [model] = useContext(ModelContext)
  const [hover, setHover] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [enablePan, setPan] = useState(false)
  const orbitControls = useRef()
  const walls = useRef()
  const light = useRef()

  // useHelper(light, THREE.DirectionalLightHelper, 1)
  useHelper(light, THREE.PointLightHelper, 1)

  const hovered = useRef(new Set())

  // Get next or previous point, taking into account that only wall segment 0
  // (the outer wall) actually wraps around from end to start.
  const wrap = (a, n, s) => (s ? a[n] : a[(n + a.length) % a.length])

  // Hide default cursor when hovering or dragging.
  useLayoutEffect(() => {
    document.body.style.cursor =
      (dragging ?? hover) && hover?.type !== 'unit' ? 'none' : 'auto'
  }, [dragging, hover])

  useEffect(() => {
    hideWalls()
    orbitControls.current.reset()
  }, [is3D])

  useEffect(() => {
    if (orbitControls.current) {
      const controls = orbitControls.current

      // You can force a different zoom level
      // controls.minDistance = 0.001
      controls.maxZoom = 2000 // Try this property as well

      // Update the controls
      controls.update()
    }
  }, [])

  return (
    <>
      <OrbitControls
        ref={orbitControls}
        enableRotate={is3D}
        enablePan={is3D ? true : enablePan && !(dragging ?? hover)}
        minDistance={1.5} //
        maxDistance={20} // how far out
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.1}
        panSpeed={1}
        zoomSpeed={0.5}
        dampingFactor={is3D ? 0.1 : 0.3}
        mouseButtons={{
          LEFT: is3D ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        onChange={hideWalls}
        target={[0, 1, 0]}
      />

      <axesHelper />

      {/* Environment elements */}
      {is3D && <BakeShadows />}

      <SoftShadows size={25} samples={10} focus={0} />
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[4, 4, -2]}
        castShadow={is3D ? true : false}
        intensity={4}
        shadow-mapSize={[1024 * 3, 1024 * 3]}
      />
      {is3D && (
        <pointLight
          ref={light}
          args={[0xfffae6, 1, 100]}
          intensity={15}
          position={[0, 3, 0]}
        />
      )}
      {/* Scene */}
      <Floor
        points={model.walls[0] ?? []}
        handlePan={(bool) => {
          setPan(bool)
        }}
      />
      {/* Walls */}
      <group ref={walls}>
        {model.walls.map((segment, s) =>
          segment.map((pt, n, a) => {
            const to = wrap(a, n + 1, s)
            const prev = wrap(a, n - 1, s)
            const next = wrap(a, n + 2, s)
            return (
              to && (
                <Wall
                  key={pt.id}
                  from={pt}
                  to={to}
                  prev={prev}
                  next={next}
                  hover={dragging ?? hover}
                  onHover={hoverItem}
                  onDrag={dragItem}
                />
              )
            )
          })
        )}
      </group>
      {/* Drag handles for corners (vertices) */}
      {!is3D &&
        model.walls.map((segment) =>
          segment.map((pt, n, a) => {
            const prev = wrap(a, n - 1)
            const next = wrap(a, n + 1)
            return (
              <Corner
                key={pt.id}
                at={pt}
                prev={prev}
                next={next}
                hover={dragging ?? hover}
                onHover={hoverItem}
                onDrag={dragItem}
              />
            )
          })
        )}

      {/* Units */}
      {model.units.map((unit) => (
        <KitchenUnit
          key={unit.id}
          {...unit}
          hover={dragging ?? hover}
          onHover={hoverItem}
          onDrag={dragItem}
        />
      ))}
    </>
  )

  /**
   * Updates the 'hover' state for items in the model, tracking which item is
   * 'nearest' the camera.
   */
  function hoverItem(ev, isHover) {
    const obj = ev?.eventObject
    if (obj) {
      if (isHover) hovered.current.add(obj)
      else hovered.current.delete(obj)
      const top = ev.intersections?.find((t) =>
        hovered.current.has(t.eventObject)
      )
      setHover(top?.eventObject.userData ?? null)
    } else setHover(null)
  }

  /**
   * When a drag starts (param true), locks the hover state to the current
   * item. When it ends, releases the lock.
   */
  function dragItem(isActive) {
    setDragging(isActive ? hover : null)
  }

  function hideWalls() {
    if (is3D) {
      walls.current.traverse((obj) => {
        const sceneRotation = radToDeg(
          orbitControls.current.getAzimuthalAngle()
        )
        if (obj.name.startsWith('wall-')) {
          const wallRotation = radToDeg(-obj.rotation.y)
          const relativeAngle = (wallRotation + sceneRotation + 360) % 360
          obj.visible = !(relativeAngle >= 120 && relativeAngle <= 240)
        }
      })
    } else {
      walls.current.traverse((obj) => {
        obj.visible = true
      })
    }
  }
}
