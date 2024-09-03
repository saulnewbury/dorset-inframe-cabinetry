'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

import NavDesktop from './NavDesktop'
import NavMobile from './NavMobile'

export default function Menu() {
  return (
    <>
      <NavMobile />
      <NavDesktop />
    </>
  )
}
