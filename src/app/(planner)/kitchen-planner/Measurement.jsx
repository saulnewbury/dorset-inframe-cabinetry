'use client'
import { Html } from '@react-three/drei'

// Condition
// don't show for opposit wall's of the same length
// only show for walls that are at right angles to the scene.

export default function Measurement({ children }) {
  const style = {
    textAlign: 'center',
    width: '24px',
    fontSize: '6px',
    transform: 'rotateX(180deg)',
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  }

  return (
    <Html as='div' transform center>
      <div
        style={style}
        className='px-[2px] hover:text-purple-700 hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]'
      >
        {children}
      </div>
    </Html>
  )
}
