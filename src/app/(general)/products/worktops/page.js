import HeroText from '@/components/HeroText'
import CtaProducts from '@/app/(general)/CtaProducts'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/minerva-worksurface.webp'

const markup =
  'We supply a wide range of work surfaces that include solid surfacing and solid timber, and most popular work top materials which are too numerous to mention here. If you would like us to cost your worktop, please request a call back via the contact form or on submission of your kitchen design and we will endeavour to get you a competitive price.'

const brands = [
  { name: 'Corian', url: 'https://www.corian.uk/' },
  { name: 'Montelli', url: 'https://cdukltd.co.uk/montelli-surfaces/' },
  { name: 'Minerva', url: 'https://www.minervaworksurfaces.co.uk/' },
  { name: 'Cosentino', url: 'https://www.cosentino.com/en-gb/silestone/' }
]

export default function page() {
  return (
    <>
      <HeroText markup={'Worktops'} />
      <WeCanSupply
        markup={markup}
        src={image}
        brands={brands}
        color='#e1e2e2'
      />
      <CtaProducts not='Worktops' gridNum={5} />
      <Footer />
    </>
  )
}
