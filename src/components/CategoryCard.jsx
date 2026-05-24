import { useState } from 'react'

export default function CategoryCard({ title, description, image, href = '#', accent = 'gold', fallbackImage }) {
  const [imgError, setImgError] = useState(false)
  const src = imgError && fallbackImage ? fallbackImage : image
  const accentClasses = accent === 'gold' ? 'group-hover:border-gold group-hover:shadow-gold' : 'group-hover:border-silver group-hover:shadow-soft-lg'
  return (
    <a
      href={href}
      className={`group block rounded-2xl overflow-hidden bg-white border border-cream-dark/50 shadow-soft transition-all duration-300 hover:-translate-y-1 ${accentClasses}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark/30">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-6 md:p-8">
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="font-sans text-sm text-navy/85 leading-relaxed">
          {description}
        </p>
      </div>
    </a>
  )
}
