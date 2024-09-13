'use client'

import createMarkup from '@/lib/helpers/createMarkup.js'

export default function HeroText({ markup, desc = null }) {
  return (
    <section className='gutter h-[400px] flex items-center'>
      <div className='max-w-[60rem] indent mt-[80px]'>
        <div
          className='text-[24px] lg:text-[28px] leading-[32px] lg:leading-[37px] font-normal'
          dangerouslySetInnerHTML={createMarkup(markup)}
        />
        {desc && <div className='mt-[.8rem]'>{desc}</div>}
      </div>
    </section>
  )
}
