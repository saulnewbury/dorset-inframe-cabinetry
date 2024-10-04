'use client'
import { useState } from 'react'
import Wall from './Wall'
import { square } from './floorplans'

export default function FloorPlan() {
  const [plan, setPlan] = useState(square)

  function updatePlan() {
    console.log('update plan')
  }

  return plan.map((wall, i) => (
    <Wall key={i} params={wall} onChange={updatePlan} />
  ))
}
