'use client'
import { useState } from 'react'

export default function Categories({ categories, handleClick, selected }) {
  console.log(categories)
  const [submenu, setSubmenu] = useState(null)
  function handleMouseEnter(e) {
    const name = e.currentTarget.dataset.option
    setSubmenu(name)
  }
  function handleMouseLeave() {
    setSubmenu(null)
  }

  return (
    <div
      className={`${
        categories.some((c) => c.subCategories) ? '' : ''
      } pb-16 font-normal flex`}
    >
      {categories.map((cat) => (
        <div
          key={cat}
          data-option={cat}
          className='relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            data-option={`["${cat}", null]`} // top and sub
            onClick={handleClick}
            className={`${
              cat === selected.top ? 'underline' : ''
            } relative mr-5 cursor-pointer hover:underline`}
          >
            {cat}

            {/* Triangle */}
            {submenu === cat && cat.subCategories && (
              <div className='h-[16px] w-[16px] mt-[2px] border-[8px] border-transparent border-b-[#F0F0EE] absolute left-[50%] -translate-x-[%50] -ml-[.5125rem]' />
            )}
          </span>
          {cat === selected.top && selected.sub && (
            <div
              className={`${
                submenu === cat ? 'opacity-0' : 'opacity-100'
              } absolute top-8 pointer-events-none text-[.8rem] text-nowrap`}
            >
              <span>&gt; </span>
              {selected.sub}
            </div>
          )}
          {submenu === cat && cat.subCategories && (
            <div className='absolute text-[.9rem] z-40 w-[max-content] h-[max-content]'>
              <div className='bg-[#F0F0EE] leading-6 mt-[18px] py-5 px-6 shadow-[0_14px_32px_-9px_rgba(0,0,0,0.1)]'>
                <div
                  className='cursor-pointer hover:text-[#919191]'
                  data-option={`["${cat}", null]`} // top and sub
                  onClick={(e) => {
                    handleClick(e)
                    setSubmenu(null)
                  }}
                >
                  All {cat.toLowerCase()}
                </div>
                {cat.subCategories.map((sub, i) => {
                  return (
                    <div
                      key={i}
                      onClick={(e) => {
                        handleClick(e)
                        setSubmenu(null)
                      }}
                      data-option={`["${cat}", "${sub}"]`}
                      className={`${
                        cat === selected.top && selected.sub === sub
                          ? 'text-[#919191]'
                          : ''
                      } cursor-pointer hover:text-[#919191]`}
                    >
                      {sub}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
