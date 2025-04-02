import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/corston-knob.webp'

const markup =
  'We can supply many different handles and knobs. If you would like us to suggest options or cost your choices please request a call back via the contact form or on submission of your kitchen design and we will endeavour to get you a competitive price.'

const brands = [
  { name: 'Carlisle Brass', url: 'https://www.carlislebrass.com/' },
  { name: 'Corston', url: 'https://www.corston.com/' },
  { name: 'From the Anvil', url: 'https://www.fromtheanvil.co.uk/' },
  { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' }
]

export default function page() {
  return (
    <>
      <HeroText markup={'Handles and Knobs'} />
      <WeCanSupply
        markup={markup}
        src={image}
        brands={brands}
        color='#e2e1e1'
      />
      <ProductsMini not='Handles and knobs' gridNum={5} />
      <Footer />
    </>
  )
}
