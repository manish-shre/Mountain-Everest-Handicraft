import { useId } from 'react'

export default function AdminField({ label, value, onChange, type = 'text', rows, placeholder, className = '', hint, maxLength, ariaLabel }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const length = String(value ?? '').length
  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    placeholder,
    maxLength,
    'aria-describedby': hintId,
    'aria-label': label ? undefined : ariaLabel,
  }

  return (
    <div className={className}>
      {label && <label htmlFor={id} className="admin-label">{label}</label>}
      {hint && <p id={hintId} className="admin-help">{hint}</p>}
      {type === 'textarea' ? (
        <textarea {...common} rows={rows ?? 4} className="admin-input resize-y min-h-[5.5rem]" />
      ) : (
        <input {...common} type={type} className="admin-input" />
      )}
      {maxLength && (
        <span className={`block mt-1 text-right text-xs ${length >= maxLength ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
          {length}/{maxLength}
        </span>
      )}
    </div>
  )
}
