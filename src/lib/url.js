const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:', 'viber:']

/**
 * Returns the URL if it is safe to use as an href (http/https/mailto/tel,
 * in-page anchors, or site-relative paths), otherwise the fallback.
 * Blocks `javascript:` and other script-capable URLs coming from CMS content.
 */
export function safeHref(url, fallback = undefined) {
  if (typeof url !== 'string') return fallback
  const value = url.trim()
  if (!value || value === '#') return fallback
  if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//'))) return value
  try {
    const parsed = new URL(value)
    return SAFE_PROTOCOLS.includes(parsed.protocol) ? value : fallback
  } catch {
    return fallback
  }
}

/** True for absolute http(s) links that should open in a new tab. */
export function isExternalHref(href) {
  return typeof href === 'string' && /^https?:\/\//i.test(href)
}

/** Builds a dialable tel: href — strips spaces, dashes and brackets. */
export function telHref(phone) {
  if (typeof phone !== 'string') return undefined
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : undefined
}
