'use client'

import HeroText from './lib/components/HeroText'
import HeroImage from './lib/components/HeroImage'

import kitchen from './lib/images/kitchen1.jpg'

import { homeHeroMarkup } from '@/lib/data/data.js'

export default function Home() {
  return (
    <>
      <HeroText markup={homeHeroMarkup} />
      <HeroImage src={kitchen} />
    </>
  )
}
