'use client'
import { useContext, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import createMarkup from '@/lib/helpers/createMarkup.js'
import { ModelContext } from '@/model/context'

export default function WeCanSupply({
  isModal = false,
  codes = false,
  markup,
  src,
  brands,
  color = '#EDEAE3'
}) {
  const [code, setCodes] = useState('')
  const [hover, setHover] = useState(false)
  const [, dispatch] = useContext(ModelContext)

  const handleAddCode = () => {
    if (code.trim()) {
      dispatch({
        id: 'addToCart',
        type: 'appliance',
        code: code.trim()
      })
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
      className={`flex py-[6rem] text-[1.2rem] w-full mb-[3rem] ${
        !isModal ? 'gutter' : 'overflow-scroll h-[calc(100%-90.9983px-3rem)]'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="indent w-full">
        <div className="mb-[5rem] max-w-[50rem]">
          <div
            className="mb-[2rem]"
            dangerouslySetInnerHTML={createMarkup(markup)}
          ></div>

          {codes && (
            <>
              <input
                className="border-b border-black bg-transparent w-[300px] block"
                type="text"
                placeholder="Enter product code"
                value={code}
                onChange={(e) => setCodes(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="font-normal cursor-pointer hover:underline mt-[.5rem]"
                onClick={handleAddCode}
              >
                Add to list +
              </button>
              <br />
              <br /> <br />
            </>
          )}
          <div className="text-[1.2rem] mb-[2rem]">
            Some of our favourite brands:
          </div>
        </div>

        <div className="flex justify-between w-full items-center pb-[5rem]">
          <div className="text-[3rem] mt-[2rem]">
            {brands.map((b, idx) => (
              <Link
                key={idx}
                onMouseEnter={() => setHover(b.name)}
                onMouseLeave={() => setHover(false)}
                className="block py-2"
                href={b.url}
                target="_blank"
              >
                {b.name}
                &nbsp;
                <span className={`${hover === b.name ? 'visible' : 'hidden'}`}>
                  &gt;
                </span>
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <Image
              className={isModal ? 'w-[35vw]' : 'w-[45vw]'}
              src={src}
              alt="appliances"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
