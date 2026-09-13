// Free Google Maps embed (no API key) and helpers to turn what an admin pastes into a map.

const GOOGLE_HOST = /(^|\.)google\.[a-z.]+$/i

const parseUrl = (value) => {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

/** Short share links (maps.app.goo.gl / goo.gl/maps) can't be read in the browser, so they can't be embedded. */
export function isShortMapsLink(value) {
  const url = parseUrl(String(value || '').trim())
  return Boolean(url && (url.hostname === 'maps.app.goo.gl' || (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps'))))
}

/**
 * Extracts a searchable location from an address, "lat,lng", plus code, or a full Google Maps URL.
 * Returns null when nothing usable is found.
 */
export function mapLocationFrom(value) {
  const text = String(value || '').trim()
  if (!text) return null
  const url = parseUrl(text)
  if (!url) return text // plain address, coordinates or plus code
  if (!GOOGLE_HOST.test(url.hostname)) return null

  const q = url.searchParams.get('q') || url.searchParams.get('query') || url.searchParams.get('destination')
  if (q) return q
  const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (at) return `${at[1]},${at[2]}`
  const place = url.pathname.match(/\/maps\/place\/([^/]+)/)
  if (place) return decodeURIComponent(place[1].replace(/\+/g, ' '))
  return null
}

/** iframe src for the map, or null. A Google "Embed a map" URL is used as-is. */
export function mapEmbedSrc(value) {
  const url = parseUrl(String(value || '').trim())
  if (url && GOOGLE_HOST.test(url.hostname) && url.pathname.startsWith('/maps/embed')) return url.toString()
  const location = mapLocationFrom(value)
  return location ? `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=17&output=embed` : null
}

/** Link that opens the location (or directions) in Google Maps. */
export function mapOpenHref(link, location) {
  const shareLink = String(link || '').trim()
  if (shareLink && /^https:\/\//i.test(shareLink)) return shareLink
  const loc = mapLocationFrom(location)
  return loc ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}` : null
}
