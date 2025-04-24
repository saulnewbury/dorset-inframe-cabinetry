import Image from 'next/image'
import HeaderText from '@/components/HeaderText'
import Button from '@/components/Button'

import ourCabinets from '@/lib/images/our-cabinets.jpg'

const images = [
  '/units/base-1-door/base-1-door-400-side.webp',
  '/units/base-1-door/base-1-door-550-front.webp',
  '/units/base-2-door/base-2-door-800-front.webp',
  '/units/base-2-door/base-2-door-800-front.webp',
  '/units/base-2-drawer/base-2-drawer-450-front.webp',
  '/units/base-3-drawer/base-3-drawer-750-front.webp',
  '/units/base-3-drawer/base-3-drawer-750-front.webp',
  '/units/base-4-drawer/base-4-drawer-600-front.webp',
  '/units/base-appliance/base-appliance-636-front.webp',
  '/units/base-belfast-double/base-belfast-double-800-front.webp',
  '/units/base-oven-compact/base-oven-compact-636-front.webp',
  '/units/base-oven-double/base-oven-double-636-front.webp',
  '/units/base-oven-single/base-oven-single-636-front.webp',
  '/units/tall-fridge-50-50/tall-fridge-50-50-600-front.webp',
  '/units/tall-fridge-70-30/tall-fridge-70-30-600-front.webp',
  '/units/tall-oven-compact/tall-oven-compact-636-front.webp'
  // '/units/tall-oven-double/tall-oven-double-636-front.webp',
  // '/units/tall-pantry/tall-pantry-1000-front.webp',
  // '/units/tall-storage-doors/tall-storage-doors-600-front.webp',
  // '/units/tall-storage-drawers/tall-storage-drawers-600-front.webp',
  // '/units/wall-1-door/wall-1-door-400-front.webp',
  // '/units/wall-2-door/wall-2-door-750-front.webp',
  // '/units/wall-2-door/wall-2-door-600-front.webp',
  // '/units/base-freestanding/front-freestanding-under couter.webp'
]
export default function OurCabinets() {
  const randomizedImages = shuffleArray(images)

  function shuffleArray(array) {
    // Create a copy of the original array to avoid modifying it directly
    const shuffled = [...array]

    // Start from the last element and swap it with a randomly selected earlier element
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1))

      // Swap elements at positions i and j
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }

  return (
    <section className='pt-[5rem] lg:pt-[8rem]'>
      <div className='gutter'>
        <div className='indent pt-[5rem] lg:pt-[8rem]'>
          <HeaderText>Our cabinets</HeaderText>
        </div>
        <div className='indent mt-[60px] items-center md:flex md:flex-row mg:justify-center '>
          <div className='md:w-[50%] h-auto aspect-square'>
            <Image src={ourCabinets} alt='' width={798} height={798} />
          </div>

          <div className='relative grid sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-[.5vw] h-full md:w-[50%] basis-[50%] bg-[#e7e7e7] aspect-square'>
            {/* {randomizedImages.map((src, idx) => (
              <Image
                key={idx}
                width={400}
                height={400}
                className={`w-full h-[auto] aspect-square inline-block mix-blend-multiply 
                  ${idx >= 4 && idx < 12 ? 'opacity-0' : ''}
                `}
                src={src}
                alt=''
              />
            ))} */}
            <div className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] pt-[7rem] pb-[7rem] w-full text-center'>
              <p className='pb-[32px] px-[3rem] text-base font-normal text-center md:mb-[1rem]'>
                We specialise in making inframe cabinetry
              </p>
              <Button href='/our-cabinets'>Browse cabinets</Button>
            </div>
          </div>
        </div>

        {/* <div className='text-center pt-[7rem] pb-[7rem]'>
          <Button href='/our-cabinets'>Browse cabinets</Button>
        </div> */}
        {/* button */}
      </div>
    </section>
  )
}
