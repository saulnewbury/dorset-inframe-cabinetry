import React from 'react'

export default function CabinetGrid({ children, classes = null }) {
  return (
    <div className={`grid grid-cols-3 gap-4 ${classes ? classes : ''}`}>
      {children}
    </div>
  )
}
