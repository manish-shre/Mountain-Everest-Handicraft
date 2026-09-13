export default function TestimonialCard({ quote, author, location, product, rating = 5 }) {
  const stars = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))

  return (
    <figure className="rounded-2xl bg-white border border-cream-dark/50 shadow-soft p-6 md:p-8 h-full flex flex-col">
      {stars > 0 && (
        <div className="flex gap-1 mb-4" role="img" aria-label={`Rated ${stars} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= stars ? 'text-gold-dark' : 'text-navy/15'} aria-hidden="true">
              ★
            </span>
          ))}
        </div>
      )}
      <blockquote className="font-sans text-navy/90 leading-relaxed flex-1 mb-6 break-words">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption>
        <cite className="font-serif text-lg font-semibold text-navy not-italic">{author}</cite>
        {location && <p className="font-sans text-sm text-navy/70 mt-0.5">{location}</p>}
        {product && <p className="font-sans text-xs text-gold-deep mt-1">Purchased: {product}</p>}
      </figcaption>
    </figure>
  )
}
