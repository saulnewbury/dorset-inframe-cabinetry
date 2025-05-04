'use client'
import HeroText from '@/components/HeroText'
import ProductGrid from './ProductGrid'
import Footer from '@/components/Footer'

import productRange from '@/lib/data/products'

export default function Page({ params }) {
  const products = productRange[0]

  // const sdf = productRange.find((item) => {
  //   const text = params.category.split('-').join(' ')
  //   const name = text.charAt(0).toUpperCase() + text.slice(1)
  //   return item.name === name
  // })

  return (
    <>
      <HeroText markup={'Our cabinets'} />
      {products && <ProductGrid products={products} />}
      <Footer />
    </>
  )
}
