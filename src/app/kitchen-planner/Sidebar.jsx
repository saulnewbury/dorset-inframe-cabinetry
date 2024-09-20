'use client'
import { Fragment } from 'react'
import SvgIcon from '@/components/SvgIcon'

import toTitleCase from '@/lib/helpers/toTitleCase'

const shapes = [
  {
    name: 'shape',
    options: [
      {
        name: 'Choose floor plan',
        content: { title: 'Select a general floor plan' }
      }
    ]
  },
  {
    name: 'features',
    options: [
      { name: 'Add wall', content: { title: 'Add a wall' } },
      {
        name: 'Add seperation area',
        content: { title: 'Add an area seperation' }
      },
      {
        name: 'Add sloped ceiling',
        content: { title: 'Add a sloped ceiling' }
      }
    ]
  },
  {
    name: 'openings',
    options: [
      {
        name: 'Add windows',
        content: { title: 'Windows ' }
      },
      { name: 'Add doors', content: { title: 'Doors ' } },
      { name: 'Add wall openings', content: { title: 'Wall openings ' } }
    ]
  },
  {
    name: 'elements',
    options: [
      { name: 'Structures', content: { title: 'Structures ' } },
      { name: 'Electricity', content: { title: 'Electricity ' } },
      { name: 'Heating', content: { title: 'Heating' } },
      { name: 'Ventilation', content: { title: 'Ventilation ' } },
      { name: 'Fittings', content: { title: 'Fittings ' } }
    ]
  }
]

export default function Sidebar({
  handleOpen,
  handleShowContent,
  handleContent,
  open,
  showContent
}) {
  return (
    <div className='text-[12px] gutter fixed h-[max-contnet] w-[max-content] z-[200] top-[120px] left-0 flex flex-col justify-between'>
      {shapes.map((shape, i) => (
        <Fragment key={i}>
          <button
            type='button'
            className={`${
              showContent ? 'pointer-events-none' : ''
            } relative h-[4rem] mb-[1rem] flex flex-col items-center hover:font-medium`}
            onMouseEnter={() => {
              handleOpen(shape.name)
            }}
            onMouseLeave={() => {
              handleOpen('')
            }}
          >
            <SvgIcon shape={shape.name} />
            <span className='mt-[.5rem]'>{toTitleCase(shape.name)}</span>

            {/* Triangle for menu box */}
            {open === shape.name && (
              <div className='h-[16px] w-[16px] mt-[10px] border-[8px] border-transparent border-r-[#F0F0EE] absolute left-[45px]' />
            )}
            {/* Triangle for content box */}
            {showContent === shape.name && (
              <div className='h-[16px] w-[16px] mt-[10px] border-[8px] border-transparent border-r-white absolute left-[45px]' />
            )}

            {/* Flyout */}
            {open === shape.name && (
              <div className='absolute left-[51px] -top-[10.5px]  min-w-[7rem]'>
                <div className='bg-blueTint flex-col py-[16px] px-[20px] w-full ml-[10px] leading-6'>
                  {shape.options.map((option, idx) => {
                    return (
                      <div
                        key={idx}
                        className='text-nowrap text-left hover:text-[#919191]'
                        onClick={() => {
                          handleOpen('')
                          handleShowContent(shape.name)
                          handleContent(option)
                        }}
                      >
                        {option.name}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
