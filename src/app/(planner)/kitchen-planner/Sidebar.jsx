'use client'
import { Fragment } from 'react'
import SvgIcon from '@/components/SvgIcon'
import toTitleCase from '@/lib/helpers/toTitleCase'

export default function Sidebar({
  menu,
  handleOpen,
  handleShowContent,
  handleContent,
  open,
  showContent
}) {
  return (
    <div className='text-[12px] gutter fixed h-[max-contnet] w-[max-content] z-[200] top-[120px] left-0 flex flex-col justify-between'>
      {menu.map((item, i) => (
        <Fragment key={i}>
          <button
            type='button'
            className={`${
              showContent ? 'pointer-events-none' : ''
            } relative h-[4rem] mb-[1rem] flex flex-col items-center hover:font-medium`}
            onMouseEnter={() => {
              handleOpen(item.name)
            }}
            onMouseLeave={() => {
              handleOpen('')
            }}
          >
            <SvgIcon shape={item.name} />
            <span className='mt-[.5rem]'>{toTitleCase(item.name)}</span>

            {/* Triangle for menu box */}
            {open === item.name && (
              <div className='h-[16px] w-[16px] mt-[10px] border-[8px] border-transparent border-r-[#F0F0EE] absolute left-[45px]' />
            )}
            {/* Triangle for content box */}
            {showContent === item.name && (
              <div className='h-[16px] w-[16px] mt-[10px] border-[8px] border-transparent border-r-white absolute left-[45px]' />
            )}

            {/* Flyout */}
            {open === item.name && (
              <div className='absolute left-[51px] -top-[10.5px] min-w-[7rem]'>
                <div className='bg-blueTint py-[16px] px-[20px] w-full ml-[10px] leading-6 text-left'>
                  <div className='flex gap-4'>
                    {/* Items with variants displayed in a row */}
                    {item.options
                      .filter((option) => Object.hasOwn(option, 'variants'))
                      .map((option, idx) => (
                        <div key={idx} className='group break-inside-avoid'>
                          <h4 className='font-bold'>{option.name}</h4>
                          <ul>
                            {option.variants.map((variant) => (
                              <li
                                key={variant}
                                className='hover:text-[gray] text-nowrap'
                                onClick={() => {
                                  handleOpen('')
                                  handleShowContent(item.name)
                                  handleContent(option, variant)
                                }}
                              >
                                {variant}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>

                  {/* Items without variants displayed in a column */}
                  {item.options.filter(
                    (option) => !Object.hasOwn(option, 'variants')
                  ).length > 0 && (
                    <div className='flex flex-col'>
                      {item.options
                        .filter((option) => !Object.hasOwn(option, 'variants'))
                        .map((option, idx) => (
                          <div
                            key={idx}
                            className='text-nowrap hover:text-[gray]'
                            onClick={() => {
                              handleOpen('')
                              handleShowContent(item.name)
                              handleContent(option)
                            }}
                          >
                            {option.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
