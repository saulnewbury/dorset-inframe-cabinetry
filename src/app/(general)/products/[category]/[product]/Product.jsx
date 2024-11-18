'use client'
import Image from 'next/image'
import { Fragment, useState, useEffect, useRef } from 'react'
import { Select } from '@headlessui/react'

export default function Product({ name, price, images, sizes, options, desc }) {
  const [finish, setFinish] = useState([images[0], images[1]])
  const [canScroll, setCanScroll] = useState(null)

  const optionsContainer = useRef()
  const shoot = useRef()

  useEffect(() => {
    if (options) {
      const sw = shoot.current.getBoundingClientRect().width
      const ow = optionsContainer.current.getBoundingClientRect().width
      if (ow > sw) setCanScroll(true)
    }
  }, [])

  function handleClick(name) {
    const arr = images.filter((image) => image.name === name)
    setFinish([...arr])
  }

  function updateList() {}

  return (
    <section className='gutter pt-[210px] pb-[120px]'>
      <div className='indent flex md:flex-row flex-col'>
        {/* Images */}
        <div className='w-full sm:w-[80%] md:w-[50%] lg:w-[35%] h-[max-content] md:sticky top-[180px]'>
          {finish && (
            <div className='relative aspect-[3/4] w-full h-[max-content] bg-red-300'>
              <Image
                priority
                fill
                sizes='(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 976px) 33vw, 25vw'
                src={finish[0].src}
                className='object-cover'
                alt={finish[0].alt}
              />
              <Image
                priority
                fill
                sizes='(max-width: 480px) 100vw, (max-width: 768px) 50vw, 50vw'
                src={finish[1].src}
                className='object-cover opacity-0 hover:opacity-100'
                alt={finish[1].alt}
              />
            </div>
          )}
        </div>
        {/* Info */}
        <div className='md:ml-[37px] pt-[4vw] w-[60%] grow-0'>
          <div className='indent-left'>
            {/* Name */}
            <div className='text-[28px] font-normal'>{name}</div>
            {/* Description */}
            <div className='mb-[2rem] font-normal'>{desc}</div>
            {/* Price */}
            <div className='mb-[.8rem] text-[24px] font-normal'>{price}</div>
            {/* Sizes */}
            {sizes && (
              <div className='mb-[2rem]'>
                <Select
                  name='status'
                  aria-label='Project status'
                  className='-ml-[3px] mr-[20px] inline-block focus:outline-none focus:underline data-[focus]:outline-blue-500 min-w-[8rem]'
                >
                  {sizes.map((size, i) => (
                    <option key={i} value={size.w + size.h}>
                      {size.w}cm&nbsp;x&nbsp;{size.h}cm
                    </option>
                  ))}
                </Select>
                <span className='font-medium'>
                  Choose&nbsp;a&nbsp;different&nbsp;size
                </span>
              </div>
            )}

            {/* Options */}
            {options && (
              <div className='font-medium w-[max-content]'>
                {options.map((option, i) => {
                  return (
                    <Fragment key={i}>
                      <div className='mb-[1rem]'>{option.instruction}</div>
                      <div
                        ref={shoot}
                        className='overflow-scroll w-[76vw] md:w-[44vw] pb-[13px]'
                      >
                        <div
                          ref={optionsContainer}
                          className='flex w-[max-content] gap-[1vw]'
                        >
                          {option.options.map((o, i) => {
                            return (
                              <div
                                key={i}
                                onClick={() => {
                                  handleClick(o.name)
                                }}
                                style={{ backgroundColor: `${o.hex}` }}
                                className={`${
                                  o.name === finish[0].name
                                    ? 'border-[1px]'
                                    : ''
                                } ${
                                  // FOR DEMO PERPOSES
                                  i > 1 ? 'pointer-events-none' : ''
                                } border-black h-auto w-[18vw] md:w-[10vw] aspect-square cursor-pointer`}
                              ></div>
                            )
                          })}
                        </div>
                      </div>
                      {canScroll && (
                        <div className='font-normal text-[.9rem] text-right w-full pr-[12px]'>
                          Scroll for more options &gt;
                        </div>
                      )}
                    </Fragment>
                  )
                })}
              </div>
            )}

            <button
              type='button'
              className='font-normal cursor-pointer hover:underline mt-[.5rem]'
              onClick={updateList}
            >
              Add to list +
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
