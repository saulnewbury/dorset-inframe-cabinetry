import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import Intro from '@/components/Intro'
import TxtImg from '@/components/TxtImg'
import TxtImgAlt from '@/components/TxtImgAlt'
import Footer from '@/components/Footer'

import finsaHydrofugo from '@/lib/images/finsa-hydrofugo.jpg'

import { keyPointsMDF } from '@/lib/data/keyPoints'

const text =
  'We use Medite and Finsa Fibrapan hydrofugo MDF: industry standard moisture-resistant MDF boards that comply with EN 321 and V313 specifications for high-humidity applications. Here are some of it’s key advantages, over solid wood:'

export default function Page() {
  return (
    <>
      <HeroText
        markup={
          'MDF with superpowers: highly-stable, eco-friendly, and cost-effective.'
        }
      />
      <HeroImage src={finsaHydrofugo} />
      <Intro text={text} />
      <TxtImg keyPoints={keyPointsMDF} />
      {/* <TxtImgAlt keyPoints={keyPointsMDF} /> */}
      <Footer />
    </>
  )
}
