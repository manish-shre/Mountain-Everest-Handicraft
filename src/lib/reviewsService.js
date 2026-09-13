import { ensureAffected } from './messagesService'
import { isSupabaseConfigured, supabase } from './supabase'
import { toSupabaseError } from './supabaseErrors'

const TABLE = 'reviews'
const toError = (error) => toSupabaseError(error, { table: TABLE, sqlFile: 'reviews.sql' })
// Explicit columns: visitors only have SELECT privilege on these.
const COLUMNS = 'id, name, location, product, rating, review, status, created_at'

export const PUBLIC_REVIEWS_LIMIT = 6
export const REVIEW_LIMITS = { name: 80, location: 80, product: 100, reviewMin: 10, reviewMax: 1000 }

/** Visitor: submit a review. It stays hidden until an admin approves it. */
export async function submitReview({ name, location, product, rating, review }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured')
  const { error } = await supabase.from(TABLE).insert({
    name: name.trim(),
    location: location?.trim() || null,
    product: product?.trim() || null,
    rating,
    review: review.trim(),
  })
  if (error) throw toError(error)
}

/** Public: newest approved reviews for the Testimonials section. */
export async function fetchApprovedReviews(limit = PUBLIC_REVIEWS_LIMIT) {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)
    // Don't leave visitors looking at loading placeholders on a stuck connection.
    .abortSignal(AbortSignal.timeout(10000))
  if (error) throw toError(error)
  return data
}

/** Admin: all reviews (or one status), newest first. */
export async function fetchReviews({ status } = {}) {
  let query = supabase.from(TABLE).select(COLUMNS).order('created_at', { ascending: false }).limit(300)
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw toError(error)
  return data
}

export async function countPendingReviews() {
  const { count, error } = await supabase
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  if (error) throw toError(error)
  return count ?? 0
}

export async function setReviewStatus(id, status) {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select('id')
  if (error) throw toError(error)
  ensureAffected(data)
}

export async function deleteReview(id) {
  const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select('id')
  if (error) throw toError(error)
  ensureAffected(data)
}
