import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyStorageAndAccessories } from '@/lib/data/weSupply'
export default function page() {
  return (
    <>
      <HeroText markup={'Storage and Accessories'} />
      <WeCanSupply {...weSupplyStorageAndAccessories} />
      <ProductsMini not='Storage accessories' gridNum={5} />
      <Footer />
    </>
  )
}
