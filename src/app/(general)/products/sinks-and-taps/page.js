import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '@/app/(general)/WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/franke-taps.webp'

const markup =
  'We supply a wide range of taps and sinks from leading manufacturers which are too numerous to mention here. If you would like us to cost your sink and taps please request a call back via the contact form or on submission of your kitchen design and we will endeavour to get you a competitive price.'

const brands = [
  { name: 'Caple', url: 'https://www.caple.co.uk/' },
  { name: 'Franke', url: 'https://www.franke.com/gb/en/home.html' },
  { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' }
]

export default function page() {
  return (
    <>
      <HeroText markup={'Sinks and Taps'} />
      <WeCanSupply
        markup={markup}
        markupWidth={80}
        src={image}
        brands={brands}
        color='#ebedef'
      />
      <ProductsMini not='Sinks and taps' gridNum={5} />
      <Footer />
    </>
  )
}
