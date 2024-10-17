'use client'
import { Html } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'

// Condition
// don't show for opposit wall's of the same length
// only show for walls that are at right angles to the scene.

export default function Quantity({ children, angle }) {
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = useState(children)
  const [focus, setFocus] = useState(false)

  const input = useRef(null)

  function handleClickOutside(event) {
    if (input.current && !input.current.contains(event.target)) {
      setIsVisible(false)
    }
  }

  function toggleModal() {
    setIsVisible(!isVisible)
  }

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
    textAlign: 'center',
    width: '24px',
    fontSize: '6px',
    transform: `rotateX(180deg) rotateZ(${flip ? '180' : '0'}deg)`,
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  }

  function handleClickOutside(event) {
    if (input.current && !input.current.contains(event.target)) {
      setIsVisible(false)
    }
  }

  return (
    <>
      <Html as='div' transform center>
        <div
          onClick={toggleModal}
          style={style}
          className='px-[2px] hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)] mt-[1px]'
        >
          <span className='mt-[1px] inline-block'>{children}</span>
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
                setShowInput(false)
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
}
