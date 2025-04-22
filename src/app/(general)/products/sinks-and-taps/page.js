import HeroText from '@/components/HeroText'
import CtaProducts from '@/app/(general)/CtaProducts'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplySinksAndTaps } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Sinks and Taps'} />
      <WeCanSupply {...weSupplySinksAndTaps} />
      <CtaProducts not='Sinks and taps' gridNum={5} />
      <Footer />
    </>
  )
}
