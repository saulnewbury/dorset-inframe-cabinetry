'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import Categories from './[category]/Categories'
import Categories from './Categories'

export default function ProductGrid({ products }) {
  const { items, categories } = products

  const [hover, setHover] = useState(false)
  const [selected, setSelected] = useState({ top: 'All', sub: null })
  const [filtered, setFiltered] = useState(items)

  const pathname = usePathname()

  function handleClick(e) {
    const option = JSON.parse(e.currentTarget.dataset.option)

    // check each item and return only those that that include the sub category, or otherwise the main category
    let arr

    // if subcategory is selected check each item to see if
    // it exists along side the main category and return item if true
    if (option[1]) {
      arr = items.filter((item) => {
        const subExists = item.categories.includes(option[1])
        const topExists = item.categories.includes(option[0])
        if (subExists && topExists) return item
      })
      // if main category is selected check each item's list of categories
      // to see if it exists and return true if it does.
    } else {
      arr = items.filter((item) => {
        const topExists = item.categories.includes(option[0])
        if (topExists) return item
      })
    }

    // console.log(arr)

    setFiltered([...arr])
    setSelected({ top: option[0], sub: option[1] })
  }

  return (
    <section className='gutter'>
      <div className='indent'>
        {/* basic filter vs dropdown subCat filter */}
        {filtered ? (
          <>
            <Categories
              categories={categories}
              handleClick={handleClick}
              selected={selected}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[4vw] md:gap-[3vw] lg:gap-[2vw] '>
              {filtered.map((item) => {
                const href =
                  pathname + '/' + item.name.toLowerCase().split(' ').join('-')
                return (
                  <div key={item.id} className='flex flex-col'>
                    <Link href={href} className='relative aspect-[3/4]'>
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
                            className={`${
                              hover ? 'hover:opacity-100' : ''
                            } object-cover opacity-0`}
                            onMouseMove={() => {
                              if (hover) return
                              setHover(true)
                            }}
                            onMouseOut={() => setHover(false)}
                            alt={image.alt}
                          />
                        )
                      })}
                    </Link>
                    <div className='py-[1rem]'>
                      <Link
                        href={href}
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
          </>
        ) : (
          <span>No products yet</span>
        )}
      </div>
    </section>
  )
}
