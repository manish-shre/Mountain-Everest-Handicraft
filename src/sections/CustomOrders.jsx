import CTAButton from '../components/CTAButton'
import { useContent } from '../context/ContentContext'

export default function CustomOrders() {
  const { content } = useContent()
  const section = content.customOrders

  return (
    <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 pattern-nepali opacity-30" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
          {section.overline}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
          {section.title}
        </h2>
        <p className="font-sans text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
          {section.subtitle}
        </p>
        <CTAButton href="#contact" variant="primary" className="min-w-[200px]">
          {section.cta}
        </CTAButton>
      </div>
    </section>
  )
}
