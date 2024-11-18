import Button from './Button'

export default function Cta({ data }) {
  const { text, link } = data
  return (
    <section className='gutter py-[5rem] lg:py-[8rem] bg-[#FFFEE7]'>
      <div className='indent text-center'>
        <p className='text-[24px] font-normal mb-[2rem]'>{text}</p>
        <div className='flex justify-center'>
          <Button href={link.href}>{link.text}</Button>
        </div>
      </div>
    </section>
  )
}
