'use client'

import Image from 'next/image'

import HeroText from '@/components/HeroText'
import HeroImage from '@/components/HeroImage'

import kitchen from '@/lib/images/kitchen1.jpg'
import kitchenBlue from '@/lib/images/kitchen-blue.jpg'
import mdf from '@/lib/images/mdf.jpg'

import { homeHeroMarkup } from '@/lib/data/data.js'

export default function Home() {
  return (
    <>
      <HeroText markup={homeHeroMarkup} />
      <HeroImage src={kitchen} />
      <section className='px-[20px]'>
        <div className='px-[5vw]'>
          <p className='mt-[100px] mb-[16px] text-[28px] font-normal'>
            The beauty of MDF
          </p>

          <p className='mb-[50px] text-[16px] font-normal'>
            Kind for the planet, and light on your wallet!
          </p>

          <div className='min-h-[100vh]'>
            <div className='relative w-[50%] h-[auto] aspect-square inline-block'>
              <Image fill src={mdf} className='aspect-square object-cover' />
            </div>
            <div className='relative aspect-square h-[auto] w-[50%] inline-block'>
              <Image
                fill
                src={kitchenBlue}
                className='aspect-square object-cover'
              />
            </div>
          </div>
          <div></div>
        </div>
      </section>
    </>
  )
}
