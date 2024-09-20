'use client'

import NavDesktop from './NavDesktop'
import NavMobile from './NavMobile'
import NavConfigurator from './NavConfigurator'

import { usePathname } from 'next/navigation'

export default function Menu() {
  const pathname = usePathname()
  const page = pathname.includes('kitchen-planner/') ? 'planner' : 'main site'

  return (
    <>
      {page === 'main site' && (
        <>
          <NavMobile />
          <NavDesktop />
        </>
      )}
      {page === 'planner' && (
        <>
          <NavMobile />
          <NavConfigurator />
        </>
      )}
    </>
  )
}
