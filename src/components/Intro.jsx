export default function Intro({ text }) {
  return (
    <section className='gutter'>
      <div className='indent py-[6rem]'>
        <p className='font-normal text-pretty'>{text}</p>
      </div>
    </section>
  )
}
