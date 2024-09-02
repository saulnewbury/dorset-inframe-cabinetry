import HeroText from '@/lib/components/HeroText'
import HeroImage from '@/lib/components/HeroImage'

import { heroMaterialsMarkup } from '@/lib/data/data'

export default function page() {
  return (
    <>
      <HeroText markup={heroMaterialsMarkup} />
      {/* <HeroImage /> */}
    </>
  )
}
