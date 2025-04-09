import React from 'react'

export default function DialogInnerContainer({ children, classes = null }) {
  return (
    <div className={`[&>p]:my-8 pb-32 ${classes ? classes : ''}`}>
      {children}
    </div>
  )
}
