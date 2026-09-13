import { isSupabaseConfigured, supabase } from './supabase'
import { TableNotSetUpError, toSupabaseError } from './supabaseErrors'

const TABLE = 'contact_messages'
const toError = (error) => toSupabaseError(error, { table: TABLE, sqlFile: 'contact_messages.sql' })
export const MESSAGES_PAGE_SIZE = 200
export { TableNotSetUpError as MessagesNotSetUpError }

/** Visitor: store a contact-form message. Nothing is read back (visitors have no read access). */
export async function sendContactMessage({ name, email, phone, message }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured')
  const { error } = await supabase.from(TABLE).insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
  })
  if (error) throw toError(error)
}

/** Admin: newest messages first. */
export async function fetchMessages({ unreadOnly = false } = {}) {
  let query = supabase
    .from(TABLE)
    .select('id, name, email, phone, message, is_read, created_at')
    .order('created_at', { ascending: false })
    .limit(MESSAGES_PAGE_SIZE)
  if (unreadOnly) query = query.eq('is_read', false)
  const { data, error } = await query
  if (error) throw toError(error)
  return data
}

/** Admin: number of unread messages (for the sidebar badge). */
export async function countUnreadMessages() {
  const { count, error } = await supabase
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false)
  if (error) throw toError(error)
  return count ?? 0
}

// Row-level security silently skips rows the user may not change, so confirm a row was affected.
export function ensureAffected(data) {
  if (!data?.length) throw new Error('You do not have permission to change this item.')
}

export async function setMessageRead(id, isRead) {
  const { data, error } = await supabase.from(TABLE).update({ is_read: isRead }).eq('id', id).select('id')
  if (error) throw toError(error)
  ensureAffected(data)
}

export async function deleteMessage(id) {
  const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select('id')
  if (error) throw toError(error)
  ensureAffected(data)
}
