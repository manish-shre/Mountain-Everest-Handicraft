import { safeHref } from './url'

const digitsOnly = (value) => value.replace(/\D/g, '')
const looksLikePhone = (value) => /^\+?[\d\s().-]{7,}$/.test(value)
const HANDLE_RE = /^@?[A-Za-z0-9._-]+$/

const fromHandle = (build) => (value) => (HANDLE_RE.test(value) ? build(value.replace(/^@/, '')) : null)

/**
 * Social platforms editable from the admin panel, in display order.
 * `toHref` turns a short value (handle or phone number) into a link;
 * full URLs are always accepted as-is.
 */
export const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/yourpage', toHref: fromHandle((h) => `https://www.facebook.com/${h}`) },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourname or @yourname', toHref: fromHandle((h) => `https://www.instagram.com/${h}`) },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@yourname or @yourname', toHref: fromHandle((h) => `https://www.tiktok.com/@${h}`) },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@yourchannel', toHref: fromHandle((h) => `https://www.youtube.com/@${h}`) },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    placeholder: '+977 98XXXXXXXX or https://wa.me/977...',
    hint: 'Enter the WhatsApp phone number with country code, or a wa.me link.',
    toHref: (v) => (looksLikePhone(v) ? `https://wa.me/${digitsOnly(v)}` : null),
  },
  {
    key: 'viber',
    label: 'Viber',
    placeholder: '+977 98XXXXXXXX',
    hint: 'Enter the Viber phone number with country code.',
    toHref: (v) => (looksLikePhone(v) ? `viber://chat?number=%2B${digitsOnly(v)}` : null),
  },
  { key: 'messenger', label: 'Messenger', placeholder: 'https://m.me/yourpage', toHref: fromHandle((h) => `https://m.me/${h}`) },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourname or @yourname', toHref: fromHandle((h) => `https://t.me/${h}`) },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/yourname or @yourname', toHref: fromHandle((h) => `https://x.com/${h}`) },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/yourcompany', toHref: () => null },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'https://www.pinterest.com/yourname', toHref: fromHandle((h) => `https://www.pinterest.com/${h}`) },
  { key: 'threads', label: 'Threads', placeholder: 'https://www.threads.net/@yourname', toHref: fromHandle((h) => `https://www.threads.net/@${h}`) },
  { key: 'snapchat', label: 'Snapchat', placeholder: 'https://www.snapchat.com/add/yourname', toHref: fromHandle((h) => `https://www.snapchat.com/add/${h}`) },
  { key: 'googleMaps', label: 'Google Maps', placeholder: 'https://maps.app.goo.gl/...', hint: 'Link to your shop on Google Maps.', toHref: () => null },
]

export const emptySocial = () => Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.key, '']))

/** Resolves one platform value (URL, handle or phone) to a safe href, or null. */
export function socialHref(key, value) {
  if (typeof value !== 'string') return null
  const v = value.trim()
  if (!v) return null
  if (/^(https?|viber):\/\//i.test(v)) return safeHref(v) ?? null
  const platform = SOCIAL_PLATFORMS.find((p) => p.key === key)
  return platform?.toHref(v) ?? null
}

/** Platforms that have a usable link, in display order. */
export function getSocialLinks(social = {}) {
  return SOCIAL_PLATFORMS
    .map((p) => ({ key: p.key, label: p.label, href: socialHref(p.key, social[p.key]) }))
    .filter((link) => link.href)
}
