import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// import { useProductList } from './product-list-context'

export default function List({ showList, closeList, items }) {
  const [less, showLess] = useState(false)
  const [more, showMore] = useState(false)
  const listElement = useRef()
  const scrolling = useRef(0)
  // const { productList, removeFromList, clearList } = useProductList()
  const totalPrice = items.reduce((p, i) => p + i.info.price, 0)

  useEffect(updateScroll, [items])

  useEffect(() => {})

  return (
    <>
      {showList && (
        <div className='bg-[#0000003f] h-[100vh] w-[100vw] absolute z-[500] flex justify-end items-center'>
          <div className='w-[650px] bg-[white] text-xl relative h-full'>
            <button
              className=' text-base cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[1.5rem] z-[900]'
              type='button'
              onClick={closeList}
            >
              Close
            </button>
            <div className='pb-10 pt-14 font-bold px-14'>
              Items (estimated total: £{totalPrice})
            </div>
            <div className='relative'>
              {/* {less && (
                <div className='absolute top-0 w-full text-center z-10 text-xs bg-stone-100 opacity-50'>
                  ...more...
                </div>
              )}
              {more && (
                <div className='absolute bottom-0 w-full text-center z-10 text-xs bg-stone-100 opacity-50'>
                  ...more...
                </div>
              )} */}
              <div
                ref={listElement}
                className='text-base h-[calc(100vh-132px)] overflow-y-scroll relative px-14'
                onScroll={debounceScroll}
              >
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className='grid grid-cols-[auto,1fr,4rem] items-center gap-x-4 mb-3 pb-3 border-b-[1px] border-solid border-[#c7c7c7]'
                  >
                    <div className='w-[100px] h-[100px]'>
                      {item.image && (
                        <img
                          src={item.image}
                          alt=''
                          className='h-full object-contain'
                        />
                      )}
                    </div>
                    <div>
                      <div>{item.info.desc}</div>
                      <div>
                        {item.info.width}mm x {item.info.height}mm
                      </div>
                      <div className='text-xs'>
                        x{item.multiple} @ £{item.info.price}
                      </div>
                    </div>
                    <div className='font-bold text-right pr-2'>
                      £{item.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  function debounceScroll() {
    if (scrolling.current) {
      window.clearTimeout(scrolling.current)
    }
    scrolling.current = window.setTimeout(() => {
      scrolling.current = 0
      updateScroll()
    }, 300)
  }

  function updateScroll() {
    if (!listElement.current) return
    const pos = listElement.current.scrollTop
    const h = listElement.current.scrollHeight
    const max = listElement.current.clientHeight
    showLess(pos > 0)
    showMore(h - pos > max)
  }
}
