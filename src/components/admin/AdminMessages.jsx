import { useCallback, useEffect, useState } from 'react'
import {
  MESSAGES_PAGE_SIZE,
  MessagesNotSetUpError,
  deleteMessage,
  fetchMessages,
  setMessageRead,
} from '../../lib/messagesService'
import { telHref } from '../../lib/url'

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

const whatsappHref = (phone) => {
  let digits = phone?.replace(/\D/g, '')
  if (!digits || digits.length < 7) return null
  // Visitors in Nepal usually type mobiles as 98XXXXXXXX; WhatsApp needs the 977 country code.
  if (!phone.trim().startsWith('+') && /^9[78]\d{8}$/.test(digits)) digits = `977${digits}`
  return `https://wa.me/${digits}`
}

export default function AdminMessages({ onUnreadChange }) {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMessages(await fetchMessages())
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const unread = messages.filter((m) => !m.is_read).length
  useEffect(() => {
    if (!loading && !error) onUnreadChange?.(unread)
  }, [unread, loading, error, onUnreadChange])

  const visible = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages

  const toggleRead = async (msg) => {
    setBusyId(msg.id)
    try {
      await setMessageRead(msg.id, !msg.is_read)
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !msg.is_read } : m)))
    } catch (err) {
      window.alert(`Could not update the message: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (msg) => {
    if (!window.confirm(`Delete the message from ${msg.name}? This cannot be undone.`)) return
    setBusyId(msg.id)
    try {
      await deleteMessage(msg.id)
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    } catch (err) {
      window.alert(`Could not delete the message: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  const replyHref = (msg) => {
    const subject = encodeURIComponent('Re: Your enquiry to Mount Everest Handicraft')
    const quoted = msg.message.split('\n').map((line) => `> ${line}`).join('\n')
    const body = encodeURIComponent(`Dear ${msg.name},\n\n\n\n---\n${quoted}`)
    return `mailto:${msg.email}?subject=${subject}&body=${body}`
  }

  if (error instanceof MessagesNotSetUpError) {
    return (
      <div className="admin-item-card border-amber-400 bg-amber-50" role="alert">
        <p className="text-base font-semibold text-slate-900">One-time setup needed</p>
        <p className="text-base text-slate-800 leading-relaxed">
          The messages table does not exist in Supabase yet. Open the{' '}
          <a
            href="https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy underline"
          >
            Supabase SQL editor
          </a>
          , paste the contents of <code className="bg-white px-1.5 py-0.5 rounded">supabase/contact_messages.sql</code>, click{' '}
          <strong>Run</strong>, then click Refresh below.
        </p>
        <button type="button" onClick={load} className="admin-btn-primary">Refresh</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter messages">
          {[
            { id: 'all', label: `All (${messages.length})` },
            { id: 'unread', label: `Unread (${unread})` },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={filter === f.id ? 'admin-btn-primary' : 'admin-btn-secondary'}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={load} disabled={loading} className="admin-btn-secondary">
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="text-base font-semibold text-red-700" role="alert">
          Could not load messages: {error.message}
        </p>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="admin-item-card text-center">
          <p className="text-lg text-slate-700">
            {filter === 'unread' ? 'No unread messages.' : 'No messages yet. Messages sent from the website contact form will appear here.'}
          </p>
        </div>
      )}

      <ul className="space-y-4">
        {visible.map((msg) => {
          const tel = telHref(msg.phone)
          const wa = whatsappHref(msg.phone)
          const busy = busyId === msg.id
          return (
            <li
              key={msg.id}
              className={`rounded-2xl border p-5 space-y-3 ${msg.is_read ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-400'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {!msg.is_read && (
                      <span className="mr-2 inline-block rounded bg-amber-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white align-middle">
                        New
                      </span>
                    )}
                    {msg.name}
                  </p>
                  <p className="text-base text-slate-800 break-all">
                    <a href={`mailto:${msg.email}`} className="underline hover:text-navy">{msg.email}</a>
                    {msg.phone && (
                      <>
                        {' · '}
                        {tel ? <a href={tel} className="underline hover:text-navy">{msg.phone}</a> : msg.phone}
                      </>
                    )}
                  </p>
                </div>
                <time dateTime={msg.created_at} className="text-sm text-slate-600">
                  {formatDate(msg.created_at)}
                </time>
              </div>
              <p className="text-[15px] text-slate-800 whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a href={replyHref(msg)} className="admin-btn-primary text-sm">Reply by email</a>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary text-sm">
                    WhatsApp
                  </a>
                )}
                <button type="button" onClick={() => toggleRead(msg)} disabled={busy} className="admin-btn-secondary text-sm">
                  {msg.is_read ? 'Mark as unread' : 'Mark as read'}
                </button>
                <button type="button" onClick={() => remove(msg)} disabled={busy} className="admin-btn-danger text-sm">
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {messages.length >= MESSAGES_PAGE_SIZE && (
        <p className="text-sm text-slate-600">Showing the latest {MESSAGES_PAGE_SIZE} messages. Delete old messages to see earlier ones.</p>
      )}
    </div>
  )
}
