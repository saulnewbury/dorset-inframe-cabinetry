import Image from 'next/image'
import Button from './Button'

export default function TxtImg({ keyPoints }) {
  return keyPoints.map((point, i) => (
    <section
      key={i}
      className={`flex flex-col-reverse ${
        i % 2 == 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } `}
    >
      <div className='gutter lg:w-[50vw] bg-[#F0F0EE] flex items-center justify-center py-[5rem] lg:aspect-square'>
        <div className='indent'>
          <h3 className='font-semibold mb-[1rem]'>{point.title}</h3>
          <p className='mb-[2rem]'>{point.body}</p>
          {point.link && <Button href={point.url}>{point.link}</Button>}
        </div>
      </div>

      {/* Point can include an Image. a Diagram or a grid of images */}
      {point.src && (
        <div className='relative lg:w-[50%] h-[100vh] lg:h-auto'>
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
        <div className='relative lg:w-[50%] h-[100vh] lg:h-auto p-[5rem]'>
          <Image src={point.diagram} className='object-cover' alt={point.alt} />
        </div>
      )}
      {point.images && (
        <div className='aspect-square lg:w-[50vw]'>
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
                <div key={i} className='relative bg-green-500' style={img.grid}>
                  <Image
                    fill
                    sizes='20vw'
                    src={img.src}
                    className='object-cover'
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  ))
}
