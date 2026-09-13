import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { supabase } from '../../lib/supabase'
import AdminIcon from '../../components/admin/AdminIcon'
import AdminMessages from '../../components/admin/AdminMessages'
import AdminReviews from '../../components/admin/AdminReviews'
import { Callout } from '../../components/admin/ui'
import { countUnreadMessages } from '../../lib/messagesService'
import { countPendingReviews } from '../../lib/reviewsService'
import { ADMIN_GROUPS, adminPageById } from './adminPages'
import OverviewPage from './editors/OverviewPage'
import {
  AboutEditor,
  CategoriesEditor,
  CustomOrdersEditor,
  GalleryEditor,
  HeroEditor,
  ProcessEditor,
  ProductsEditor,
  TestimonialsEditor,
} from './editors/HomepageEditors'
import { ContactEditor, PhonesSocialEditor } from './editors/ContactEditors'
import { FooterEditor, LogoEditor } from './editors/SettingsEditors'

const EDITORS = {
  hero: HeroEditor,
  about: AboutEditor,
  categories: CategoriesEditor,
  products: ProductsEditor,
  customOrders: CustomOrdersEditor,
  process: ProcessEditor,
  gallery: GalleryEditor,
  testimonials: TestimonialsEditor,
  phonesSocial: PhonesSocialEditor,
  contact: ContactEditor,
  logo: LogoEditor,
  footer: FooterEditor,
}

function setAtPath(obj, path, compute) {
  const next = structuredClone(obj)
  const keys = path.split('.')
  let cur = next
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
  const last = keys[keys.length - 1]
  cur[last] = compute(cur[last])
  return next
}

