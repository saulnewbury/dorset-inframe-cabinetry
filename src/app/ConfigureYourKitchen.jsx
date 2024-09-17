'use client'

import { twMerge } from 'tailwind-merge'

import Button from '@/components/Button'
import Image from 'next/image'
import kitchenSketch from '@/lib/images/kitchen-sketch.jpg'

export default function ConfigureYourKitchen({ classes = '' }) {
  return (
    <section
      className={twMerge(
        'gutter w-[100vw] h-[100vh] max-h-[800px] md:my-[60px]',
        classes
      )}
    >
      <div className='md:px-[5rem] h-full max-h-[800px] max-w-[800px] relative top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
        <div className='absolute h-full w-full top-0 left-0'>
          <Image src={kitchenSketch} fill className='object-cover opacity-50' />
        </div>
        <div className='absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center '>
          <h1 className='header mb-[2rem]'>Design your kitchen today</h1>
          <Button>Kitchen Planner</Button>
        </div>
      </div>
    </section>
  )
}
