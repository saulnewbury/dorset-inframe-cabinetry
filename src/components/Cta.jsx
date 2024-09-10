import Button from './Button'

export default function Cta({ data }) {
  const { text, link } = data
  console.log(link)
  return (
    <section className='gutter py-[5rem] lg:py-[8rem] bg-[#FFFEE7]'>
      <div className='indent text-center'>
        <p className='text-[24px] font-normal'>{text}</p>
        <Button href={link.href} classes='mt-[2rem] justify-center'>
          {link.text}
        </Button>
      </div>
    </section>
  )
}