function SideNav({ current, badges, onNavigate }) {
  return (
    <nav aria-label="Admin sections" className="p-4 space-y-6">
      {ADMIN_GROUPS.map((group) => (
        <div key={group.label || 'main'}>
          {group.label && <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{group.label}</p>}
          <ul className="space-y-1">
            {group.pages.map((page) => {
              const active = page.id === current
              const badge = badges[page.id]
              return (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(page.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15 ${
                      active ? 'bg-navy text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <AdminIcon name={page.icon} className={`w-5 h-5 ${active ? 'text-gold-light' : 'text-slate-400'}`} />
                    <span className="flex-1 text-left">{page.label}</span>
                    {badge > 0 && (
                      <span
                        className={`min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-bold ${active ? 'bg-gold text-navy' : 'bg-amber-500 text-white'}`}
                        aria-label={page.id === 'messages' ? `${badge} unread` : `${badge} waiting for approval`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default function AdminDashboard() {
  const { content, loading, loadError, persistContent, reload } = useContent()
  const [params, setParams] = useSearchParams()
  const pageId = adminPageById(params.get('page'))?.id || 'overview'
  const page = adminPageById(pageId)

  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [pendingReviews, setPendingReviews] = useState(0)
  const badges = { messages: unreadCount, reviews: pendingReviews }

  // Sidebar badges. Tables may not be set up yet; their pages explain how.
  useEffect(() => {
    countUnreadMessages().then(setUnreadCount).catch(() => setUnreadCount(0))
    countPendingReviews().then(setPendingReviews).catch(() => setPendingReviews(0))
    supabase?.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email || '')).catch(() => {})
  }, [])

  // The draft being saved right now. If the owner keeps typing while it saves,
  // those newer edits must survive when the saved content comes back.
  const savingSnapshot = useRef(null)

  useEffect(() => {
    if (loading || !content) return
    // Read the snapshot now: the updater below runs later, after the ref is cleared.
    const snapshot = savingSnapshot.current
    savingSnapshot.current = null
    setDraft((prev) => (prev && snapshot && prev !== snapshot ? prev : structuredClone(content)))
  }, [content, loading])

  const isDirty = useMemo(() => Boolean(draft) && JSON.stringify(draft) !== JSON.stringify(content), [draft, content])

  // Warn before closing/refreshing the browser tab with unsaved edits.
  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  // Success messages disappear on their own; errors stay until closed.
  useEffect(() => {
    if (toast?.type !== 'success') return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const set = useCallback((path, value) => setDraft((prev) => setAtPath(prev, path, () => value)), [])
  // Computes the new value from the latest draft — safe for uploads that finish one after another.
  const setWith = useCallback((path, updater) => setDraft((prev) => setAtPath(prev, path, updater)), [])

  const goTo = useCallback(
    (id) => {
      setParams(id === 'overview' ? {} : { page: id })
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [setParams],
  )

  const handleSave = async ({ force = false } = {}) => {
    if (loadError || saving) return
    setSaving(true)
    setToast(null)
    savingSnapshot.current = draft
    try {
      await persistContent(draft, { force })
      setToast({ type: 'success', text: 'Saved! Your website is updated.' })
    } catch (err) {
      savingSnapshot.current = null
      if (err?.name === 'ContentConflictError') {
        setToast({
          type: 'conflict',
          text: 'Someone changed the website from another device or browser tab after you opened this page.',
        })
      } else {
        setToast({ type: 'error', text: `Your changes were not saved: ${err?.message || 'please check your internet connection and try again.'}` })
      }
    } finally {
      setSaving(false)
    }
  }

  const loadLatest = () => {
    if (!window.confirm('Load the latest version? The changes you haven’t saved on this page will be lost.')) return
    setToast(null)
    reload()
  }

  const handleDiscard = () => {
    if (!window.confirm('Undo all the changes you haven’t saved?')) return
    setDraft(structuredClone(content))
    setToast(null)
  }

  const handleLogout = async () => {
    if (isDirty && !window.confirm('You have unsaved changes. Log out anyway?')) return
    try {
      await supabase.auth.signOut()
    } finally {
      window.location.href = '/admin/login'
    }
  }

  if (loading || !draft) {
    return (
      <div className="admin-root min-h-screen flex flex-col items-center justify-center gap-3" role="status">
        <span className="w-9 h-9 rounded-full border-2 border-navy/15 border-t-navy animate-spin" aria-hidden="true" />
        <p className="text-slate-600">Loading your website…</p>
      </div>
    )
  }

  const Editor = EDITORS[pageId]

  return (
    <div className="admin-root min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="h-full px-4 sm:px-6 flex items-center gap-3">
          <button type="button" onClick={() => setMenuOpen(true)} className="lg:hidden -ml-1 w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label="Open menu">
            <AdminIcon name="menu" className="w-6 h-6" />
          </button>
          <button type="button" onClick={() => goTo('overview')} className="flex items-center gap-3 min-w-0 rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15">
            {draft.logo && <img src={draft.logo} alt="" className="h-9 w-auto max-w-[6rem] object-contain" />}
            <span className="hidden sm:block text-left leading-tight">
              <span className="block font-semibold text-slate-900">Website Manager</span>
              <span className="block text-xs text-slate-500">Mount Everest Handicraft</span>
            </span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary !px-3 sm:!px-4" aria-label="View website (opens in a new tab)">
              <AdminIcon name="external" className="w-4 h-4" />
              <span className="hidden sm:inline">View website</span>
            </Link>
            {email && <span className="hidden md:block max-w-[14rem] truncate text-sm text-slate-500" title={email}>{email}</span>}
            <button type="button" onClick={handleLogout} className="admin-btn-secondary !px-3 sm:!px-4" aria-label="Log out">
              <AdminIcon name="logout" className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side menu: fixed on large screens, slide-out drawer on phones and tablets */}
      <aside className="hidden lg:block fixed top-16 bottom-0 left-0 w-72 overflow-y-auto border-r border-slate-200 bg-white">
        <SideNav current={pageId} badges={badges} onNavigate={goTo} />
      </aside>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200">
              <span className="font-semibold text-slate-900">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Close menu" autoFocus>
                <AdminIcon name="close" className="w-6 h-6" />
              </button>
            </div>
            <SideNav current={pageId} badges={badges} onNavigate={goTo} />
          </div>
        </div>
      )}

      {/* Page */}
      <main className="lg:pl-72">
        <div className={`mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-10 ${isDirty ? 'pb-36' : 'pb-16'}`}>
          {loadError && (
            <div className="mb-6">
              <Callout
                tone="warning"
                title="We couldn’t load your website content"
                action={<button type="button" onClick={reload} className="admin-btn-secondary">Try again</button>}
              >
                Please check your internet connection. Saving is turned off until the content loads, so nothing on your live website is overwritten.
              </Callout>
            </div>
          )}

          <div className="mb-6 sm:mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-200 text-navy items-center justify-center shadow-sm">
                <AdminIcon name={page.icon} className="w-6 h-6" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{page.title}</h1>
                <p className="mt-1 text-slate-500 leading-relaxed">{page.description}</p>
                {page.instant && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <AdminIcon name="checkCircle" className="w-4 h-4" /> Changes on this page are saved straight away.
                  </p>
                )}
              </div>
            </div>
            {page.websitePath && (
              <a href={page.websitePath} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary">
                <AdminIcon name="eye" className="w-4 h-4" />
                See it on your website
              </a>
            )}
          </div>

          <div className="space-y-6">
            {pageId === 'overview' && <OverviewPage draft={draft} badges={badges} goTo={goTo} />}
            {pageId === 'messages' && <AdminMessages onUnreadChange={setUnreadCount} />}
            {pageId === 'reviews' && <AdminReviews onPendingChange={setPendingReviews} />}
            {Editor && <Editor draft={draft} set={set} setWith={setWith} goTo={goTo} />}
          </div>
        </div>
      </main>

      {/* Save bar: only appears when there is something to save */}
      {isDirty && (
        <div className="fixed bottom-0 inset-x-0 lg:left-72 z-40 border-t border-slate-200 bg-white/95 backdrop-blur shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-5xl px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-amber-500" />
              </span>
              You have unsaved changes
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="button" onClick={handleDiscard} disabled={saving} className="admin-btn-secondary flex-1 sm:flex-none">
                Discard
              </button>
              <button type="button" onClick={() => handleSave()} disabled={saving || Boolean(loadError)} className="admin-btn-accent flex-1 sm:flex-none sm:min-w-[10rem]">
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-navy/25 border-t-navy animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <AdminIcon name="check" className="w-4 h-4" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation / error message */}
      <div aria-live="polite" className={`fixed z-50 right-4 left-4 sm:left-auto sm:w-96 ${isDirty ? 'bottom-24' : 'bottom-6'}`}>
        {toast && (
          <div
            role={toast.type === 'success' ? 'status' : 'alert'}
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-lg ${
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' : toast.type === 'conflict' ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-emerald-200 text-slate-900'
            }`}
          >
            <AdminIcon
              name={toast.type === 'success' ? 'checkCircle' : 'warning'}
              className={`w-6 h-6 shrink-0 ${toast.type === 'error' ? 'text-red-600' : toast.type === 'conflict' ? 'text-amber-600' : 'text-emerald-600'}`}
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.text}</p>
              {toast.type === 'success' && (
                <a href={page.websitePath || '/'} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-medium text-navy underline">
                  See it on your website <AdminIcon name="external" className="w-3.5 h-3.5" />
                </a>
              )}
              {toast.type === 'conflict' && (
                <>
                  <p className="mt-1 text-amber-900">To avoid losing work, choose what to keep:</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={loadLatest} className="admin-btn-secondary !py-2">Load latest version</button>
                    <button type="button" onClick={() => handleSave({ force: true })} disabled={saving} className="admin-btn-primary !py-2">Save my version anyway</button>
                  </div>
                </>
              )}
            </div>
            <button type="button" onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700" aria-label="Dismiss">
              <AdminIcon name="close" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
