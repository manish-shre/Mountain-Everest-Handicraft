import { useCallback, useEffect, useState } from 'react'
import { PUBLIC_REVIEWS_LIMIT, deleteReview, fetchReviews, setReviewStatus } from '../../lib/reviewsService'
import { TableNotSetUpError } from '../../lib/supabaseErrors'

const FILTERS = [
  { id: 'pending', label: 'Waiting for approval' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Hidden' },
  { id: 'all', label: 'All' },
]

const STATUS_BADGE = {
  pending: { text: 'Waiting for approval', className: 'bg-amber-500 text-white' },
  approved: { text: 'Live on website', className: 'bg-green-700 text-white' },
  rejected: { text: 'Hidden', className: 'bg-slate-500 text-white' },
}

const formatDate = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function AdminReviews({ onPendingChange }) {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setReviews(await fetchReviews())
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = {
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
    all: reviews.length,
  }
  useEffect(() => {
    if (!loading && !error) onPendingChange?.(counts.pending)
  }, [counts.pending, loading, error, onPendingChange])

  const visible = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)
  const liveIds = reviews.filter((r) => r.status === 'approved').slice(0, PUBLIC_REVIEWS_LIMIT).map((r) => r.id)

  const changeStatus = async (review, status) => {
    setBusyId(review.id)
    try {
      await setReviewStatus(review.id, status)
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status } : r)))
    } catch (err) {
      window.alert(`Could not update the review: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (review) => {
    if (!window.confirm(`Delete the review from ${review.name}? This cannot be undone.`)) return
    setBusyId(review.id)
    try {
      await deleteReview(review.id)
      setReviews((prev) => prev.filter((r) => r.id !== review.id))
    } catch (err) {
      window.alert(`Could not delete the review: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  if (error instanceof TableNotSetUpError) {
    return (
      <div className="admin-item-card border-amber-400 bg-amber-50" role="alert">
        <p className="text-base font-semibold text-slate-900">One-time setup needed</p>
        <p className="text-base text-slate-800 leading-relaxed">
          The reviews table does not exist in Supabase yet. Open the{' '}
          <a href="https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new" target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">
            Supabase SQL editor
          </a>
          , paste the contents of <code className="bg-white px-1.5 py-0.5 rounded">supabase/reviews.sql</code>, click <strong>Run</strong>, then click
          Refresh below. Until then the Testimonials section is hidden on the website.
        </p>
        <button type="button" onClick={load} className="admin-btn-primary">Refresh</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-base text-slate-700">
        Customers submit reviews from the Testimonials section. Only approved reviews are shown — the website displays the{' '}
        {PUBLIC_REVIEWS_LIMIT} most recent ones.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={filter === f.id ? 'admin-btn-primary' : 'admin-btn-secondary'}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
        <button type="button" onClick={load} disabled={loading} className="admin-btn-secondary">
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="text-base font-semibold text-red-700" role="alert">Could not load reviews: {error.message}</p>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="admin-item-card text-center">
          <p className="text-lg text-slate-700">
            {filter === 'pending' ? 'No reviews waiting for approval.' : 'No reviews here yet.'}
          </p>
        </div>
      )}

      <ul className="space-y-4">
        {visible.map((review) => {
          const badge = STATUS_BADGE[review.status]
          const busy = busyId === review.id
          const beyondLimit = review.status === 'approved' && !liveIds.includes(review.id)
          return (
            <li
              key={review.id}
              className={`rounded-2xl border p-5 space-y-3 ${review.status === 'pending' ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    <span className={`mr-2 inline-block rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide align-middle ${badge.className}`}>
                      {badge.text}
                    </span>
                    {review.name}
                  </p>
                  <p className="text-base text-slate-700">
                    <span className="text-gold-dark text-lg" aria-label={`${review.rating} out of 5 stars`}>
                      {'★'.repeat(review.rating)}
                      <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span>
                    </span>
                    {review.location && <> · {review.location}</>}
                    {review.product && <> · Purchased: {review.product}</>}
                  </p>
                </div>
                <time dateTime={review.created_at} className="text-sm text-slate-600">{formatDate(review.created_at)}</time>
              </div>
              <p className="text-[15px] text-slate-800 whitespace-pre-wrap break-words leading-relaxed">{review.review}</p>
              {beyondLimit && (
                <p className="text-sm text-slate-600">Approved, but not currently shown — only the {PUBLIC_REVIEWS_LIMIT} newest approved reviews appear on the website.</p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {review.status !== 'approved' && (
                  <button type="button" onClick={() => changeStatus(review, 'approved')} disabled={busy} className="admin-btn-primary text-sm">
                    Approve &amp; publish
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button type="button" onClick={() => changeStatus(review, 'rejected')} disabled={busy} className="admin-btn-secondary text-sm">
                    {review.status === 'approved' ? 'Unpublish' : 'Hide'}
                  </button>
                )}
                <button type="button" onClick={() => remove(review)} disabled={busy} className="admin-btn-danger text-sm">
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
