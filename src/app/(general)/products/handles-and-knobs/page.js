import HeroText from '@/components/HeroText'
import CtaProducts from '@/app/(general)/CtaProducts'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyHandlesAndKnobs } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Handles and Knobs'} />
      <WeCanSupply {...weSupplyHandlesAndKnobs} />
      <CtaProducts not='Handles and knobs' gridNum={5} />
      <Footer />
    </>
  )
}
