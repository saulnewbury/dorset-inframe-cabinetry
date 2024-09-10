import Image from 'next/image'

export default function HeroImage({ src, alt = 'something' }) {
  return (
    <div className='min-h-[80vh] relative'>
      <Image fill priority src={src} alt={alt} className='object-cover' />
    </div>
  )
}
