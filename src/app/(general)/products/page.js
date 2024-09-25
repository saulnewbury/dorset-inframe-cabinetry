import HeroText from '@/components/HeroText'
import Products from './Products'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>
      <HeroText markup={'All products'} />
      <Products />
      <Footer />
    </>
  )
}
