'use client'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Quantity from './Quantity'

const noop = () => {}

export default function DimensionsLines({
  start,
  end,
  offset,
  color,
  angle,
  onChange = noop
}) {
  const line = useRef()
  const sl = useRef()
  const el = useRef()

  const length = [],
    startLine = [],
    endLine = []

  // measurement
  const quantity = (end[0] - start[0]).toFixed(3)

  // line
  length.push(new THREE.Vector3(start[0], 0, start[1]))
  length.push(new THREE.Vector3(end[0], 0, end[1]))

  // startMark
  startLine.push(new THREE.Vector3(start[0], 0 - 0.05, start[1]))
  startLine.push(new THREE.Vector3(start[0], 0 + 0.1, start[1]))

  // endMark
  endLine.push(new THREE.Vector3(end[0], 0 - 0.05, end[1]))
  endLine.push(new THREE.Vector3(end[0], 0 + 0.1, end[1]))

  useEffect(() => {
    line.current.geometry.setFromPoints(length)
    sl.current.geometry.setFromPoints(startLine)
    el.current.geometry.setFromPoints(endLine)

    // console.log(quantity)
  }, [start, end, angle])

  return (
    <group position-y={offset}>
      <line ref={line}>
        <bufferGeometry />
        <lineBasicMaterial color={color} />
      </line>
      <line ref={sl}>
        <bufferGeometry />
        <lineBasicMaterial color={color} />
      </line>
      <line ref={el}>
        <bufferGeometry />
        <lineBasicMaterial color={color} />
      </line>
      <Quantity angle={angle} onChange={(l) => onChange(l - quantity)}>
        {quantity}
      </Quantity>
    </group>
  )
}
