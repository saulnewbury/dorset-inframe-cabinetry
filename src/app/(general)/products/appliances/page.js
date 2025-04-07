import HeroText from '@/components/HeroText'
import ProductsMini from '@/app/(general)/ProductsMini'
import WeCanSupply from '../../WeCanSupply'
import Footer from '@/components/Footer'

import image from '@/lib/images/rect/caple-appliances.webp'

const markup =
  'We can supply a wide range of appliances. Request a call back via the contact form or on submission of your kitchen design and we will endeavour to get you a competitive price. <br /> <br />Or browse products from the brands below, and add the <br />product code to the list:'

const brands = [
  { name: 'Belling', url: 'https://www.belling.co.uk/en-gb' },
  { name: 'Bosch', url: 'https://www.bosch.co.uk/' },
  { name: 'Caple', url: 'https://www.caple.co.uk/' },
  { name: 'Fisher & Paykel', url: 'https://www.fisherpaykel.com/uk/' },
  { name: 'Neff', url: 'https://www.neff-home.com/uk/' },
  { name: 'Samsung', url: 'https://www.samsung.com/uk/' },
  { name: 'Smeg', url: 'https://shop.smeguk.com/' },
  { name: 'Stoves', url: 'https://www.stoves.co.uk/en-gb' }
]

export default function page() {
  return (
    <>
      <HeroText markup={'Appliances'} />
      <WeCanSupply
        codes={true}
        markup={markup}
        src={image}
        brands={brands}
        color='#e6e5e4'
      />
      <ProductsMini not='Appliances' gridNum={5} />
      <Footer />
    </>
  )
}
