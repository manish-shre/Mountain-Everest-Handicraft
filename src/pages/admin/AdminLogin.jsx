import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AdminIcon from '../../components/admin/AdminIcon'
import { useContent } from '../../context/ContentContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import useNoIndex from './useNoIndex'

/** Turns technical sign-in errors into plain language. */
function friendlyError(message = '') {
  if (/invalid login credentials/i.test(message)) return 'That email or password isn’t right. Please check and try again.'
  if (/email not confirmed/i.test(message)) return 'This account hasn’t been confirmed yet. Please check your email inbox.'
  if (/failed to fetch|network/i.test(message)) return 'We couldn’t connect. Please check your internet connection and try again.'
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.'
  return message || 'Something went wrong. Please try again.'
}

export default function AdminLogin() {
  const { content } = useContent()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  useNoIndex()

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">Setup required</h1>
          <p className="text-slate-600 leading-relaxed">
            The website database isn’t connected yet. Copy <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env.example</code> to{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env</code> and follow{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code>.
          </p>
        </div>
      </div>
    )
  }

  if (session) return <Navigate to="/admin" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (authError) {
        setError(friendlyError(authError.message))
        return
      }
      window.location.href = '/admin'
    } catch (err) {
      setError(friendlyError(err?.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-root min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {content?.logo && <img src={content.logo} alt="Mount Everest Handicraft" className="mx-auto h-16 w-auto object-contain" />}
          <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-slate-500">Sign in to manage your website</p>
        </div>

        <div className="admin-card p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="admin-label">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="admin-input !py-3"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="admin-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="admin-input !py-3 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <AdminIcon name={showPassword ? 'eyeOff' : 'eye'} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800" role="alert">
                <AdminIcon name="warning" className="w-5 h-5 shrink-0 text-red-600" />
                {error}
              </p>
            )}

            <button type="submit" disabled={loading || !email.trim() || !password} className="admin-btn-primary w-full !py-3 !text-base">
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <AdminIcon name="lock" className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Forgot your password? Ask the person who set up your website to reset it.
          </p>
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy">
          ← Back to website
        </Link>
      </div>
    </main>
  )
}
