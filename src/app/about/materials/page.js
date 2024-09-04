'use client'

import HeroText from '@/lib/components/HeroText'
import HeroImage from '@/lib/components/HeroImage'

import { heroMaterialsMarkup } from '@/lib/data/data'
import materials from '@/lib/images/materials.jpg'

export default function page() {
  return (
    <>
      <HeroText markup={heroMaterialsMarkup} />
      <HeroImage src={materials} />
    </>
  )
}
