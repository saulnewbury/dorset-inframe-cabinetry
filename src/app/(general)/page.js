// Components
import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import MaterialsWeLove from './MaterialsWeLove'
import ProductsMini from './ProductsMini'
import ConfigureYourKitchen from './ConfigureYourKitchen'

// Images
import kitchen from '@/lib/images/kitchen1.jpg'

import Footer from '@/components/Footer'

import { homeHeroMarkup } from '@/lib/data/markup.js'

export default function Page() {
  return (
    <>
      <HeroText markup={homeHeroMarkup} />
      <HeroImage src={kitchen} alt='something' />
      <MaterialsWeLove />
      <ProductsMini />
      <ConfigureYourKitchen />
      <Footer classes='bg-[#606D8E] text-white pb-[120px]' />
    </>
  )
}
