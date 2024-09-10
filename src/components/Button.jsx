import Link from 'next/link'
export default function Button({ children, href, classes, color = '' }) {
  return (
    <div className={`flex ${classes}`}>
      <Link
        className={`${
          color
            ? `hover:border-[${color}] hover:bg-[${color}] hover:text-white`
            : 'hover:border-[2px] hover:px-[41px] hover:py-[11px]'
        } font-normal box-border border-solid border-black border-[1px] px-[42px] py-[12px] rounded-md hover:font-medium`}
        href={href}
      >
        {children}
      </Link>
    </div>
  )
}
