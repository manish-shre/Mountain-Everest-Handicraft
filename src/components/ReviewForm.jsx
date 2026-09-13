import { useRef, useState } from 'react'
import { REVIEW_LIMITS, submitReview } from '../lib/reviewsService'

const EMPTY = { name: '', location: '', product: '', rating: 0, review: '', website: '' }
const MIN_FILL_MS = 3000
const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-cream-dark/50 bg-white font-sans text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent'
const labelClasses = 'block font-sans text-sm font-medium text-navy mb-1'

export default function ReviewForm({ onSubmitted, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [hoverRating, setHoverRating] = useState(0)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const openedAt = useRef(Date.now())

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }
  const onChange = (e) => update(e.target.name, e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    const name = form.name.trim()
    const review = form.review.trim()

    if (!name) return setError('Please enter your name.')
    if (!form.rating) return setError('Please choose a star rating.')
    if (review.length < REVIEW_LIMITS.reviewMin) return setError(`Please write at least ${REVIEW_LIMITS.reviewMin} characters about your experience.`)

    // Bot traps: hidden field filled in, or sent impossibly fast. Pretend it worked.
    if (form.website || Date.now() - openedAt.current < MIN_FILL_MS) {
      onSubmitted?.()
      return
    }

    setSending(true)
    try {
      await submitReview({ name, location: form.location, product: form.product, rating: form.rating, review })
      onSubmitted?.()
    } catch (err) {
      console.warn('Review submission failed:', err?.message || err)
      setError(err?.userFacing ? err.message : 'Sorry, your review could not be sent. Please try again later.')
    } finally {
      setSending(false)
    }
  }

  const shownRating = hoverRating || form.rating

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="review-name" className={labelClasses}>Your name</label>
          <input id="review-name" name="name" value={form.name} onChange={onChange} maxLength={REVIEW_LIMITS.name} autoComplete="name" required className={inputClasses} placeholder="e.g. Sita Gurung" />
        </div>
        <div>
          <label htmlFor="review-location" className={labelClasses}>
            City / country <span className="text-navy/70 font-normal">(optional)</span>
          </label>
          <input id="review-location" name="location" value={form.location} onChange={onChange} maxLength={REVIEW_LIMITS.location} className={inputClasses} placeholder="e.g. Pokhara, Nepal" />
        </div>
      </div>

      <div>
        <label htmlFor="review-product" className={labelClasses}>
          What did you buy? <span className="text-navy/70 font-normal">(optional)</span>
        </label>
        <input id="review-product" name="product" value={form.product} onChange={onChange} maxLength={REVIEW_LIMITS.product} className={inputClasses} placeholder="e.g. Silver filigree earrings" />
      </div>

      <fieldset>
        <legend className={labelClasses}>Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHoverRating(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={form.rating === n}
                onChange={() => update('rating', n)}
                className="sr-only peer"
              />
              <span
                aria-hidden="true"
                className={`block text-4xl leading-none px-0.5 rounded transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${
                  n <= shownRating ? 'text-gold-dark' : 'text-navy/20'
                }`}
              >
                ★
              </span>
              <span className="sr-only">{n} {n === 1 ? 'star' : 'stars'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-text" className={labelClasses}>Your review</label>
        <textarea
          id="review-text"
          name="review"
          value={form.review}
          onChange={onChange}
          rows={4}
          maxLength={REVIEW_LIMITS.reviewMax}
          required
          className={`${inputClasses} resize-none`}
          placeholder="Tell others about the quality, craftsmanship and your experience with us..."
        />
        <p className="mt-1 font-sans text-xs text-navy/70 text-right">{form.review.length}/{REVIEW_LIMITS.reviewMax}</p>
      </div>

      {/* Honeypot: hidden from people, but bots tend to fill every field. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p className="font-sans text-sm text-red-700" role="alert">{error}</p>}

      <p className="font-sans text-xs text-navy/70">
        Your name, city and review will be shown on this website after approval.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={sending}
          className="px-6 py-3 rounded-xl bg-navy text-white font-sans text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {sending ? 'Sending…' : 'Submit review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-navy/20 text-navy font-sans text-sm font-medium hover:bg-cream-dark/40 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
