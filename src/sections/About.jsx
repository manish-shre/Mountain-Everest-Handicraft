import SectionHeader from '../components/SectionHeader'
import { useContent } from '../context/ContentContext'

export default function About() {
  const { content } = useContent()
  const about = content.about

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden pattern-nepali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative mx-auto w-full max-w-[320px] md:max-w-none rounded-2xl overflow-hidden shadow-soft-lg aspect-[4/5] max-h-[400px] md:max-h-none">
            <img
              src={about.image}
              alt={about.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <SectionHeader
              overline={about.overline}
              title={about.title}
              subtitle={null}
              className="text-center md:text-left mb-8"
            />
            {about.paragraphs?.map((p, i) => (
              <p key={i} className="font-sans text-navy leading-relaxed mb-4 last:mb-6">
                {p}
              </p>
            ))}
            <p className="font-serif text-md text-gold font-medium">{about.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
