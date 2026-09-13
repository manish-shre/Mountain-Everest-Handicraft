import { telHref } from '../lib/url'

/** Renders the non-empty phone numbers as tap-to-call links. */
export default function PhoneList({ phones, className = '', itemClassName = '', labelClassName = '' }) {
  const list = (phones || []).filter((p) => p?.number?.trim())
  if (list.length === 0) return null

  return (
    <ul className={className}>
      {list.map((p, i) => {
        const href = telHref(p.number)
        return (
          <li key={p.id || i}>
            {p.label?.trim() && <span className={labelClassName}>{p.label.trim()}: </span>}
            {href ? (
              <a href={href} className={itemClassName}>
                {p.number.trim()}
              </a>
            ) : (
              <span className={itemClassName}>{p.number.trim()}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
