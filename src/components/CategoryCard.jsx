import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toInternalPath } from '../lib/sections'
import { isExternalHref, safeHref } from '../lib/url'

// Categories have no dedicated pages yet — send visitors to the featured products instead of a dead "#".
const DEFAULT_PATH = '/products'

export default function CategoryCard({ title, description, image, href, accent = 'gold', fallbackImage }) {
  const [imgError, setImgError] = useState(false)
  useEffect(() => setImgError(false), [image])

  const src = (imgError || !image) && fallbackImage ? fallbackImage : image
  const trimmed = typeof href === 'string' ? href.trim() : ''
  const internal = !trimmed || trimmed === '#' ? DEFAULT_PATH : toInternalPath(trimmed)
  const external = internal ? null : safeHref(trimmed)
  const accentClasses = accent === 'gold' ? 'group-hover:border-gold group-hover:shadow-gold' : 'group-hover:border-silver group-hover:shadow-soft-lg'
  const cardClasses = `group block rounded-2xl overflow-hidden bg-white border border-cream-dark/50 shadow-soft transition-all duration-300 hover:-translate-y-1 ${accentClasses}`
  const useRouter = Boolean(internal) || !external
  const Tag = useRouter ? Link : 'a'
  const linkProps = useRouter
    ? { to: internal || DEFAULT_PATH }
    : { href: external, ...(isExternalHref(external) ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }

  return (
    <Tag {...linkProps} className={cardClasses}>
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark/30">
        {src && !(imgError && src === image) && (
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-6 md:p-8">
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-navy mb-2 group-hover:text-gold-deep transition-colors">
          {title}
        </h3>
        <p className="font-sans text-sm text-navy/85 leading-relaxed">
          {description}
        </p>
      </div>
    </Tag>
  )
}
