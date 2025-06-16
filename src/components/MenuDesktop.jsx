import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import Link from 'next/link'
import SubmenuDesk from './SubmenuDesk'

export default function MenuDesktop({ menu = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="links h-full flex items-center">
      {menu.map((item, i) => {
        return (
          <div
            key={i}
            className="link-container h-full"
            onMouseEnter={() => setIsOpen(item.name)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <Link
              className={`link ${
                pathname.startsWith(item.url) ? 'active' : ''
              } cursor-pointer mr-[36px] h-full flex items-center relative`}
              href={item.url}
            >
              <span>{item.name}</span>
            </Link>
            {item.submenu && (
              <SubmenuDesk
                className="dropdown"
                items={item.submenu}
                isOpen={item.name === isOpen} // compares instance url with state url
                closeMenu={() => setIsOpen(false)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
