import { useEffect, useRef, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import CTAButton from '../components/CTAButton'
import { useContent } from '../context/ContentContext'
import PhoneList from '../components/PhoneList'
import SocialIcon from '../components/SocialIcon'
import { onContactPrefill } from '../lib/contactPrefill'
import { sendContactMessage } from '../lib/messagesService'
import { isShortMapsLink, mapEmbedSrc, mapOpenHref } from '../lib/maps'
import { socialHref } from '../lib/social'
import { safeHref } from '../lib/url'
import { isSupabaseConfigured } from '../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY_FORM = { name: '', email: '', phone: '', message: '', website: '' }
// Humans need a few seconds to fill in the form; instant submissions are bots.
const MIN_FILL_MS = 2500
const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-cream-dark/50 bg-cream/30 font-sans text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent'

export default function Contact() {
  const { content } = useContent()
  const contact = content.contact
  const [formState, setFormState] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const mountedAt = useRef(Date.now())

  const hasPhones = contact.phones?.some((p) => p?.number?.trim())
  const whatsappHref = socialHref('whatsapp', content.social?.whatsapp)
  const viberHref = socialHref('viber', content.social?.viber)
  const recipient = EMAIL_RE.test(contact.email?.trim() || '') ? contact.email.trim() : ''
  // Embedded map: a location the admin typed, or one read from a full Google Maps URL.
  const mapSrc = mapEmbedSrc(contact.mapLocation) || (isShortMapsLink(contact.mapLink) ? null : mapEmbedSrc(contact.mapLink))
  const directionsHref = mapOpenHref(safeHref(contact.mapLink), contact.mapLocation)

  // Product cards can prefill the message ("Request Price" → contact form).
  useEffect(
    () => onContactPrefill((message) => {
      setFormState((prev) => ({ ...prev, message }))
      setStatus(null)
    }),
    [],
  )

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status) setStatus(null)
  }

  const openEmailApp = (name, email, phone, message) => {
    const subject = `Website enquiry from ${name}`
    const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    const name = formState.name.trim()
    const email = formState.email.trim()
    const phone = formState.phone.trim()
    const message = formState.message.trim()

    if (!name || !message || !EMAIL_RE.test(email)) {
      setStatus({ type: 'error', text: 'Please enter your name, a valid email address, and a message.' })
      return
    }
    if (name.length > 100 || phone.length > 30 || message.length > 5000) {
      setStatus({ type: 'error', text: 'Your message is too long. Please shorten it (max 5000 characters).' })
      return
    }

    const successText = 'Thank you! Your message has been sent. We will get back to you soon.'

    // Bot traps: hidden "website" field filled in, or submitted impossibly fast. Pretend it worked.
    if (formState.website || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setFormState(EMPTY_FORM)
      setStatus({ type: 'success', text: successText })
      return
    }

    // Without a database connection, fall back to the visitor's email app.
    if (!isSupabaseConfigured) {
      if (!recipient) {
        setStatus({ type: 'error', text: 'Messages cannot be sent right now. Please contact us by phone or WhatsApp.' })
        return
      }
      openEmailApp(name, email, phone, message)
      setStatus({ type: 'success', text: `Your email app should open with your message ready to send. If it doesn't, email us directly at ${recipient}.` })
      return
    }

    setSending(true)
    setStatus(null)
    try {
      await sendContactMessage({ name, email, phone, message })
      setFormState(EMPTY_FORM)
      setStatus({ type: 'success', text: successText })
    } catch (err) {
      console.warn('Contact message failed:', err?.message || err)
      const rateLimited = /too many messages/i.test(err?.message || '')
      const reason = rateLimited ? err.message : 'Sorry, your message could not be sent. Please try again.'
      const alternative = recipient ? `You can also email us at ${recipient}.` : 'You can also contact us by phone.'
      setStatus({ type: 'error', text: `${reason} ${alternative}` })
    } finally {
      setSending(false)
    }
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
              {hasPhones && (
                <div>
                  <p className="font-sans text-sm uppercase tracking-wider text-gold-deep mb-1">Phone</p>
                  <PhoneList
                    phones={contact.phones}
                    className="space-y-1 font-serif text-lg text-navy"
                    labelClassName="font-sans text-base text-navy/70"
                    itemClassName="hover:text-gold-deep transition-colors"
                  />
                </div>
              )}
              {recipient && (
                <div>
                  <p className="font-sans text-sm uppercase tracking-wider text-gold-deep mb-1">Email</p>
                  <a href={`mailto:${recipient}`} className="font-serif text-lg text-navy hover:text-gold-deep transition-colors break-all">
                    {recipient}
                  </a>
                </div>
              )}
              {contact.address && (
                <div>
                  <p className="font-sans text-sm uppercase tracking-wider text-gold-deep mb-1">Location</p>
                  <p className="font-sans text-navy/90">{contact.address}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <CTAButton href={whatsappHref ?? null} variant="primary" className="inline-flex items-center gap-2">
                <SocialIcon platform="whatsapp" />
                {contact.whatsappLabel}
              </CTAButton>
              <CTAButton href={viberHref ?? null} variant="secondary" className="inline-flex items-center gap-2">
                <SocialIcon platform="viber" />
                {contact.viberLabel}
              </CTAButton>
            </div>
          </div>
          <div className="lg:pl-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className="block font-sans text-sm font-medium text-navy mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  maxLength={100}
                  className={inputClasses}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-sans text-sm font-medium text-navy mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  maxLength={254}
                  className={inputClasses}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block font-sans text-sm font-medium text-navy mb-1">
                  Phone <span className="text-navy/70 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={30}
                  className={inputClasses}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-sans text-sm font-medium text-navy mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  maxLength={5000}
                  className={`${inputClasses} resize-none`}
                  placeholder="Your message or custom order details..."
                />
              </div>
              {/* Honeypot: hidden from people, but bots tend to fill every field. */}
              <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  type="text"
                  id="contact-website"
                  name="website"
                  value={formState.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-navy text-white font-sans font-medium hover:bg-navy-light transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
              <div aria-live="polite">
                {status && (
                  <p
                    className={`font-sans text-sm ${status.type === 'error' ? 'text-red-700' : 'text-green-800'}`}
                    role={status.type === 'error' ? 'alert' : 'status'}
                  >
                    {status.text}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
        {mapSrc && (
          <div className="mt-12 rounded-2xl overflow-hidden border border-cream-dark/50 shadow-soft bg-white">
            <iframe
              title={`Map: ${contact.mapTitle || 'Our location'}${contact.address ? ` — ${contact.address}` : ''}`}
              src={mapSrc}
              className="block w-full h-72 md:h-[420px] border-0 bg-cream-dark/30"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 md:px-6">
              <div>
                {contact.mapTitle && <p className="font-serif text-lg font-semibold text-navy">{contact.mapTitle}</p>}
                {contact.address && <p className="font-sans text-sm text-navy/70">{contact.address}</p>}
              </div>
              {directionsHref && (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white font-sans text-sm font-medium hover:bg-navy-light transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contact.directionsLabel || 'Get Directions'}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
