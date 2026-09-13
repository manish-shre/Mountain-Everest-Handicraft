/**
 * Homepage sections that have their own clean URL (e.g. /contact instead of /#contact).
 * `id` is the element id of the section on the page.
 */
export const SECTIONS = [
  { slug: 'collection', id: 'categories', title: 'Collection' },
  { slug: 'our-craft', id: 'about', title: 'Our Craft' },
  { slug: 'products', id: 'products', title: 'Featured Products' },
  { slug: 'process', id: 'process', title: 'Our Process' },
  { slug: 'gallery', id: 'gallery', title: 'Gallery' },
  { slug: 'reviews', id: 'testimonials', title: 'Reviews' },
  { slug: 'contact', id: 'contact', title: 'Contact' },
]

export const SITE_NAME = 'Mount Everest Gold Silver Handicraft'
export const SITE_TITLE = `${SITE_NAME} | Handcrafted Art from Nepal`

export const sectionBySlug = (slug) => SECTIONS.find((s) => s.slug === slug)
export const sectionById = (id) => SECTIONS.find((s) => s.id === id)
export const pathForSection = (id) => {
  const section = sectionById(id)
  return section ? `/${section.slug}` : '/'
}

/**
 * Converts an in-site link to a router path:
 * '#contact' → '/contact', '#' → '/', '/contact' → '/contact'.
 * Returns null for anything else (external links, mailto:, tel:, …).
 */
export function toInternalPath(href) {
  if (typeof href !== 'string') return null
  const value = href.trim()
  if (value === '#' || value === '/') return '/'
  if (value.startsWith('#')) return pathForSection(value.slice(1))
  if (value.startsWith('/') && !value.startsWith('//')) return value
  return null
}
