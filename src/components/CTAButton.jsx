import { Link } from 'react-router-dom'
import { toInternalPath } from '../lib/sections'
import { isExternalHref, safeHref } from '../lib/url'

export default function CTAButton({ children, variant = 'primary', href, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-300'
  const variants = {
    primary: 'bg-gold text-navy hover:bg-gold-dark shadow-soft hover:shadow-gold',
    secondary: 'bg-navy text-white hover:bg-navy-light',
    outline: 'border-2 border-gold text-gold-deep hover:bg-gold hover:text-navy',
    outlineLight: 'border-2 border-white text-white hover:bg-white hover:text-navy',
  }
  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`

  if (href !== undefined) {
    // Links within the site (/contact, #contact) use the router: clean URL, no page reload.
    const internal = toInternalPath(href)
    if (internal) {
      return (
        <Link to={internal} className={classes} {...props}>
          {children}
        </Link>
      )
    }
    const url = safeHref(href)
    // Render nothing for missing/unsafe links rather than a dead "#" button.
    if (!url) return null
    const external = isExternalHref(url)
    return (
      <a
        href={url}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
