import Link from 'next/link'
import '@/nav.css'

import { useState } from 'react'

export default function Flyout({ items, closeMenu }) {
  const [entered, setEntered] = useState()

  return (
    <div
      className={`${items ? 'flex' : 'hidden'} ${
        entered ? 'text-[grey]' : ''
      } pl-6 flex flex-col absolute right-0 translate-x-[100%] `}
      onMouseEnter={() => setEntered(false)}
    >
      {items.map((item, i) => {
        return (
          <Link
            className='flyout-menu-item'
            key={i}
            href={item.url}
            onClick={closeMenu}
            onMouseEnter={() => setEntered(true)}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
