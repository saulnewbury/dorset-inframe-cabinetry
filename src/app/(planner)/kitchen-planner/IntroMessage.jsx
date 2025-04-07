import { useState } from 'react'

import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'

export default function IntroMessage({ show = true }) {
  const [showIntroMessage, setIntroMessage] = useState(show) // intro message

  return (
    <>
      {/* Intro message */}
      {showIntroMessage && (
        <div className="bg-[#0000003f] h-[100vh] w-[100vw] absolute z-[500] flex justify-center items-center">
          <div className="max-w-[800px] bg-[white] text-xl px-24 py-20 relative">
            <button
              className="cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[2rem] z-[900]"
              type="button"
              onClick={() => {
                setIntroMessage(false)
              }}
            >
              <SvgIcon shape="close" />
            </button>
            <div className="text-wrap mb-[3rem]">
              <span className="mb-[2rem] inline-block">
                We supply a wide range of:
              </span>
              <ul className="mb-[2rem]">
                <li className="font-bold mb-[.5rem]"> Worktops</li>
                <li className="font-bold mb-[.5rem]"> Sinks & taps</li>
                <li className="font-bold mb-[.5rem]"> Handles & knobs</li>
                <li className="font-bold"> Appliances</li>
              </ul>
              <span className="inline-block">
                After submission a member of our team will contact you to
                discuss all available options.
              </span>
            </div>

            <div
              onClick={() => {
                setIntroMessage(false)
              }}
            >
              <Button primary>Start designing</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
