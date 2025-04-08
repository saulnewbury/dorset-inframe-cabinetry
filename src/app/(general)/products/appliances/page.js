import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '../../WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/caple-appliances.webp'

import { weSupplyAppliances } from '@/lib/data/weSupply'

export default function page() {
  const { markup, brands } = weSupplyAppliances
  return (
    <>
      <HeroText markup={'Appliances'} />
      <WeCanSupply
        codes={true}
        markup={markup}
        src={image}
        brands={brands}
        color='#e6e5e4'
      />
      <ProductsMini not='Appliances' gridNum={5} />
      <Footer />
    </>
  )
}
