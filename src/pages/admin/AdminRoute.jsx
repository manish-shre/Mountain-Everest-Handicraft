import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { checkIsAdmin } from '../../lib/contentService'
import useNoIndex from './useNoIndex'

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'no-config')
  const [signingOut, setSigningOut] = useState(false)
  useNoIndex()

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    let requestId = 0

    const verify = async (session) => {
      const id = ++requestId
      if (!session) {
        if (active) setStatus('guest')
        return
      }
      try {
        const isAdmin = await checkIsAdmin()
        // Ignore stale results if a newer auth event arrived meanwhile.
        if (active && id === requestId) setStatus(isAdmin ? 'admin' : 'forbidden')
      } catch (err) {
        console.warn('Admin check failed:', err?.message || err)
        if (active && id === requestId) setStatus('error')
      }
    }

    // onAuthStateChange fires INITIAL_SESSION on subscribe, so no separate getSession() call is needed.
    // Supabase calls made directly inside this callback can deadlock the auth client, so defer them.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      setTimeout(() => verify(session), 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
    } finally {
      window.location.href = '/admin/login'
    }
  }

  if (status === 'loading') {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-900">Loading…</p>
      </div>
    )
  }

  if (status === 'no-config') {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">Supabase not configured</h1>
          <p className="text-base text-slate-700 leading-relaxed">
            Add <code className="bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to a{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env</code> file.
            See <code className="bg-slate-100 px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code>.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'guest') return <Navigate to="/admin/login" replace />

  if (status === 'forbidden' || status === 'error') {
    const forbidden = status === 'forbidden'
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">{forbidden ? 'Access denied' : 'Could not verify access'}</h1>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            {forbidden ? (
              <>
                Your account is not in the admin list. Ask the site owner to add your user ID to{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded">admin_users</code> in Supabase, or sign in with a different account.
              </>
            ) : (
              'There was a problem checking your admin permissions. Check your connection and try again.'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!forbidden && (
              <button type="button" onClick={() => window.location.reload()} className="admin-btn-primary">
                Try again
              </button>
            )}
            {/* Signing out is required here — the login page redirects signed-in users straight back to /admin. */}
            <button type="button" onClick={handleSignOut} disabled={signingOut} className="admin-btn-secondary">
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
