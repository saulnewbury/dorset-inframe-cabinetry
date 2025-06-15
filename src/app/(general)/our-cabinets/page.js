'use client'
import HeroText from '@/components/HeroText'
import ProductGrid from './ProductGrid'
import Footer from '@/components/Footer'

import productRange from '@/lib/data/products'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const products = productRange[0]
  const search = useSearchParams()
  const category = getCategory(search.get('category') ?? 'all')

  // const sdf = productRange.find((item) => {
  //   const text = params.category.split('-').join(' ')
  //   const name = text.charAt(0).toUpperCase() + text.slice(1)
  //   return item.name === name
  // })

  return (
    <>
      <HeroText markup={'Our cabinets'} />
      {products && <ProductGrid products={products} category={category} />}
      <Footer />
    </>
  )

  function getCategory(str) {
    const options = {
      base: 'Base cabinets',
      tall: 'Tall cabinets',
      wall: 'Wall cabinets',
      all: 'All'
    }
    return options[str] ?? 'All'
  }
}
