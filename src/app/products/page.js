'use client'

import HeroText from '@/components/HeroText'
import Products from './Products'
import ProductsMini from '../ProductsMini'

export default function page() {
  return (
    <>
      <HeroText markup={'All products'} />
      <Products />
    </>
  )
}
