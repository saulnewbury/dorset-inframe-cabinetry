'use client'
import { useState } from 'react'
import { PerspectiveContext } from '@/context.js'

export default function PerspectiveContextProvider({ children }) {
  const [view, setView] = useState('2d')

  function changeView(perspective) {
    setView(perspective)
  }

  return (
    <PerspectiveContext.Provider value={{ changeView, view }}>
      {children}
    </PerspectiveContext.Provider>
  )
}
