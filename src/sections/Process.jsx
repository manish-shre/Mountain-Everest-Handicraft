import SectionHeader from '../components/SectionHeader'
import { useContent } from '../context/ContentContext'

const stepIcons = [
  (
    <svg key="0" className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  (
    <svg key="1" className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm-1.758-2.829a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  ),
  (
    <svg key="2" className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  (
    <svg key="3" className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
]

export default function Process() {
  const { content } = useContent()
  const section = content.process

  return (
    <section id="process" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={section.overline}
          title={section.title}
          subtitle={section.subtitle}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {section.steps?.map((step, index) => (
            <div
              key={step.id || step.title}
              className="relative rounded-2xl bg-cream/50 border border-cream-dark/30 p-6 md:p-8 text-center hover:shadow-soft transition-shadow"
            >
              <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-serif text-sm font-semibold text-gold">
                {index + 1}
              </span>
              <div className="flex justify-center mb-4">{stepIcons[index % stepIcons.length]}</div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-2">{step.title}</h3>
              <p className="font-sans text-sm text-navy/85 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
