'use client'

import NavDesktop from './NavDesktop'
import NavMobile from './NavMobile'
import NavConfigurator from '../(planner)/kitchen-planner/NavConfigurator'

import { usePathname } from 'next/navigation'

export default function Menu() {
  const pathname = usePathname()
  const pageLocation = pathname.includes('kitchen-planner/')
    ? 'planner'
    : 'main site'

  return (
    <>
      {pageLocation === 'main site' && (
        <>
          <NavMobile />
          <NavDesktop />
        </>
      )}
      {pageLocation === 'planner' && (
        <>
          <NavMobile />
          <NavConfigurator />
        </>
      )}
    </>
  )
}
