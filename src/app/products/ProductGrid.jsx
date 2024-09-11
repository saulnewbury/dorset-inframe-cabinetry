'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProductGrid({ items }) {
  const [selected, setSelected] = useState('All')
  const [filtered, setFiltered] = useState(items)

  const pathname = usePathname()

  console.log(pathname)

  const arr = []
  items.forEach((item) => {
    item.categories.forEach((c) => arr.push(c))
  })
  const categories = arr.filter((item, i) => arr.indexOf(item) === i)

  function handleOnClick(e) {
    const option = e.currentTarget.dataset.option
    const arr = items.filter((o) => o.categories.includes(option))
    setFiltered([...arr])
    setSelected(option)
  }

  return (
    <section className='gutter'>
      <div className='indent'>
        {/* basic filter vs dropdown subCat filter */}
        <div className='pb-8 font-normal'>
          {categories.map((cat, i) => (
            <span
              key={cat}
              data-option={cat}
              className={`${
                cat === selected ? 'underline' : ''
              } mr-5 cursor-pointer hover:underline`}
              onClick={handleOnClick}
            >
              {cat}
            </span>
          ))}
        </div>
        {/* Products */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[4vw] md:gap-[3vw] lg:gap-[2vw] '>
          {filtered.map((item, i) => {
            return (
              <div key={item.name + i} className='flex flex-col'>
                <Link
                  href={pathname + '/' + item.name.toLowerCase()}
                  className='relative aspect-[3/4]'
                >
                  {item.images.map((image, i) => {
                    return i % 2 === 0 ? (
                      <Image
                        // priority
                        key={image.src + i}
                        fill
                        sizes='(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 976px) 33vw, 25vw'
                        src={image.src}
                        className='object-cover'
                        alt={image.alt}
                      />
                    ) : (
                      <Image
                        // priority
                        key={image.src + i}
                        fill
                        sizes='(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 976px) 33vw, 25vw'
                        src={image.src}
                        className='object-cover opacity-0 hover:opacity-100'
                        alt={image.alt}
                      />
                    )
                  })}
                </Link>
                <div className='py-[1rem]'>
                  <Link
                    href={pathname + '/' + item.name.toLowerCase()}
                    // href='#'
                    className='font-medium hover:underline uppercase'
                  >
                    {item.name}
                  </Link>
                  <div>{item.desc}</div>
                  <div className='font-semibold'>{item.price}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
