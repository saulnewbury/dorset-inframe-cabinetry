import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'
import Intro from '@/components/Intro'
import TxtImg from '@/components/TxtImg'
import Footer from '@/components/Footer'

import { keyPointsInframeCabinetry } from '@/lib/data/keyPoints'
import bathroomGrey from '@/lib/images/bathroom-grey.jpg'

const text =
  '"Inframe" cabinetry is a style of cabinet construction that offers distinct aesthetic and functional advantages compared to other cabinetry styles. Here’s what makes it special:'
export default function page() {
  return (
    <>
      <HeroText
        markup={
          'Inframe cabinetry: timeless appeal suited to both modern and traditional interiors.'
        }
      />
      <HeroImage src={bathroomGrey} alt='something' />
      <Intro text={text} />
      <TxtImg keyPoints={keyPointsInframeCabinetry} />
      <Footer />
    </>
  )
}
