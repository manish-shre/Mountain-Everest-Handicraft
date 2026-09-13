export default function SectionHeader({ overline, title, subtitle, className = 'text-left mb-10 md:mb-12' }) {
  // Not centred with mx-auto: the header must line up with the full-width grid below it.
  return (
    <header className={`max-w-3xl lg:max-w-4xl ${className}`}>
      {overline && (
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold-deep">
          {overline}
        </p>
      )}
      {title && (
        <h2 className="font-serif text-4xl font-semibold text-navy">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="font-sans text-navy/85 text-base md:text-lg leading-relaxed font-medium mt-3 max-w-full break-words">
          {subtitle}
        </p>
      )}
    </header>
  )
}
