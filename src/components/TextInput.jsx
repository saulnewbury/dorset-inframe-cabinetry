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
  onChange = () => {}
}) {
  return (
    <div className="relative pt-4">
      <span
        className={twMerge(
          'absolute top-0 left-0 text-xs text-darkGrey',
          !value && 'hidden'
        )}
      >
        {label}
      </span>
      <input
        className="w-full outline-none border-b border-darkGrey invalid:border-red invalid:text-red"
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
