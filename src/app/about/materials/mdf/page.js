'use client'

import HeroText from '@/lib/components/HeroText'
import HeroImage from '@/lib/components/HeroImage'
import { heroMdfMarkup } from '@/lib/data/data'

export default function materials() {
  return (
    <>
      <HeroText markup={heroMdfMarkup} />
      {/* <HeroImage /> */}
    </>
  )
}
