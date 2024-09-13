'use client'
import Image from 'next/image'
import { Fragment, useState } from 'react'

export default function Product({ name, price, images, sizes, options }) {
  const [finish, setFinish] = useState([images[0], images[1]])

  function handleClick(name) {
    const arr = images.filter((image) => image.name === name)
    console.log(arr)
    setFinish([...arr])
  }

  function updateList() {}

  return (
    <section className='gutter'>
      <div className='indent flex'>
        {/* Images */}
        {finish && (
          <div className='relative aspect-[3/4] w-[40%] grow'>
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
        {/* Info */}
        <div className='gutter pt-[8vw] w-[60%] grow-0'>
          <div className='indent-left'>
            {/* Price */}
            <div className='text-[28px] font-normal'>{price}</div>
            {/* Name */}
            <div className='mb-[2rem] font-medium'>{name}</div>
            {/* Sizes */}
            {sizes && (
              <div className='mb-[2rem]'>
                <span className='font-normal underline cursor-pointer mr-[32px]'>
                  {sizes[0].w}cm&nbsp;x&nbsp;{sizes[0].h}cm
                </span>{' '}
                <span className='font-medium'>
                  Choose&nbsp;a&nbsp;different&nbsp;size
                </span>
              </div>
            )}
            {/* Options */}
            {options && (
              <div className='font-medium'>
                {options.map((option, i) => {
                  return (
                    <Fragment key={i}>
                      <div className='mb-[1rem]'>{option.instruction}</div>
                      <div className='overflow-scroll w-[44vw] pb-4'>
                        <div className='flex w-[max-content] gap-[1vw] overscroll-none'>
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
                                } border-black h-auto w-[10vw] aspect-square cursor-pointer`}
                              ></div>
                            )
                          })}
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
              </div>
            )}

            <button
              type='button'
              className='font-normal cursor-pointer hover:underline'
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
