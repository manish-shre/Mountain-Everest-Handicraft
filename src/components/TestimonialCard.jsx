export default function TestimonialCard({ quote, author, location, rating = 5 }) {
  return (
    <blockquote className="rounded-2xl bg-white border border-cream-dark/50 shadow-soft p-6 md:p-8 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-gold" aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <p className="font-sans text-navy/90 leading-relaxed flex-1 mb-6">
        &ldquo;{quote}&rdquo;
      </p>
      <footer>
        <cite className="font-serif text-lg font-semibold text-navy not-italic">{author}</cite>
        <p className="font-sans text-sm text-navy/60 mt-0.5">{location}</p>
      </footer>
    </blockquote>
  )
}
