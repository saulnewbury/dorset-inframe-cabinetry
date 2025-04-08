import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyHandlesAndKnobs } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Handles and Knobs'} />
      <WeCanSupply {...weSupplyHandlesAndKnobs} />
      <ProductsMini not='Handles and knobs' gridNum={5} />
      <Footer />
    </>
  )
}
