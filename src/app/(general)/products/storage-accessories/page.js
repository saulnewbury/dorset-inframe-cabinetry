import HeroText from '@/components/HeroText'
import CtaProducts from '@/app/(general)/CtaProducts'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyStorageAndAccessories } from '@/lib/data/weSupply'
export default function page() {
  return (
    <>
      <HeroText markup={'Storage and Accessories'} />
      <WeCanSupply {...weSupplyStorageAndAccessories} />
      <CtaProducts not='Storage accessories' gridNum={5} />
      <Footer />
    </>
  )
}
