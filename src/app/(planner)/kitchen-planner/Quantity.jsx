'use client'
import { Html } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'

export default function Quantity({ children, angle }) {
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = useState(children)
  const [focus, setFocus] = useState(false)

  // TODO {id, dx, dz}

  const input = useRef(null)

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  const num = +String(angle).slice(0, 5)

  const flip =
    (num < -2.51 && num >= -3.141) || (num > 2.51 && num <= 3.141)
      ? true
      : false

  const style = {
    transform: `rotateX(180deg) rotateZ(${flip ? '180' : '0'}deg)`
  }

  function handleSubmit() {
    setIsVisible(false)
  }

  return (
    <>
      <Html as='div' transform center>
        <div
          onClick={toggleModal}
          style={style}
          className='cursor-pointer mt-[0.5px] px-[4px] text-[5px] w-[max-content] text-center bg-white'
        >
          <div className='hover:scale-110'>
            <span className='text-[5px] inline-block'>
              {children.replace('.', '')}
            </span>
            <span className='text-[4px] inline-block'>&nbsp;mm</span>
          </div>
        </div>
      </Html>
      {isVisible && (
        <Html center>
          <div
            ref={input}
            className={`bg-[#e9e9e9] p-[1rem] text-[16px] shadow-[0px_.1px_5px_rgba(0,0,0,0.2)] w-[max-content] h-[max-content] hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]`}
          >
            <input
              className='bg-[transparent] max-w-[4rem] mb-[10px] px-[2px] block border-solid border-b-[1px] border-black'
              defaultValue={children}
              onChange={(e) => {
                e.target.value
              }}
            />
            <button
              onClick={() => {
                handleSubmit()
              }}
              type='button'
              className='bg-darkBlue w-[100%] text-base text-white px-[1rem] py-[.5rem]'
            >
              Apply
            </button>
          </div>
        </Html>
      )}
    </>
  )

  function handleClickOutside(event) {
    if (input.current && !input.current.contains(event.target)) {
      setIsVisible(false)
    }
  }

  function toggleModal() {
    setIsVisible(!isVisible)
  }
}

// hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]
