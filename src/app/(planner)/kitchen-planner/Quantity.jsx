'use client'
import { Html } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import { radToDeg } from 'three/src/math/MathUtils'

const noop = () => {}

export default function Quantity({ children, angle, onChange = noop }) {
  const [isVisible, setIsVisible] = useState(false)

  const value = String(children * 1000).slice(0, 4)

  const input = useRef(null)

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  useEffect(() => {
    console.log(angle)
  }, [angle])

  const num = +String(angle).slice(0, 5)

  const flip =
    (num < -2.51 && num >= -3.141) || (num > 2.51 && num <= 3.141)
      ? true
      : false

  const style = {
    transform: `rotateZ(${
      flip ? radToDeg(angle) + 180 : radToDeg(angle)
    }deg) translateY(-10%)`
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const re = /^\d+(?:.\d{0,3})?$/
    const v = input.current.querySelector('input').value / 1000
    if (!re.test(v)) return
    onChange(parseFloat(v))
    setIsVisible(false)
  }

  return (
    <>
      <Html
        center
        className='h-[max-content] w-[max-content pointer-events-none'
      >
        <div
          style={style}
          onClick={toggleModal}
          className='cursor-pointer px-[7px] w-[max-content] h-[max-content] text-center bg-white pointer-events-auto'
        >
          <div className='hover:scale-110'>
            <span className='text-[12px] inline-block'>{value}</span>
            <span className='text-[9px] inline-block'>&nbsp;mm</span>
          </div>
        </div>
      </Html>
      {isVisible && (
        <Html center>
          <form
            onSubmit={handleSubmit}
            ref={input}
            className={`bg-[#e9e9e9] p-[1rem] text-[16px] shadow-[0px_.1px_5px_rgba(0,0,0,0.2)] w-[max-content] h-[max-content] hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]`}
          >
            <div className='border-solid border-b-[1px] border-black  mb-[10px] px-[2px]'>
              <input
                className='bg-[transparent] w-[max-content] max-w-[3rem]'
                defaultValue={value}
              />
              <span className='text-[10px]'>mm</span>
            </div>
            <button
              type='submit'
              className='bg-darkBlue w-[100%] text-base text-white px-[1rem] py-[.5rem]'
            >
              Apply
            </button>
          </form>
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
