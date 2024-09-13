'use client'
import { useState } from 'react'

export default function Categories({ categories, handleClick, selected }) {
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
          data-option={cat.name}
          key={cat.name}
          className='relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            data-option={`["${cat.name}", null]`} // top and sub
            className={`${
              cat.name === selected.top ? 'underline' : ''
            } relative mr-5 cursor-pointer hover:underline`}
            onClick={handleClick}
          >
            {cat.name}

            {/* Triangle */}
            {submenu === cat.name && cat.subCategories && (
              <div className='h-[16px] w-[16px] mt-[2px] border-[8px] border-transparent border-b-[#F0F0EE] absolute left-[50%] -translate-x-[%50] -ml-[.5125rem]' />
            )}
          </span>
          {cat.name === selected.top && selected.sub && (
            <div
              className={`${
                submenu === cat.name ? 'opacity-0' : 'opacity-100'
              } absolute top-8 pointer-events-none text-[.8rem] text-nowrap`}
            >
              <span>&gt; </span>
              {selected.sub}
            </div>
          )}
          {submenu === cat.name && cat.subCategories && (
            <div className='absolute text-[.9rem] z-40 w-[max-content] h-[max-content]'>
              <div className='bg-[#F0F0EE] mt-[18px] py-5 px-6 shadow-[0_14px_32px_-9px_rgba(0,0,0,0.1)]'>
                <div className='font-medium pb-2'>{cat.name}</div>
                {cat.subCategories.map((sub, i) => {
                  return (
                    <div
                      key={i}
                      onClick={(e) => {
                        handleClick(e)
                        setSubmenu(null)
                      }}
                      data-option={`["${cat.name}", "${sub}"]`}
                      className={`${
                        cat.name === selected.top && selected.sub === sub
                          ? 'text-[#919191]'
                          : ''
                      } leading-6 cursor-pointer`}
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
