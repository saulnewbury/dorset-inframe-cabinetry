import '../global.css'

import NavDesktop from '@/app/(general)/NavDesktop'
import NavMobile from '@/app/(general)/NavMobile'
import { Suspense } from 'react'

export const metadata = {
  title: 'Dorset Inframe Cabinetry',
  description: 'Purveyors Inframe Cabinetry'
}

export default function Layout({ children }) {
  return (
    <Suspense fallback={<div></div>}>
      <NavMobile />
      <NavDesktop />
      {children}
    </Suspense>
  )
}
