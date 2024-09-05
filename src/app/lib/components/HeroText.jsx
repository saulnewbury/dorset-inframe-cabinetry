'use client'

import createMarkup from '../helpers/createMarkup.js'

export default function HeroText({ markup }) {
  return (
    <section className='h-[400px] flex items-center px-[20px] sm:px-[37px]'>
      <div
        className='mt-[80px] md:px-[5vw] text-[24px] lg:text-[28px] leading-[32px] lg:leading-[37px] font-normal'
        dangerouslySetInnerHTML={createMarkup(markup)}
      />
    </section>
  )
}
