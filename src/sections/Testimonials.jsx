import { useEffect, useState } from 'react'
import ReviewForm from '../components/ReviewForm'
import SectionHeader from '../components/SectionHeader'
import TestimonialCard from '../components/TestimonialCard'
import { useContent } from '../context/ContentContext'
import { fetchApprovedReviews } from '../lib/reviewsService'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Testimonials() {
  const { content } = useContent()
  const section = content.testimonials
  const [reviews, setReviews] = useState([])
  // 'loading' | 'ready' | 'unavailable' (no database, or reviews table not set up yet)
  const [state, setState] = useState(isSupabaseConfigured ? 'loading' : 'unavailable')
  const [formOpen, setFormOpen] = useState(false)
  const [thanks, setThanks] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    fetchApprovedReviews()
      .then((data) => {
        if (!active) return
        setReviews(data)
        setState('ready')
      })
      .catch((err) => {
        console.warn('Could not load reviews:', err?.message || err)
        if (active) setState('unavailable')
      })
    return () => { active = false }
  }, [])

  // Without a working reviews table there is nothing real to show, so hide the section.
  if (state === 'unavailable') return null

  const openForm = () => {
    setThanks(false)
    setFormOpen(true)
  }

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-cream pattern-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader overline={section.overline} title={section.title} subtitle={section.subtitle} />

        {state === 'loading' && (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white/70 border border-cream-dark/50 h-56 animate-pulse" />
            ))}
          </div>
        )}

        {state === 'ready' && reviews.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((r) => (
              <TestimonialCard key={r.id} quote={r.review} author={r.name} location={r.location} product={r.product} rating={r.rating} />
            ))}
          </div>
        )}

        {state === 'ready' && reviews.length === 0 && section.emptyText && (
          <p className="font-sans text-lg text-navy/80">{section.emptyText}</p>
        )}

        {state === 'ready' && (
          <div className="mt-10">
            {thanks && (
              <p className="font-sans text-green-800 mb-4" role="status">
                Thank you for your review! It will appear here once it has been approved.
              </p>
            )}
            {formOpen ? (
              <div className="relative max-w-2xl rounded-2xl bg-white border border-cream-dark/50 shadow-soft p-6 md:p-8">
                <h3 className="font-serif text-2xl font-semibold text-navy mb-4">{section.cta || 'Share your experience'}</h3>
                <ReviewForm
                  onSubmitted={() => {
                    setFormOpen(false)
                    setThanks(true)
                  }}
                  onCancel={() => setFormOpen(false)}
                />
              </div>
            ) : (
              !thanks && section.cta && (
                <button
                  type="button"
                  onClick={openForm}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gold text-navy font-sans text-sm font-medium hover:bg-gold transition-colors"
                >
                  {section.cta}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </section>
  )
}
