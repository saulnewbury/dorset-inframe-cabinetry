'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Experience() {
  const pathname = usePathname()
  return (
    pathname.includes('kitchen-planner/') && (
      <div className='h-[100vh] flex items-center justify-center'>
        <span>Experience</span>
      </div>
    )
  )
}
