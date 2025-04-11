import caple from '@/lib/images/rect/caple-appliances.webp'
import corston from '@/lib/images/rect/corston-knob.webp'
import minerva from '@/lib/images/rect/sink-and-taps-minerva.webp'
import vauth from '@/lib/images/rect/vauth-sagel-kitchen.webp'

export const weSupplyAppliances = {
  codes: true,
  src: caple,
  color: '#e6e5e4',
  markup:
    'We can supply a wide range of appliances. Speak to one of our team or use the contact form and we will endeavour to get you a competitive price. <br /> <br />Or browse products from the brands below, and add the <br />product code to the list:',
  brands: [
    { name: 'Belling', url: 'https://www.belling.co.uk/en-gb' },
    { name: 'Bosch', url: 'https://www.bosch.co.uk/' },
    { name: 'Caple', url: 'https://www.caple.co.uk/' },
    { name: 'Fisher & Paykel', url: 'https://www.fisherpaykel.com/uk/' },
    { name: 'Neff', url: 'https://www.neff-home.com/uk/' },
    { name: 'Samsung', url: 'https://www.samsung.com/uk/' },
    { name: 'Smeg', url: 'https://shop.smeguk.com/' },
    { name: 'Stoves', url: 'https://www.stoves.co.uk/en-gb' }
  ]
}

export const weSupplyHandlesAndKnobs = {
  markup:
    'We can supply many different handles and knobs. If you would like us to suggest options or cost your choices speak to a member of our team or use the contact form and we will endeavour to get you a competitive price.',
  src: corston,
  color: '#e2e1e1',
  brands: [
    { name: 'Carlisle Brass', url: 'https://www.carlislebrass.com/' },
    { name: 'Corston', url: 'https://www.corston.com/' },
    { name: 'From the Anvil', url: 'https://www.fromtheanvil.co.uk/' },
    { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' }
  ]
}

export const weSupplySinksAndTaps = {
  markupWidth: 80,
  src: minerva,
  color: '#eeece9',
  markup:
    'We supply a wide range of taps and sinks from leading manufacturers which are too numerous to mention here. If you would like us to cost your sink and taps speak to a member of our team or use the contact form and we will endeavour to get you a competitive price.',
  brands: [
    { name: 'Caple', url: 'https://www.caple.co.uk/' },
    { name: 'Franke', url: 'https://www.franke.com/gb/en/home.html' },
    { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' }
  ]
}

export const weSupplyStorageAndAccessories = {
  markupWidth: 80,
  color: '#eae4dc',
  src: vauth,
  markup:
    'We can supply many different styles and sizes of pull out larders, bins and corner storage for your kitchen. If you would like us to suggest options or cost your choices speak to a member of our time or use the contact form and we will endeavour to get you a competitive price.',
  brands: [
    { name: 'Hafele', url: 'https://www.hafele.co.uk/en/' },
    { name: 'Reason', url: 'https://www.raisonhome.com/en-gb/' },
    { name: 'Vauth-Sagel', url: 'https://vauth-sagel.com/gb/en' }
  ]
}
