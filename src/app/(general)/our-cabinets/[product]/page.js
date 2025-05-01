import Footer from '@/components/Footer'
import Product from './Product'

import products from '@/lib/data/products'

export default function Page({ params }) {
  const product = getProduct(params, products)

  return (
    <>
      {/* <HeroText markup={product.name} desc={product.desc} /> */}
      <Product
        name={product.name}
        desc={product.desc}
        price={product.price}
        images={product.images}
        sizes={product.sizes}
        options={product.options}
      />
      <Footer />
    </>
  )
}

// Functions

function normalCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).split('-').join(' ')
}

function getProduct(params, products) {
  const category = normalCase(params.category)
  const product = normalCase(params.product)
  const range = products.find((p) => p.name === category)
  return range.items.find((item) => item.name === product)
}
