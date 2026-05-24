export default function SectionHeader({ overline, title, subtitle, className = '' }) {
  return (
    <header className={`text-left max-w-3xl lg:max-w-4xl mx-auto mb-12 md:mb-4 ${className}`}>
      {overline && (
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold ">
          {overline}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-4xl lg:text-4xl font-semibold text-navy">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-navy/85 text-base md:text-lg leading-relaxed font-medium mt-3 max-w-full break-words">
          {subtitle}
        </p>
      )}
    </header>
  )
}
