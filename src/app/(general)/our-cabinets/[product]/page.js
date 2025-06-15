import Footer from '@/components/Footer'
import Product from './Product'

import products from '@/lib/data/products'

export default function Page({ params }) {
  const product = getProduct(params, products)

  return (
    product && (
      <>
        {/* <HeroText markup={product.name} desc={product.desc} /> */}
        <Product {...product} />
        <Footer />
      </>
    )
  )
}

// Functions

function normalCase(text) {
  return text
    ? text.charAt(0).toUpperCase() + text.slice(1).split('-').join(' ')
    : text
}

function getProduct(params, products) {
  const category = 'Our cabinets'
  const range = products.find((p) => p.name === category)
  // console.log('category', category, 'range', range)
  return range?.items.find((item) => item.id === params.product)
}
