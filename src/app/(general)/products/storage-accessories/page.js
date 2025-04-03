import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/vauth-sagel-kitchen.webp'

const markup =
  'We can supply many different styles and sizes of pull out larders, bins and corner storage for your kitchen. If you would like us to suggest options or cost your choices please request a call back via the contact form or on submission of your kitchen design and we will endeavour to get you a competitive price.'

const brands = [
  { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' },
  { name: 'Reason', url: 'https://www.raisonhome.com/en-gb/' },
  { name: 'Vauth-Sagel', url: 'https://vauth-sagel.com/gb/en' }
]

export default function page() {
  return (
    <>
      <HeroText markup={'Storage and Accessories'} />
      <WeCanSupply
        markup={markup}
        markupWidth={80}
        src={image}
        brands={brands}
        color='#eae4dc'
      />
      <ProductsMini not='Storage accessories' gridNum={5} />
      <Footer />
    </>
  )
}
