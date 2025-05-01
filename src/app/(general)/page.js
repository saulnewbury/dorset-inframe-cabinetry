/**
 * Home page
 */

// Components
import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import MaterialsWeLove from './MaterialsWeLove'
import CtaProducts from './CtaProducts'
import OurCabinets from './OurCabinets'
import ConfigureYourKitchen from './ConfigureYourKitchen'

// Images
import kitchen from '@/lib/images/kitchen1.jpg'

import Footer from '@/components/Footer'

const markup =
  '<p class="max-w-[600px] lg:max-w-[706px]">We pride ourselves on delivering affordable high-end, inframe cabinetry, made to last, using materials that are both cost effective and eco-friendly</p>'

export default function Page() {
  return (
    <>
      <HeroText markup={markup} />
      <HeroImage src={kitchen} alt='something' />
      <MaterialsWeLove />
      <OurCabinets />
      <CtaProducts not='Our cabinets' gridNum={5} title='We can source...' />
      <ConfigureYourKitchen />
      <Footer classes='bg-[#606D8E] text-white pb-[120px]' />
    </>
  )
}
