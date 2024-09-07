'use client'
import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import materials from '@/lib/images/sawmill-waste-collection.jpg'

export default function page() {
  return (
    <>
      <HeroText markup='The beauty of recycled wood' />
      <HeroImage src={materials} />
    </>
  )
}
