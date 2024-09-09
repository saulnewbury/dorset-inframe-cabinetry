import '@/app/global.css'

export default function Section({ children, classes }) {
  return (
    <section className={`px-[20px] pt-[120px] ${classes}`}>
      <div className='inner-container'>{children}</div>
    </section>
  )
}
