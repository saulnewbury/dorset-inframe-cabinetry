'use client'
import { useState, useContext, Fragment } from 'react'
import { square } from './floorplans'

import Wall from './Wall'
import Corner from './Corner'
import Handle from './Handle'

import { PerspectiveContext } from '@/app/context'

export default function FloorPlan() {
  const [plan, setPlan] = useState(square)
  const [handle, setHandle] = useState({})
  const [showHandle, setShowHandle] = useState(false)
  const [dragging, setDragging] = useState(false)

  const { view } = useContext(PerspectiveContext)

  function updatePlan(id, x, z) {
    const newArray = plan.map((point) => {
      if (point.id !== id) return point
      return { id, x, z }
    })
    setPlan(newArray)
  }

  function updateHandle(x, z, id) {
    setHandle({ x, z, id })
  }

  return (
    <>
      {plan.map((point, i) => (
        <Fragment key={i}>
          <Corner
            params={point}
            t={0.15}
            h={1}
            handleCoordinates={updateHandle}
            toggleHandle={() => {
              setShowHandle(true)
            }}
          />
          <Wall a={plan[i]} b={plan[(i + 1) % 4]} t={0.15} h={1} />
        </Fragment>
      ))}

      {view === '2d' && showHandle && (
        <Handle
          params={handle}
          t={0.15}
          h={1}
          handleDrag={updatePlan}
          showHandle={showHandle}
          dragging={() => {
            setDragging(!dragging)
          }}
          toggleHandle={() => {
            setShowHandle(!showHandle)
          }}
        />
      )}
    </>
  )
}

// {
/* {view === '2d' && (
        <Handle
          key={handle}
          // end={end}
          t={handle.t}
          x={handle.x}
          z={handle.z}
          // handleDrag={handleDrag}
          dragging={(bool) => {
            setDragging(bool)
          }}
          // angle={angle}
          // ref={handle}
        />
      )} */
// }

// function handleDrag({ x, z }, ids) {
// const newArray = walls.map((w) => {
//   if (!ids.includes(w.id)) return w
//   const adj = w.z - z // position z of wall
//   const opp = w.x - x // position x of group
//   const l = Math.sqrt(adj * adj + opp * opp)
//   const theta = -(
//     Math.atan2(adj, opp) - Math.atan2(w.id % 2 ? w.x : w.z, 0)
//   )
//   // { ...w, l: hyp, theta, x: opp, z: adj }
//   return { ...w, theta }
// })
// setWalls(newArray)
// }
