'use client'
import { Html } from '@react-three/drei'

// Condition
// don't show for opposit wall's of the same length
// only show for walls that are at right angles to the scene.

export default function Quantity({ children, angle }) {
  const num = +String(angle).slice(0, 5)
  const flip =
    (num < -2.51 && num >= -3.141) || (num > 2.51 && num <= 3.141)
      ? true
      : false

  const style = {
    textAlign: 'center',
    width: '24px',
    fontSize: '6px',
    // transform: 'rotateX(90deg)',
    // transform: `rotateZ(${flip ? '180' : '180'}deg)`,
    transform: `rotateX(180deg) rotateZ(${flip ? '180' : '0'}deg)`,
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  }

  return (
    <>
      <Html as='div' transform center>
        <div
          style={style}
          className='px-[2px] hover:text-purple-700 hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]'
        >
          {children}
        </div>
      </Html>
      <Html as='div' transform center>
        {/* <div className='bg-[red] px-[2px] hover:text-purple-700 hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]'>
          mmm
        </div> */}
      </Html>
    </>
  )
}
