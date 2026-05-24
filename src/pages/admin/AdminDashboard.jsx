import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { supabase } from '../../lib/supabase'
import AdminField from '../../components/admin/AdminField'
import AdminImageField from '../../components/admin/AdminImageField'
import AdminItemCard from '../../components/admin/AdminItemCard'

const TABS = [
  { id: 'logo', label: 'Logo', description: 'The logo shown in the website header.' },
  { id: 'hero', label: 'Hero', description: 'The large banner at the top of the homepage.' },
  { id: 'about', label: 'About', description: 'Your story and introduction section.' },
  { id: 'categories', label: 'Categories', description: 'Product category cards on the homepage.' },
  { id: 'products', label: 'Products', description: 'Featured products displayed on the site.' },
  { id: 'customOrders', label: 'Custom Orders', description: 'Custom order call-to-action section.' },
  { id: 'process', label: 'Process', description: 'How your craft process is explained to visitors.' },
  { id: 'testimonials', label: 'Testimonials', description: 'Customer reviews and quotes.' },
  { id: 'contact', label: 'Contact', description: 'Phone, email, address, and contact form area.' },
  { id: 'footer', label: 'Footer', description: 'Footer links, social media, and copyright text.' },
]

export default function AdminDashboard() {
  const { content, loading, persistContent, reload } = useContent()
  const [draft, setDraft] = useState(null)
  const [tab, setTab] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && content) setDraft(structuredClone(content))
  }, [content, loading])

  const set = (path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await persistContent(draft)
      setMessage('Saved successfully. Your changes are now live on the website.')
    } catch (err) {
      setMessage(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const activeTab = TABS.find((t) => t.id === tab)

  if (loading || !draft) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-900">Loading content…</p>
      </div>
    )
  }

  return (
    <div className="admin-root min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="admin-heading">Website Admin</h1>
            <p className="text-base text-gray-700 mt-0.5">Edit your site content section by section</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" target="_blank" className="admin-btn-secondary">
              View website
            </Link>
            <button type="button" onClick={() => reload()} className="admin-btn-secondary">
              Reload
            </button>
            <button type="button" onClick={handleLogout} className="admin-btn-secondary">
              Log out
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-accent">
              {saving ? 'Saving…' : 'Save all changes'}
            </button>
          </div>
        </div>
        {message && (
          <div
            className={`max-w-7xl mx-auto px-4 sm:px-6 pb-4 text-base font-semibold ${
              message.includes('Failed') ? 'text-red-700' : 'text-green-800'
            }`}
          >
            {message}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar navigation */}
        <aside className="lg:w-56 shrink-0">
          <nav className="admin-card p-3 lg:sticky lg:top-28">
            <p className="px-3 py-2 text-sm font-bold text-gray-600 uppercase tracking-wide">Sections</p>
            <div className="space-y-1 mt-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`admin-nav-btn ${tab === t.id ? 'admin-nav-btn-active' : 'admin-nav-btn-inactive'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main editor */}
        <main className="flex-1 min-w-0">
          <div className="admin-card p-6 sm:p-8">
            <h2 className="admin-heading">{activeTab?.label}</h2>
            <p className="admin-subheading">{activeTab?.description}</p>

            <div className="space-y-6">
              {tab === 'logo' && (
                <AdminImageField
                  label="Header logo"
                  hint="This image appears in the top-left corner of every page."
                  value={draft.logo}
                  onChange={(v) => set('logo', v)}
                />
              )}

              {tab === 'hero' && (
                <>
                  <AdminImageField label="Background image" value={draft.hero.image} onChange={(v) => set('hero.image', v)} />
                  <AdminField label="Image description (for accessibility)" value={draft.hero.imageAlt} onChange={(v) => set('hero.imageAlt', v)} />
                  <AdminField label="Small text above title" value={draft.hero.overline} onChange={(v) => set('hero.overline', v)} />
                  <AdminField label="Main headline" value={draft.hero.title} onChange={(v) => set('hero.title', v)} />
                  <AdminField label="Subtitle" type="textarea" rows={4} value={draft.hero.subtitle} onChange={(v) => set('hero.subtitle', v)} />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <AdminField label="Primary button text" value={draft.hero.ctaPrimary} onChange={(v) => set('hero.ctaPrimary', v)} />
                    <AdminField label="Secondary button text" value={draft.hero.ctaSecondary} onChange={(v) => set('hero.ctaSecondary', v)} />
                  </div>
                </>
              )}

              {tab === 'about' && (
                <>
                  <AdminImageField label="Section image" value={draft.about.image} onChange={(v) => set('about.image', v)} />
                  <AdminField label="Image description" value={draft.about.imageAlt} onChange={(v) => set('about.imageAlt', v)} />
                  <AdminField label="Small text above title" value={draft.about.overline} onChange={(v) => set('about.overline', v)} />
                  <AdminField label="Section title" value={draft.about.title} onChange={(v) => set('about.title', v)} />
                  <AdminField label="First paragraph" type="textarea" rows={5} value={draft.about.paragraphs?.[0]} onChange={(v) => {
                    const p = [...(draft.about.paragraphs || [])]
                    p[0] = v
                    set('about.paragraphs', p)
                  }} />
                  <AdminField label="Second paragraph" type="textarea" rows={5} value={draft.about.paragraphs?.[1]} onChange={(v) => {
                    const p = [...(draft.about.paragraphs || [])]
                    p[1] = v
                    set('about.paragraphs', p)
                  }} />
                  <AdminField label="Closing tagline" value={draft.about.tagline} onChange={(v) => set('about.tagline', v)} />
                </>
              )}

              {tab === 'categories' && (
                <>
                  <AdminField label="Small text above title" value={draft.categories.overline} onChange={(v) => set('categories.overline', v)} />
                  <AdminField label="Section title" value={draft.categories.title} onChange={(v) => set('categories.title', v)} />
                  <AdminField label="Section subtitle" type="textarea" value={draft.categories.subtitle} onChange={(v) => set('categories.subtitle', v)} />
                  {draft.categories.items?.map((item, i) => (
                    <AdminItemCard key={item.id || i} title={`Category ${i + 1}`}>
                      <AdminField label="Title" value={item.title} onChange={(v) => {
                        const items = [...draft.categories.items]
                        items[i] = { ...items[i], title: v }
                        set('categories.items', items)
                      }} />
                      <AdminField label="Description" type="textarea" value={item.description} onChange={(v) => {
                        const items = [...draft.categories.items]
                        items[i] = { ...items[i], description: v }
                        set('categories.items', items)
                      }} />
                      <AdminImageField label="Image" value={item.image} onChange={(v) => {
                        const items = [...draft.categories.items]
                        items[i] = { ...items[i], image: v }
                        set('categories.items', items)
                      }} />
                    </AdminItemCard>
                  ))}
                </>
              )}

              {tab === 'products' && (
                <>
                  <AdminField label="Small text above title" value={draft.products.overline} onChange={(v) => set('products.overline', v)} />
                  <AdminField label="Section title" value={draft.products.title} onChange={(v) => set('products.title', v)} />
                  <AdminField label="Section subtitle" type="textarea" value={draft.products.subtitle} onChange={(v) => set('products.subtitle', v)} />
                  {draft.products.items?.map((item, i) => (
                    <AdminItemCard key={item.id || i} title={`Product ${i + 1}`}>
                      <AdminField label="Product name" value={item.name} onChange={(v) => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], name: v }
                        set('products.items', items)
                      }} />
                      <AdminField label="Description" type="textarea" value={item.description} onChange={(v) => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], description: v }
                        set('products.items', items)
                      }} />
                      <AdminImageField label="Product image" value={item.image} onChange={(v) => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], image: v }
                        set('products.items', items)
                      }} />
                      <AdminField label="Price" value={item.price} onChange={(v) => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], price: v }
                        set('products.items', items)
                      }} />
                    </AdminItemCard>
                  ))}
                </>
              )}

              {tab === 'customOrders' && (
                <>
                  <AdminField label="Small text above title" value={draft.customOrders.overline} onChange={(v) => set('customOrders.overline', v)} />
                  <AdminField label="Section title" value={draft.customOrders.title} onChange={(v) => set('customOrders.title', v)} />
                  <AdminField label="Description" type="textarea" rows={5} value={draft.customOrders.subtitle} onChange={(v) => set('customOrders.subtitle', v)} />
                  <AdminField label="Button text" value={draft.customOrders.cta} onChange={(v) => set('customOrders.cta', v)} />
                </>
              )}

              {tab === 'process' && (
                <>
                  <AdminField label="Small text above title" value={draft.process.overline} onChange={(v) => set('process.overline', v)} />
                  <AdminField label="Section title" value={draft.process.title} onChange={(v) => set('process.title', v)} />
                  <AdminField label="Section subtitle" type="textarea" value={draft.process.subtitle} onChange={(v) => set('process.subtitle', v)} />
                  {draft.process.steps?.map((step, i) => (
                    <AdminItemCard key={step.id || i} title={`Step ${i + 1}`}>
                      <AdminField label="Step title" value={step.title} onChange={(v) => {
                        const steps = [...draft.process.steps]
                        steps[i] = { ...steps[i], title: v }
                        set('process.steps', steps)
                      }} />
                      <AdminField label="Step description" type="textarea" value={step.description} onChange={(v) => {
                        const steps = [...draft.process.steps]
                        steps[i] = { ...steps[i], description: v }
                        set('process.steps', steps)
                      }} />
                    </AdminItemCard>
                  ))}
                </>
              )}

              {tab === 'testimonials' && (
                <>
                  <AdminField label="Small text above title" value={draft.testimonials.overline} onChange={(v) => set('testimonials.overline', v)} />
                  <AdminField label="Section title" value={draft.testimonials.title} onChange={(v) => set('testimonials.title', v)} />
                  <AdminField label="Section subtitle" type="textarea" value={draft.testimonials.subtitle} onChange={(v) => set('testimonials.subtitle', v)} />
                  {draft.testimonials.items?.map((item, i) => (
                    <AdminItemCard key={item.id || i} title={`Testimonial ${i + 1}`}>
                      <AdminField label="Customer quote" type="textarea" rows={4} value={item.quote} onChange={(v) => {
                        const items = [...draft.testimonials.items]
                        items[i] = { ...items[i], quote: v }
                        set('testimonials.items', items)
                      }} />
                      <div className="grid sm:grid-cols-2 gap-6">
                        <AdminField label="Customer name" value={item.author} onChange={(v) => {
                          const items = [...draft.testimonials.items]
                          items[i] = { ...items[i], author: v }
                          set('testimonials.items', items)
                        }} />
                        <AdminField label="Location" value={item.location} onChange={(v) => {
                          const items = [...draft.testimonials.items]
                          items[i] = { ...items[i], location: v }
                          set('testimonials.items', items)
                        }} />
                      </div>
                    </AdminItemCard>
                  ))}
                </>
              )}

              {tab === 'contact' && (
                <>
                  <AdminField label="Small text above title" value={draft.contact.overline} onChange={(v) => set('contact.overline', v)} />
                  <AdminField label="Section title" value={draft.contact.title} onChange={(v) => set('contact.title', v)} />
                  <AdminField label="Section subtitle" type="textarea" value={draft.contact.subtitle} onChange={(v) => set('contact.subtitle', v)} />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <AdminField label="Phone number" value={draft.contact.phone} onChange={(v) => set('contact.phone', v)} />
                    <AdminField label="Email address" value={draft.contact.email} onChange={(v) => set('contact.email', v)} />
                  </div>
                  <AdminField label="Physical address" value={draft.contact.address} onChange={(v) => set('contact.address', v)} />
                  <AdminField label="WhatsApp link" hint="Full URL, e.g. https://wa.me/977..." value={draft.contact.whatsapp} onChange={(v) => set('contact.whatsapp', v)} />
                  <AdminField label="Map placeholder text" value={draft.contact.mapPlaceholder} onChange={(v) => set('contact.mapPlaceholder', v)} />
                </>
              )}

              {tab === 'footer' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <AdminField label="Brand name" value={draft.footer.brandName} onChange={(v) => set('footer.brandName', v)} />
                    <AdminField label="Brand accent word" value={draft.footer.brandAccent} onChange={(v) => set('footer.brandAccent', v)} />
                  </div>
                  <AdminField label="Footer description" type="textarea" rows={4} value={draft.footer.description} onChange={(v) => set('footer.description', v)} />
                  <AdminField label="Footer tagline" value={draft.footer.tagline} onChange={(v) => set('footer.tagline', v)} />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <AdminField label="Facebook URL" value={draft.footer.facebook} onChange={(v) => set('footer.facebook', v)} />
                    <AdminField label="Instagram URL" value={draft.footer.instagram} onChange={(v) => set('footer.instagram', v)} />
                  </div>
                  <AdminField label="Copyright name" value={draft.footer.copyright} onChange={(v) => set('footer.copyright', v)} />
                </>
              )}
            </div>

            {/* Bottom save bar */}
            <div className="mt-10 pt-6 border-t border-gray-300 flex flex-wrap items-center justify-between gap-4">
              <p className="text-base text-gray-700">Remember to save after making changes.</p>
              <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-accent">
                {saving ? 'Saving…' : 'Save all changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
