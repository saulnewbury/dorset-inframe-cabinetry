export default function Section({ children, classes }) {
  return (
    <section className={`px-[20px] pt-[120px] ${classes}`}>
      <div className='md:px-[5vw]'>{children}</div>
    </section>
  )
}
