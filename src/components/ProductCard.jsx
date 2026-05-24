import { useState } from 'react'

export default function ProductCard({ name, description, image, price, showRequestPrice = false }) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-cream-dark/50 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-cream-dark/30">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft transition-colors hover:bg-white"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 ${wishlisted ? 'text-gold fill-current' : 'text-navy/60'}`}
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-lg md:text-xl font-semibold text-navy mb-1">
          {name}
        </h3>
        <p className="font-sans text-sm text-navy/85 line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between gap-3">
          {showRequestPrice ? (
            <span className="font-sans text-sm text-navy/90">Price on request</span>
          ) : (
            <span className="font-serif text-lg font-semibold text-gold">{price}</span>
          )}
          <a
            href="#"
            className="font-sans text-sm font-medium text-navy border-b border-navy/30 hover:border-gold hover:text-gold transition-colors"
          >
            View Details
          </a>
        </div>
        {showRequestPrice && (
          <button
            type="button"
            className="mt-4 w-full py-2.5 rounded-xl bg-navy text-white font-sans text-sm font-medium hover:bg-navy-light transition-colors"
          >
            Request Price
          </button>
        )}
      </div>
    </article>
  )
}
