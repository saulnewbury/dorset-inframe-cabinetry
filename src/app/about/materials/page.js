'use client'
import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import materials from '@/lib/images/materials.jpg'

export default function page() {
  return (
    <>
      <HeroText markup='Materials' />
      <HeroImage src={materials} />
    </>
  )
}
