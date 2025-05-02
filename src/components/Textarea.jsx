/**
 * Text input element with styling.
 */

import { twMerge } from 'tailwind-merge'

export default function Textarea({
  name,
  label,
  value,
  autoComplete,
  onChange = () => {}
}) {
  return (
    <div className='relative pt-4'>
      <span
        className={twMerge(
          'absolute -top-[0.1em] left-0 text-[.7rem] text-[#b0b0b0]',
          !value && 'hidden'
        )}
      >
        {label}
      </span>
      <textarea
        className='w-full outline-none border-b border-darkGrey invalid:border-red invalid:text-red pb-2 mb-4 field-sizing-content bg-transparent'
        style={{ fieldSizing: 'content' }}
        name={name}
        // type={type}
        value={value}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
