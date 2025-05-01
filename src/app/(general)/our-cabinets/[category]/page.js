'use client'

import HeroText from '@/components/HeroText'
import ProductGrid from '../../ProductGrid'
import Footer from '@/components/Footer'

import products from '@/lib/data/products'

export default function Page({ params }) {
  const cabinetsProduct = products.find(
    (product) => product.name === 'Our cabinets'
  )

  const cabinetCategory = cabinetsProduct.categories.find((category) => {
    const text = params.category.split('-').join(' ')
    const name = text.charAt(0).toUpperCase() + text.slice(1)
    return category.name === name
  })

  console.dir(cabinetCategory)

  return (
    <>
      <HeroText markup={cabinetCategory.name} />
      {cabinetCategory && <ProductGrid products={cabinetCategory} />}
      <Footer />
    </>
  )
}
