import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import { weSupplySinksAndTaps } from '@/lib/data/weSupply'

export default function page() {
  return (
    <>
      <HeroText markup={'Sinks and Taps'} />
      <WeCanSupply {...weSupplySinksAndTaps} />
      <ProductsMini not='Sinks and taps' gridNum={5} />
      <Footer />
    </>
  )
}
