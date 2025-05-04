import Link from 'next/link'
import Image from 'next/image'

import products from '@/lib/data/products'

export default function Products() {
  return (
    <section className="gutter">
      <div className="indent mb-[120px] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 sm:gap-[4vw] md:gap-[3vw] lg:gap-[2vw]">
        {products.map((p, idx) => {
          return idx === 0 ? null : (
            <div key={p.name} className="flex flex-col">
              <Link
                href={p.url}
                className="relative w-[100%] aspect-square inline-block"
              >
                <div className="absolute left-0 top-0 z-10 transition ease-in-out bg-black/30 lg:bg-black/0 hover:bg-black/50 opacity-100 lg:opacity-0 hover:opacity-100 h-full w-full flex">
                  <div className="absolute pointer-events-none transition z-20 text-white font-normal flex items-center justify-center w-full h-full">
                    <span>{p.name}</span>
                  </div>
                </div>

                <Image
                  fill
                  src={p.src}
                  className="object-cover"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 976px) 50vw, 33.33vw"
                  alt="something"
                />
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
