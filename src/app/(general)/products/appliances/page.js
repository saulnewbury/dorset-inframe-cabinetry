import HeroText from '@/components/HeroText'
import CtaProducts from '@/app/(general)/CtaProducts'
import WeCanSupply from '../../WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplyAppliances } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Appliances'} />
      <WeCanSupply {...weSupplyAppliances} />
      <CtaProducts not='Appliances' gridNum={5} />
      <Footer />
    </>
  )
}
