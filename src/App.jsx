import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import HomePage from './pages/HomePage'

// The admin panel is only downloaded when someone opens /admin, keeping the public site fast.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminRoute = lazy(() => import('./pages/admin/AdminRoute'))

const AdminFallback = (
  <div className="admin-root min-h-screen flex items-center justify-center">
    <p className="text-lg text-gray-900">Loading…</p>
  </div>
)

function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          {/* One route for the homepage and its sections (/contact, /collection, …) so the page is never re-mounted */}
          <Route path="/:section?" element={<HomePage />} />
          <Route path="/admin/login" element={<Suspense fallback={AdminFallback}><AdminLogin /></Suspense>} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={AdminFallback}>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  )
}

export default App
