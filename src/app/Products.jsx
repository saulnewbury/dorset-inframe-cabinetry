import Link from 'next/link'
import Image from 'next/image'

import Section from '@/components/Section'
import HeaderText from '@/components/HeaderText'

import { productCategories } from '@/lib/data/productCategories'

export default function Products() {
  return (
    <Section>
      <HeaderText>Products</HeaderText>
      <div className='flex gap-[1vw] pt-[60px] mb-[120px] flex-wrap lg:flex-nowrap'>
        {productCategories.map((p) => {
          return (
            <Link
              href={p.url}
              className='relative w-[49.321%] sm:w-[32.5432%] lg:w-[20%] h-[auto] aspect-square inline-block'
            >
              <div className='absolute left-0 top-0 z-10 transition ease-in-out bg-black/30 lg:bg-black/0 hover:bg-black/50 opacity-100 lg:opacity-0 hover:opacity-100 h-full w-full flex'>
                <div className='absolute pointer-events-none transition z-20 text-white font-normal flex items-center justify-center w-full h-full'>
                  <span>{p.name}</span>
                </div>
              </div>

              <Image fill src={p.src} className='object-cover' />
            </Link>
          )
        })}
      </div>
    </Section>
  )
}
