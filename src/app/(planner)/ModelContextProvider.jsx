'use client'
import { useReducer, useEffect } from 'react'
import { ModelContext } from '@/model/context'
import { initialState, loadState, updateModel } from '@/model/appModel'

export default function ModelContextProvider({ children }) {
  const [model, dispatch] = useReducer(updateModel, initialState)
  useEffect(() => dispatch({ id: 'loadState', shape: 'square' }), [])
  return (
    <ModelContext.Provider value={[model, dispatch]}>
      {children}
    </ModelContext.Provider>
  )
}
