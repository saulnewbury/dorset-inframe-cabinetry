import '../global.css'

import NavDesktop from '@/app/(general)/NavDesktop'
import NavMobile from '@/app/(general)/NavMobile'

export const metadata = {
  title: 'Dorset Inframe Cabinetry',
  description: 'Purveyors Inframe Cabinetry'
}

export default function Layout({ children }) {
  return (
    <>
      <NavMobile />
      <NavDesktop showCart={false} />
      {children}
    </>
  )
}
