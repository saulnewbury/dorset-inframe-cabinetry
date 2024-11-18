import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { wt } from '@/const'
import { Html } from '@react-three/drei'
import { Text } from 'troika-three-text'
import { BufferGeometry, Vector2 } from 'three'
import { extend, useThree } from '@react-three/fiber'

extend({ Text }, () => {})

export default function DimensionLine({
  from,
  to,
  value,
  isFlip = false,
  onChange = () => {}
}) {
  const [isEdit, setEdit] = useState(false)
  const [hover, setHover] = useState(false)
  const input = useRef()
  const form = useRef()
  const troikaMesh = useRef()
  const buffer = useMemo(
    () =>
      new BufferGeometry().setFromPoints([
        new Vector2(from, -wt / 2),
        new Vector2(from, wt / 2),
        new Vector2(from, 0),
        new Vector2(to, 0),
        new Vector2(to, -wt / 2),
        new Vector2(to, wt / 2)
      ]),
    [from, to]
  )
  const invalidate = useThree(({ invalidate }) => invalidate)

  useLayoutEffect(
    () =>
      void troikaMesh.current.sync(() => {
        invalidate()
      })
  )

  useEffect(() => {
    function clickOutside(ev) {
      if (isEdit) {
        const p = ev.target.closest('form')
        if (!p || p !== form.current) setEdit(false)
      }
    }
    window.addEventListener('click', clickOutside)
    return () => window.removeEventListener('click', clickOutside)
  }, [isEdit])

  return (
    <group position={[0, 3, (-wt * 3) / 1.5]} rotation-x={Math.PI / -2}>
      <line geometry={buffer}>
        <lineBasicMaterial color='#6B6B6B' />
      </line>
      <mesh rotation-z={isFlip ? Math.PI : 0} position-z={0.01}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial color='#fff' toneMapped={false} />
      </mesh>
      <text
        ref={troikaMesh}
        text={value.toFixed(2) + 'm'}
        color='black'
        fontSize={hover ? 0.17 : 0.16}
        position-y={isFlip ? -wt / 1.3 : wt / 1.3}
        position-z={0.02}
        anchorX='center'
        rotation-z={isFlip ? Math.PI : 0}
        onClick={() => setEdit(true)}
        onPointerOver={() => {
          setCursor('pointer')
          setHover(true)
        }}
        onPointerOut={() => {
          setCursor('auto')
          setHover(false)
        }}
      />
      {isEdit && (
        <Html position={[0, wt, 0]}>
          <form
            ref={form}
            className={`bg-[#e9e9e9] p-[1rem] text-[16px] shadow-[0px_.1px_5px_rgba(0,0,0,0.2)] w-[max-content] h-[max-content] hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]`}
            onSubmit={changeLength}
          >
            {/* <span>Set length:</span> */}
            <div className='border-solid border-b-[1px] border-black  mb-[10px] px-[2px]'>
              <input
                ref={input}
                type='number'
                step='0.01'
                min='1.00'
                max='9.99'
                defaultValue={value.toFixed(2)}
                required
                className='invalid:text-red-600 bg-[transparent]  '
              />
            </div>
            <button
              type='submit'
              className='bg-darkBlue w-[100%] text-base text-white px-[1rem] py-[.5rem]'
            >
              Ok
            </button>
          </form>
        </Html>
      )}
    </group>
  )

  function setCursor(kind) {
    document.body.style.cursor = kind
  }

  function changeLength(ev) {
    ev.preventDefault()
    onChange(parseFloat(input.current.value))
    setEdit(false)
  }
}

//  <form
//             onSubmit={handleSubmit}
//             ref={input}
//             className={`bg-[#e9e9e9] p-[1rem] text-[16px] shadow-[0px_.1px_5px_rgba(0,0,0,0.2)] w-[max-content] h-[max-content] hover:shadow-[0px_.1px_5px_rgba(0,0,0,0.2)]`}
//           >
//             <div className='border-solid border-b-[1px] border-black  mb-[10px] px-[2px]'>
//               <input
//                 className='bg-[transparent] w-[max-content] max-w-[3rem]'
//                 defaultValue={value}
//               />
//               <span className='text-[10px]'>mm</span>
//             </div>
//             <button
//               type='submit'
//               className='bg-darkBlue w-[100%] text-base text-white px-[1rem] py-[.5rem]'
//             >
//               Apply
//             </button>
//           </form>
// </Html>
