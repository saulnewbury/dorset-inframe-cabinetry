import Link from 'next/link'
import Image from 'next/image'
import HeaderText from '@/components/HeaderText'

import { productCategories } from '@/lib/data/productCategories'

export default function Products() {
  return (
    <section className='gutter pt-[5rem] lg:pt-[8rem]'>
      <div className='indent'>
        <HeaderText>Products</HeaderText>
        <div className='grid gap-[1vw] pt-[60px] mb-[60px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-[3vw] md:gap-[2vw] lg:gap-[1vw]'>
          {productCategories.map((p) => {
            return (
              <Link
                key={p.name}
                href={p.url}
                className='relative w-full h-[auto] aspect-square inline-block'
              >
                <div className='absolute left-0 top-0 z-10 transition ease-in-out bg-black/30 lg:bg-black/0 hover:bg-black/50 opacity-100 lg:opacity-0 hover:opacity-100 h-full w-full flex'>
                  <div className='absolute pointer-events-none transition z-20 text-white font-normal flex items-center justify-center w-full h-full'>
                    <span className='p-[10px] text-center'>{p.name}</span>
                  </div>
                </div>

                <Image
                  fill
                  src={p.src}
                  className='object-cover'
                  sizes='(max-width: 479px) 50vw, (max-width: 975px) 33.33vw, 25vw'
                  alt='something'
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
