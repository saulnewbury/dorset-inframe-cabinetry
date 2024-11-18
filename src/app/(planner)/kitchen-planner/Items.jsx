import Image from 'next/image'

import { useState } from 'react'

export default function Items({ items = [] }) {
  const [hover, setHover] = useState(false)

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[4vw] md:gap-[3vw] lg:gap-[2vw] pb-[2rem] '>
      {items.map((item) => {
        return (
          <div key={item.id} className='flex flex-col'>
            <button className='relative aspect-[3/4]'>
              {item.images.map((image, i) => {
                if (i > 1) return
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
            </button>
            <div className='py-[1rem]'>
              <button className='font-medium hover:underline uppercase'>
                {item.name}
              </button>
              <div>{item.desc}</div>
              <div className='font-semibold'>{item.price}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
