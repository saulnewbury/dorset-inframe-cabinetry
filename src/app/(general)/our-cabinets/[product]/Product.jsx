'use client'
import Image from 'next/image'
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext
} from 'react'
import { Select } from '@headlessui/react'
import { ModelContext } from '@/model/context'

export default function Product(item) {
  const { name, desc, price, sizes, options } = item
  const [finish, setFinish] = useState(new Map())
  const [canScroll, setCanScroll] = useState(null)
  const [, dispatch] = useContext(ModelContext)

  const optionsContainer = useRef()
  const shoot = useRef()

  useEffect(() => {
    if (options) {
      const sw = shoot.current.getBoundingClientRect().width
      const ow = optionsContainer.current.getBoundingClientRect().width
      if (ow > sw) setCanScroll(true)
    }
  }, [])

  function addToCart() {
    const { type, variant, style, width } = item
    if (finish.size < options.length) {
      alert(
        `Please select finish option${
          options.length > 1 ? 's' : ''
        } before adding to cart.`
      )
      return
    }
    dispatch({
      id: 'addToCart',
      unit: { type, variant, style, width },
      finish: [...finish.entries()]
    })
    alert('Item added to cart.')
  }

  const images = useMemo(() => {
    return [
      {
        id: item.id + '-front',
        src: `/units/${item.group}/${item.id}-front.webp`,
        alt: 'front view'
      },
      {
        id: item.id + '-side',
        src: `/units/${item.group}/${item.id}-side.webp`,
        alt: 'side view'
      }
    ]
  }, [item])

  return (
    <section className="gutter pt-[210px] pb-[120px]">
      <div className="indent flex md:flex-row flex-col">
        {/* Images */}
        <div className="w-full sm:w-[80%] md:w-[50%] lg:w-[35%] h-[max-content] md:sticky top-[180px]">
          <div className="relative aspect-[3/4] w-full h-[max-content] bg-red-300">
            <Image
              priority
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 976px) 33vw, 25vw"
              src={images[0].src}
              className="object-cover"
              alt={images[0].alt}
            />
            <Image
              priority
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 50vw"
              src={images[1].src}
              className="object-cover opacity-0 hover:opacity-100"
              alt={images[1].alt}
            />
          </div>
        </div>
        {/* Info */}
        <div className="md:ml-[37px] pt-[4vw] w-[60%] grow-0">
          <div className="indent-left">
            {/* Name */}
            <div className="text-[28px] font-normal">{name}</div>
            {/* Description */}
            <div className="mb-[2rem] font-normal">{desc}</div>
            {/* Price */}
            <div className="mb-[.8rem] text-[24px] font-normal">{price}</div>
            {/* Sizes */}
            {sizes && (
              <div className="mb-[2rem]">
                <Select
                  name="status"
                  aria-label="Project status"
                  className="-ml-[3px] mr-[20px] inline-block focus:outline-none focus:underline data-[focus]:outline-blue-500 min-w-[8rem]"
                >
                  {sizes.map((size, i) => (
                    <option key={i} value={size.w + size.h}>
                      {size.w}cm&nbsp;x&nbsp;{size.h}cm
                    </option>
                  ))}
                </Select>
                <span className="font-medium">
                  Choose&nbsp;a&nbsp;different&nbsp;size
                </span>
              </div>
            )}

            {/* Options */}
            {options && (
              <div className="font-medium w-[max-content]">
                {options.map((option, i) => {
                  return (
                    <Fragment key={i}>
                      <div className="mb-[1rem]">{option.instruction}</div>
                      <div
                        ref={shoot}
                        className="overflow-scroll w-[76vw] md:w-[44vw] pb-[13px]"
                      >
                        <div
                          ref={optionsContainer}
                          className="flex w-[max-content] gap-[1vw]"
                        >
                          {option.options.map((o, i) => {
                            return (
                              <div
                                key={i}
                                title={o.name}
                                onClick={() =>
                                  setFinish((prev) => {
                                    const newFinish = new Map(prev)
                                    newFinish.set(option.type, o.name)
                                    return newFinish
                                  })
                                }
                                style={{ backgroundColor: `${o.hex}` }}
                                className={`${
                                  o.name === finish.get(option.type)
                                    ? 'border-[1px] shadow-md shadow-[#606D8E]/50'
                                    : ''
                                } border-black h-auto w-[18vw] md:w-[10vw] aspect-square cursor-pointer`}
                              ></div>
                            )
                          })}
                        </div>
                      </div>
                      {canScroll && (
                        <div className="font-normal text-[.9rem] text-right w-full pr-[12px]">
                          Scroll for more options &gt;
                        </div>
                      )}
                    </Fragment>
                  )
                })}
              </div>
            )}

            <button
              type="button"
              className="font-normal cursor-pointer hover:underline mt-[.5rem]"
              onClick={addToCart}
            >
              Add to cart +
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
