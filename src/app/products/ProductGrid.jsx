'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Categories from './[category]/Categories'

export default function ProductGrid({ products }) {
  const { items, categories } = products

  const [selected, setSelected] = useState({ top: 'All', sub: null })
  const [filtered, setFiltered] = useState(items)

  const pathname = usePathname()

  function handleClick(e) {
    const option = JSON.parse(e.currentTarget.dataset.option)
    console.log(option)

    const arr = items.filter((item) =>
      // get items that include the sub category, or otherwise the main category
      item.categories.includes(option[1] || option[0])
    )
    console.log(arr)
    // const sub = items.filter((item) => item.categories.includes(option[1]))
    setFiltered([...arr])
    setSelected({ top: option[0], sub: option[1] })
  }

  return (
    <section className='gutter'>
      <div className='indent'>
        {/* basic filter vs dropdown subCat filter */}
        <Categories
          categories={categories}
          handleClick={handleClick}
          selected={selected}
        />

        {/* Products */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[4vw] md:gap-[3vw] lg:gap-[2vw] '>
          {filtered.map((item) => {
            return (
              <div key={item.id} className='flex flex-col'>
                <Link
                  href={pathname + '/' + item.name.toLowerCase()}
                  className='relative aspect-[3/4]'
                >
                  {item.images.map((image, i) => {
                    return i % 2 === 0 ? (
                      <Image
                        priority
                        key={image.id}
                        fill
                        sizes='(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 976px) 33vw, 25vw'
                        src={image.src}
                        className='object-cover'
                        alt={image.alt}
                      />
                    ) : (
                      <Image
                        priority
                        key={image.id}
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
