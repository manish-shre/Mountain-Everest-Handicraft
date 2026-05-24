export default function AdminField({ label, value, onChange, type = 'text', rows, placeholder, className = '', hint }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="admin-label">{label}</span>}
      {hint && <p className="text-sm text-gray-600 mb-2 -mt-1">{hint}</p>}
      {type === 'textarea' ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows ?? 4}
          placeholder={placeholder}
          className="admin-input resize-y min-h-[6rem]"
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input"
        />
      )}
    </label>
  )
}
