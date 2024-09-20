import Link from 'next/link'
import Image from 'next/image'
import Button from './Button'

export default function TxtImg({ keyPoints }) {
  return (
    <section className='gutter'>
      <div className='indent'>
        {keyPoints.map((point, i) => (
          <div
            key={i}
            className={`flex flex-col-reverse lg:gap-10 lg:mb-[8rem]  ${
              i % 2 == 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            } `}
          >
            <div className='lg:w-[50vw] flex items-center justify-center py-[5rem]'>
              <div>
                <h3 className='font-semibold mb-[1rem]'>{point.title}</h3>
                <p className='mb-[3rem]'>{point.body}</p>
                {point.link && <Button href={point.url}>{point.link}</Button>}
              </div>
            </div>

            {/* Point can include an Image. a Diagram or a grid of images */}
            {point.src && (
              <div className='relative lg:w-[50vw] h-[60vh] lg:h-auto aspect-[3/4]'>
                <Image
                  src={point.src}
                  fill
                  sizes='50vw'
                  className='object-cover'
                  alt={point.alt}
                />
              </div>
            )}
            {point.diagram && (
              <div className='relative lg:w-[50%] h-[60vh] lg:h-auto aspect-[3/4]'>
                <Image
                  src={point.diagram}
                  className='object-cover'
                  alt={point.alt}
                />
              </div>
            )}
            {point.images && (
              <div className='lg:w-[50vw] aspect-[3/4] h-[80vh] lg:h-auto'>
                <div
                  className='h-full w-full gap-[.5vw]'
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridTemplateRows: '1fr 1fr 1fr'
                  }}
                >
                  {point.images.map((img, i) => {
                    return (
                      <div
                        key={i}
                        className='relative bg-green-500'
                        style={img.grid}
                      >
                        <Image
                          fill
                          sizes='20vw'
                          src={img.src}
                          className='object-cover'
                          alt={img.alt}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
