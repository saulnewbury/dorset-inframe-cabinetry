'use client'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import createMarkup from '@/lib/helpers/createMarkup.js'

export default function WeCanSupply({
  codes = false,
  markup,
  src,
  brands,
  color = '#EDEAE3'
}) {
  const [code, setCodes] = useState('')
  const [productCodes, setProductCodes] = useState([])
  const [hover, setHover] = useState(false)

  const handleAddCode = () => {
    if (code.trim()) {
      setProductCodes([...productCodes, code.trim()])
      setCodes('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCode()
    }
  }

  return (
    <section
      className={`gutter flex py-[6rem] text-[1.2rem]`}
      style={{ backgroundColor: color }}
    >
      <div className='indent w-full'>
        <div className='mb-[5rem] max-w-[50rem]'>
          <div
            className='mb-[2rem]'
            dangerouslySetInnerHTML={createMarkup(markup)}
          ></div>

          {codes && (
            <>
              <input
                className='border-b border-black bg-transparent w-[300px] block'
                type='text'
                placeholder='Enter product code'
                value={code}
                onChange={(e) => setCodes(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type='button'
                className='font-normal cursor-pointer hover:underline mt-[.5rem]'
                onClick={handleAddCode}
              >
                Add to list +
              </button>
              <br />
              <br /> <br />
            </>
          )}
          <div className='text-[1.2rem] mb-[2rem]'>
            Some of our favourite brands:
          </div>
        </div>

        <div className='flex justify-between w-full items-center'>
          <div className='text-[3rem] mt-[2rem]'>
            {brands.map((b, idx) => (
              <Link
                key={idx}
                onMouseEnter={() => setHover(b.name)}
                onMouseLeave={() => setHover(false)}
                className='block py-2'
                href={b.url}
                target='_blank'
              >
                {b.name}
                &nbsp;
                <span className={`${hover === b.name ? 'visible' : 'hidden'}`}>
                  &gt;
                </span>
              </Link>
            ))}
          </div>
          <div className='hidden md:block'>
            <Image className='w-[45vw]' src={src} alt='appliances' />
          </div>
        </div>
      </div>
    </section>
  )
}
