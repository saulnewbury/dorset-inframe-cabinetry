import { Suspense } from 'react'

export const metadata = {
  title: 'Kitchen planner - Dorset Inframe Cabinetry',
  description: 'Configure your kitchen with our kitchen planner'
}

export default function Layout({ children }) {
  return <Suspense>{children}</Suspense>
}
