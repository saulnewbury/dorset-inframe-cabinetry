import React from 'react'

export default function CabinetGrid({ children }) {
  return <div className='grid grid-cols-3 gap-4'>{children}</div>
}
