import Image from 'next/image'
import Link from 'next/link'

// images
import kitchenBlue from '@/lib/images/kitchen-blue.jpg'
import mdf from '@/lib/images/mdf.jpg'

import Section from '@/components/Section'
import HeaderText from '@/components/HeaderText'

export default function MaterialsWeLove() {
  return (
    <Section>
      <HeaderText className='mb-[16px] text-[28px] font-normal'>
        Kind on the planet
      </HeaderText>

      <p className='mb-[50px] text-[16px] font-normal'>
        ...light on your wallet!
      </p>

      <div>
        <div className='relative w-[50%] h-[auto] aspect-square inline-block'>
          <Image
            fill
            src={mdf}
            className='object-cover'
            alt='something'
            sizes='40vw'
          />
        </div>
        <div className='relative aspect-square h-[auto] w-[50%] inline-block'>
          <Image
            fill
            src={kitchenBlue}
            className='object-cover'
            alt='something'
            sizes='40vw'
          />
        </div>
      </div>

      <p className='pt-[50px] pb-[32px] text-base font-normal text-center'>
        Why MDF and MFC are our materials of choice...
      </p>

      <div className='text-center flex justify-center'>
        <Link
          className='font-normal box-border border-solid border-black border-[1px] px-[42px] py-[12px] rounded-md hover:border-[#606D8E]  hover:font-medium hover:bg-[#606D8E] hover:text-white mr-[20px]'
          href='/about/materials'
        >
          Read more
        </Link>
      </div>
    </Section>
  )
}
