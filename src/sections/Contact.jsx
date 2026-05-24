import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import CTAButton from '../components/CTAButton'
import { useContent } from '../context/ContentContext'

export default function Contact() {
  const { content } = useContent()
  const contact = content.contact
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={contact.overline}
          title={contact.title}
          subtitle={contact.subtitle}
        />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="space-y-6 mb-8">
              <div>
                <p className="font-sans text-sm uppercase tracking-wider text-gold mb-1">Phone</p>
                <a href={`tel:${contact.phone}`} className="font-serif text-lg text-navy hover:text-gold transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="font-sans text-sm uppercase tracking-wider text-gold mb-1">Email</p>
                <a href={`mailto:${contact.email}`} className="font-serif text-lg text-navy hover:text-gold transition-colors">
                  {contact.email}
                </a>
              </div>
              <div>
                <p className="font-sans text-sm uppercase tracking-wider text-gold mb-1">Location</p>
                <p className="font-sans text-navy/90">{contact.address}</p>
              </div>
            </div>
            <CTAButton
              href={contact.whatsapp}
              variant="primary"
              className="inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact on WhatsApp
            </CTAButton>
          </div>
          <div className="lg:pl-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-sans text-sm font-medium text-navy mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark/50 bg-cream/30 font-sans text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-sans text-sm font-medium text-navy mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark/50 bg-cream/30 font-sans text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-sans text-sm font-medium text-navy mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark/50 bg-cream/30 font-sans text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  placeholder="Your message or custom order details..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-navy text-white font-sans font-medium hover:bg-navy-light transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 rounded-2xl overflow-hidden bg-cream-dark/30 aspect-video max-h-[320px] flex items-center justify-center border border-cream-dark/50">
          <p className="font-sans text-navy/60">{contact.mapPlaceholder}</p>
        </div>
      </div>
    </section>
  )
}
