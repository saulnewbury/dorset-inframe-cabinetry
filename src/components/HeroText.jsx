'use client'

import createMarkup from '@/lib/helpers/createMarkup.js'

export default function HeroText({ markup }) {
  return (
    <section className='gutter h-[400px] flex items-center'>
      <div
        className='max-w-[60rem] indent mt-[80px] text-[24px] lg:text-[28px] leading-[32px] lg:leading-[37px] font-normal'
        dangerouslySetInnerHTML={createMarkup(markup)}
      />
    </section>
  )
}
