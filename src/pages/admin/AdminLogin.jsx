import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">Setup required</h1>
          <p className="text-base text-gray-700 leading-relaxed">
            Copy <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.example</code> to{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env</code> and follow{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code>.
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
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    window.location.href = '/admin'
  }

  return (
    <div className="admin-root min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md admin-card p-8 sm:p-10">
        <h1 className="admin-heading mb-2">Admin Login</h1>
        <p className="text-base text-gray-700 mb-8">Sign in to manage your website content</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block">
            <span className="admin-label">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="admin-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="admin-input"
            />
          </label>
          {error && <p className="text-base text-red-700 font-semibold">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link to="/" className="block mt-8 text-center text-base text-gray-700 hover:text-navy underline">
          Back to website
        </Link>
      </div>
    </div>
  )
}
