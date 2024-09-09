// Components
import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import MaterialsWeLove from './MaterialsWeLove'
import Products from './Products'

// Images
import kitchen from '@/lib/images/kitchen1.jpg'

import Footer from '@/components/Footer'

import { homeHeroMarkup } from '@/lib/data/markup.js'

export default function Home() {
  return (
    <>
      <HeroText markup={homeHeroMarkup} />
      <HeroImage src={kitchen} />
      <MaterialsWeLove />
      <Products />
      <Footer classes='bg-[#606D8E] text-white pb-[120px]' />
    </>
  )
}
