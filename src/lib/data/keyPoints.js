import moustureResistantMDF from '@/lib/images/moisture-resistant-mdf.jpg'
import mfc from '@/lib/images/mfc.jpg'

import woodchips from '@/lib/images/woodchips.jpg'
import steamyBathroom from '@/lib/images/steamy-bathroom.jpg'
import inframeBlue from '@/lib/images/inframe-blue.jpg'

import bathroomTurquios from '@/lib/images/bathroom-turquios.jpg'
import kitchen1 from '@/lib/images/kitchen1.jpg'
import kitchenLightBlue from '@/lib/images/kitchen-light-blue.jpg'
import bathroomStone from '@/lib/images/bathroom-stone.jpg'
import bathroomGrey from '@/lib/images/bathroom-grey.jpg'
import kitchenGreen from '@/lib/images/kitchen-green.jpg'
import inframeSketch from '@/lib/images/inframe-sketch.jpg'

export const keyPointsMaterials = [
  {
    title: 'Melamine Faced Chipboard (MFC)',
    body: 'MFC is highly versatile material made by bonding melamine resin-impregnated paper to particleboard. We love building with MFC as it offers our clients, durable heat and moisture resistant surfaces, that come in a wide range of colours and textures, making it ideal for creating stylish and modern interiors.',
    src: mfc,
    alt: 'Melamine faced chipboard samples',
    link: 'Read more',
    url: '/about/materials/mfc'
  },
  {
    title: 'Moisture Resistant MDF',
    body: 'MR MDF is engineered by adding special resins during the manufacturing process, enhancing its resistance to humidity and moisture. This property makes MR MDF perfect for areas prone to dampness, such as bathrooms, kitchens, and utility rooms. MR MDF offers a smooth, uniform surface that is easy to paint or laminate, allowing for a high-quality finish. It is also easy to cut and shape, providing versatility for various applications.',
    src: moustureResistantMDF,
    alt: 'Moisture resistant MDF sample',
    link: 'Read more',
    url: '/about/materials/mdf'
  }
]

export const keyPointsMDF = [
  {
    title: 'Eco friendly',
    body: 'MDF can be more environmentally friendly than solid wood since it often uses recycled wood fibres and minimises waste from the manufacturing process. It also reduces the need for logging, helping to conserve natural forests.',
    src: woodchips,
    alt: 'Pile of woodchips ready for MDF production'
  },
  {
    title: 'Highly stable',
    body: 'We use high performance Medite and Hydrofugo MDF, designed to maintain stability in demanding environments, where temperatures and humidity levels fluctuate. This gives it our cabinets a distinct advantage over those built using solid woods that are prone to expanding and shrinking under such conditions.',
    src: steamyBathroom,
    alt: 'Traditional inframe bathroom filled with steam'
  },
  {
    title: 'Cost-Effective',
    body: 'Where ‘eco-friendly’ and ‘stable’ are also cost-effective. MDF is made from wood fibres combined with resin and wax, allowing manufacturers to use waste wood materials. This significantly lowers the cost of production and allows us to deliver high-end cabinetry at a lower cost than companies still using solid wood.',
    src: inframeBlue,
    alt: 'Moisture resistant MDF sample'
  }
]
export const keyPointsInframeCabinetry = [
  {
    title: 'Traditional, timeless & built to last',
    body: 'Inframe cabinetry is often associated with a traditional or classic design, but works beautifully in a modern setting. High-quality, in-frame cabinets tend to be more sustainable in the long run. They are built to last, reducing the need for replacement and contributing to a more sustainable approach to home design.',
    src: kitchen1,
    alt: 'Pile of woodchips ready for MDF production'
  },
  {
    title: 'Form and function',
    body: "Inframe cabinets are not just beautiful, they're functional too. The sturdy construction provides durability, and the design often includes thoughtful touches like high-quality hinges and perfectly aligned doors. This combination of form and function makes the cabinetry not only look good but work well in everyday life.",
    diagram: inframeSketch,
    alt: 'Traditional inframe bathroom filled with steam'
  },
  {
    title: 'Customisation',
    body: "Whether choosing the finish, handles or trim, there's a level of personalisation that allows homeowners to express their individuality. This personalisation can make a kitchen or bathroom truly unique, reflecting the personality and style of those who use it.",
    images: [
      {
        src: bathroomTurquios,
        alt: 'Something',
        grid: { gridColumnStart: '1', gridColumnEnd: '2' }
      },
      {
        src: kitchen1,
        alt: 'Something',
        grid: { gridColumnStart: '2', gridColumnEnd: '4' }
      },
      {
        src: kitchenLightBlue,
        alt: 'Something',
        grid: { gridColumnStart: '1', gridColumnEnd: '3' }
      },
      {
        src: bathroomStone,
        alt: 'Something',
        grid: { gridColumnStart: '3', gridColumnEnd: '4' }
      },
      {
        src: bathroomGrey,
        alt: 'Something',
        grid: { gridColumnStart: '1', gridColumnEnd: '2' }
      },
      {
        src: kitchenGreen,
        alt: 'Something',
        grid: { gridColumnStart: '2', gridColumnEnd: '4' }
      }
    ]
  }
]
