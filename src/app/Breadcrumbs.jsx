import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.slice(1).split('/')

  return (
    segments.length > 1 && (
      <div className='fixed font-normal text-[14px] top-[4.5rem] py-[0.8rem] pl-[20px] sm:pl-[37px] w-full bg-white z-40 border-b-[1px] border-solid border-lightGrey'>
        {segments.map((name, i, arr) => {
          const text = name.charAt(0).toUpperCase() + name.slice(1)
          if (i < arr.length - 1) {
            const href = '/' + segments.slice(0, i + 1).join('/')
            return (
              <Link key={i} href={href}>
                <span className='hover:underline'>{text}</span>
                <span className='px-2'>•</span>
              </Link>
            )
          } else {
            // interested last
            return <span key={i}>{text}</span>
          }
        })}
      </div>
    )
  )
}
