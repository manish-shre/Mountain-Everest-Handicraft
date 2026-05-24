import CTAButton from '../components/CTAButton'
import { useContent } from '../context/ContentContext'

export default function Hero() {
  const { content } = useContent()
  const hero = content.hero

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt={hero.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-gold-light mb-4">
          {hero.overline}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
          {hero.title}
        </h1>
        <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CTAButton href="#categories" variant="primary" className="min-w-[180px]">
            {hero.ctaPrimary}
          </CTAButton>
          <CTAButton href="#contact" variant="outlineLight" className="min-w-[180px]">
            {hero.ctaSecondary}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
