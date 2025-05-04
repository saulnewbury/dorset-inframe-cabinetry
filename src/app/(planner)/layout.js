export const metadata = {
  title: 'Kitchen planner - Dorset Inframe Cabinetry',
  description: 'Configure your kitchen with our kitchen planner'
}

import { Suspense } from 'react'
import ModelContextProvider from './ModelContextProvider'

export default function Layout({ children }) {
  return (
    <Suspense>
      <ModelContextProvider>{children}</ModelContextProvider>
    </Suspense>
  )
}
