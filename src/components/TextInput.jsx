/**
 * Text input element with styling.
 */

import { twMerge } from 'tailwind-merge'

export default function TextInput({
  name,
  label,
  type = 'text',
  value,
  autoComplete,
  pattern,
  required = false,
  onChange = () => {}
}) {
  return (
    <div className="relative pt-4">
      <span
        className={twMerge(
          'absolute -top-1 left-0 text-xs text-[#b0b0b0]',
          !value && 'hidden'
        )}
      >
        {label}
      </span>
      <input
        className="w-full outline-none border-b border-darkGrey invalid:border-red invalid:text-red pb-[.3em] mb-4 bg-transparent"
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={label}
        pattern={pattern}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
