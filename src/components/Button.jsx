import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
export default function Button({ children, href, classes, primary, disabled }) {
  return href ? (
    <Link
      className={twMerge(
        `${
          primary
            ? `bg-blue text-white hover:bg-darkBlue border-blue hover:border-darkBlue`
            : 'text-black bg-transparent hover:bg-lightBlue border-black'
        }  text-center font-normal box-border border-solid border-[1px] px-[42px] py-[12px] rounded-md`,
        classes
      )}
      href={href}
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      className={twMerge(
        `${
          disabled
            ? 'hover:bg-transparent text-[grey]'
            : primary
            ? `bg-blue text-white hover:bg-darkBlue border-blue hover:border-darkBlue`
            : 'text-black bg-transparent hover:bg-lightBlue border-black'
        }  text-center font-normal box-border border-solid border-[1px] px-[42px] py-[12px] rounded-md`,
        classes
      )}
    >
      {children}
    </button>
  )
}
