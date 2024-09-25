import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import Intro from '@/components/Intro'
import TxtImg from '@/components/TxtImg'
import TxtImgAlt from '@/components/TxtImgAlt'
import Cta from '@/components/Cta'
import Footer from '@/components/Footer'

// Images
import materials from '@/lib/images/sawmill-waste-collection.jpg'

// data
import { keyPointsMaterials } from '@/lib/data/keyPoints'

const text =
  'Where it comes to inframe cabinetry in kitchens and bathrooms, Moisture Resistant MDF (MR MDF) and Melamine Faced Chipboard (MFC) are our materials of choice, being are highly versatile, cost effective, and eco friendly.'

const data = {
  text: 'Inframe: A timeless aesthetic, built to last...',
  link: { href: '/about/inframe-cabinetry', text: 'Read more' }
}
export default function Page() {
  return (
    <>
      <HeroText markup='The beauty of recycled wood' />
      <HeroImage src={materials} alt={'something'} />
      <Intro text={text} />
      {/* <TxtImg keyPoints={keyPointsMaterials} /> */}
      <TxtImgAlt keyPoints={keyPointsMaterials} />
      <Cta data={data} />
      <Footer />
    </>
  )
}
