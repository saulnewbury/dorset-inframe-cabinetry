'use client'

import { useEffect, useState } from 'react'

import NavDesktop from './NavDesktop'
import NavMobile from './NavMobile'

export default function Menu() {
  const [matches, setMatches] = useState(undefined)

  useEffect(() => {
    window.addEventListener('resize', () => {
      const val = window.matchMedia('(max-width: 976px)').matches
      setMatches(val)
    })
  }, [])

  return <div>{matches ? <NavMobile /> : <NavDesktop />}</div>
}
