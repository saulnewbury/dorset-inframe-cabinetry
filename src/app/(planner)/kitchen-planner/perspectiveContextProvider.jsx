'use client'
import { useState } from 'react'
import { PerspectiveContext } from '@/app/context.js'

export default function PerspectiveContextProvider({ children }) {
  const [view, setView] = useState('2d')

  function changeView(perspective) {
    console.log('whatsup')
    setView(perspective)
  }

  return (
    <PerspectiveContext.Provider value={{ changeView, view }}>
      {children}
    </PerspectiveContext.Provider>
  )
}
