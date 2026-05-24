import SectionHeader from '../components/SectionHeader'
import TestimonialCard from '../components/TestimonialCard'
import { useContent } from '../context/ContentContext'

export default function Testimonials() {
  const { content } = useContent()
  const section = content.testimonials

  return (
    <section className="py-20 md:py-28 bg-cream pattern-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={section.overline}
          title={section.title}
          subtitle={section.subtitle}
        />
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {section.items?.map((t) => (
            <TestimonialCard key={t.id || t.author} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}
