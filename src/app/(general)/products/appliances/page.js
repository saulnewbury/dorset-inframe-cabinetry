import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '../../WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyAppliances } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Appliances'} />
      <WeCanSupply {...weSupplyAppliances} />
      <ProductsMini not='Appliances' gridNum={5} />
      <Footer />
    </>
  )
}
