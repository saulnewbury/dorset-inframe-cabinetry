'use client'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react'
import { createRoot } from 'react-dom/client'

import ic_close from '@/assets/icons/close.svg'

let activePopup = null

/**
 * Creates a popup instance (initially hidden) in which information about a
 * model element can be shown.
 */
const ItemInfo = forwardRef(({ children }, ref) => {
  const el = useRef(null)
  const root = useRef()

  const show = useCallback(() => {
    if (!el.current) {
      if (activePopup) activePopup.current.hide()
      el.current = document.createElement('div')
      document.body.appendChild(el.current)
      root.current = createRoot(el.current)
      activePopup = ref
    }
  })

  const hide = useCallback(() => {
    if (el.current) {
      document.body.removeChild(el.current)
      root.current = null
      el.current = null
      activePopup = null
    }
  })

  useImperativeHandle(ref, () => ({
    show,
    hide
  }))

  useEffect(() => {
    return hide
  }, [])

  useLayoutEffect(() => {
    root.current?.render(
      <div className='absolute top-24 left-[120px] min-w-[380px] p-4 border border-gray-200 rounded-md shadow-sm bg-white z-50'>
        <div className='text-right'>
          <button onClick={hide}>
            <img src={ic_close.src} alt='Close' className='size-4' />
          </button>
        </div>
        {children}
      </div>
    )
  })

  return null // nothing added to RTF model
})

ItemInfo.displayName = ItemInfo

export default ItemInfo
