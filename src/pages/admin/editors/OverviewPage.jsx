import AdminIcon from '../../../components/admin/AdminIcon'
import { MAX_GALLERY_IMAGES } from '../../../lib/gallery'
import { MAX_HERO_SLIDES } from '../../../lib/heroSlides'
import { isPriceOnRequest } from '../../../lib/products'
import { SOCIAL_PLATFORMS, socialHref } from '../../../lib/social'

const QUICK_ACTIONS = [
  { page: 'products', icon: 'cube', title: 'Add or edit products', text: 'Photos, names and prices' },
  { page: 'gallery', icon: 'photo', title: 'Upload gallery photos', text: 'Events and new arrivals' },
  { page: 'hero', icon: 'banner', title: 'Change the top banner', text: 'The big homepage photos' },
  { page: 'phonesSocial', icon: 'phone', title: 'Phone & social media', text: 'WhatsApp, Viber, Facebook, TikTok…' },
  { page: 'contact', icon: 'location', title: 'Address & map', text: 'Email, address and Google Map' },
  { page: 'about', icon: 'user', title: 'Edit your story', text: 'Founder photo and text' },
]

function StatCard({ icon, label, value, detail, highlight, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15 ${
        highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-amber-500 text-white' : 'bg-navy/5 text-navy'}`}>
          <AdminIcon name={icon} />
        </span>
        <AdminIcon name="chevronRight" className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {detail && <p className={`text-xs mt-0.5 ${highlight ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>{detail}</p>}
    </button>
  )
}

export default function OverviewPage({ draft, badges, goTo }) {
  const products = draft.products.items
  const photos = draft.gallery.items.length
  const socialCount = SOCIAL_PLATFORMS.filter((p) => socialHref(p.key, draft.social?.[p.key])).length
  const unpriced = products.filter((p) => isPriceOnRequest(p.price)).length

  const suggestions = [
    photos === 0 && { page: 'gallery', text: 'Upload a few photos to your gallery — it stays hidden until you do.' },
    socialCount === 0 && { page: 'phonesSocial', text: 'Add your Facebook, Instagram or TikTok links so visitors can follow you.' },
    !draft.social?.whatsapp && { page: 'phonesSocial', text: 'Add your WhatsApp number so customers can chat with you in one tap.' },
    products.length > 0 && unpriced === products.length && { page: 'products', text: 'Your products all say “Price on request”. Adding prices can help customers decide.' },
    draft.hero.slides.length < 2 && { page: 'hero', text: 'Add a second banner slide to show off another collection.' },
  ].filter(Boolean).slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="mail"
          label="New messages"
          value={badges.messages}
          detail={badges.messages > 0 ? 'Waiting for your reply' : 'All caught up'}
          highlight={badges.messages > 0}
          onClick={() => goTo('messages')}
        />
        <StatCard
          icon="star"
          label="Reviews to approve"
          value={badges.reviews}
          detail={badges.reviews > 0 ? 'Not on the website yet' : 'Nothing waiting'}
          highlight={badges.reviews > 0}
          onClick={() => goTo('reviews')}
        />
        <StatCard icon="cube" label="Products" value={products.length} detail="On your homepage" onClick={() => goTo('products')} />
        <StatCard icon="photo" label="Gallery photos" value={`${photos}/${MAX_GALLERY_IMAGES}`} detail={`${draft.hero.slides.length}/${MAX_HERO_SLIDES} banner slides`} onClick={() => goTo('gallery')} />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">What would you like to do?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.page + a.title}
              type="button"
              onClick={() => goTo(a.page)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-navy/30 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15"
            >
              <span className="w-11 h-11 shrink-0 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                <AdminIcon name={a.icon} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-slate-900">{a.title}</span>
                <span className="block text-sm text-slate-500 truncate">{a.text}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="admin-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">How to update your website</h2>
          <ol className="mt-4 space-y-4">
            {[
              ['Pick a section', 'Use the menu on the left (or the ☰ button on your phone).'],
              ['Make your changes', 'Type new text or upload photos. Nothing changes on the website yet.'],
              ['Click “Save changes”', 'The button appears at the bottom. Your website updates straight away.'],
            ].map(([title, text], i) => (
              <li key={title} className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block font-medium text-slate-900">{title}</span>
                  <span className="block text-sm text-slate-500">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="admin-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Suggestions</h2>
          {suggestions.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <AdminIcon name="checkCircle" className="w-5 h-5" /> Your website looks complete. Nice work!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {suggestions.map((s) => (
                <li key={s.text}>
                  <button type="button" onClick={() => goTo(s.page)} className="flex w-full items-start gap-3 rounded-xl p-2 -m-2 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15">
                    <AdminIcon name="lightbulb" className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                    <span className="flex-1 text-sm text-slate-700">{s.text}</span>
                    <AdminIcon name="chevronRight" className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
