import Image from 'next/image'

export default function HeroImage({ src }) {
  return (
    <div className='min-h-[80vh] relative'>
      <Image
        fill
        priority
        src={src}
        alt={'something'}
        className='object-cover'
      />
    </div>
  )
}
