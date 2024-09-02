'use client'

import createMarkup from '../helpers/createMarkup.js'

export default function HeroText({ markup }) {
  return (
    <section className='h-[400px] flex items-center px-[37px]'>
      <div
        className='mt-[80px] pl-[60px]'
        dangerouslySetInnerHTML={createMarkup(markup)}
      />
    </section>
  )
}
