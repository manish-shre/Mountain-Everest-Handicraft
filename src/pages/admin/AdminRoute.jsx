import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { checkIsAdmin } from '../../lib/contentService'

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('no-config')
      return
    }

    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setStatus('guest')
        return
      }
      const isAdmin = await checkIsAdmin()
      setStatus(isAdmin ? 'admin' : 'forbidden')
    }

    verify()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verify()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-900">Loading…</p>
      </div>
    )
  }

  if (status === 'no-config') {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">Supabase not configured</h1>
          <p className="text-base text-gray-700 leading-relaxed">
            Add <code className="bg-gray-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to a{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env</code> file.
            See <code className="bg-gray-100 px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code>.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'guest') return <Navigate to="/admin/login" replace />
  if (status === 'forbidden') {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="admin-heading mb-3">Access denied</h1>
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            Your account is not in the admin list. Ask the site owner to add your user ID to{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin_users</code> in Supabase.
          </p>
          <a href="/admin/login" className="text-base text-navy font-semibold underline hover:text-navy-light">
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return children
}
