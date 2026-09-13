import AdminField from '../../../components/admin/AdminField'
import AdminIcon from '../../../components/admin/AdminIcon'
import SocialIcon from '../../../components/SocialIcon'
import { AddButton, Callout, IconButton, Section, SectionTextFields } from '../../../components/admin/ui'
import { MIN_PHONE_SLOTS } from '../../../lib/contentService'
import { isShortMapsLink, mapEmbedSrc } from '../../../lib/maps'
import { SOCIAL_PLATFORMS, socialHref } from '../../../lib/social'
import { updateAt } from './listHelpers'

export function PhonesSocialEditor({ draft, set, setWith }) {
  const phones = draft.contact.phones
  const updatePhone = (i, field, value) => setWith('contact.phones', (list) => updateAt(list, i, field, value))
  const addPhone = () => setWith('contact.phones', (list) => [...list, { id: `phone-${Date.now()}`, label: '', number: '' }])
  const removePhone = (i) => setWith('contact.phones', (list) => list.filter((_, x) => x !== i))
  const socialCount = SOCIAL_PLATFORMS.filter((p) => socialHref(p.key, draft.social?.[p.key])).length

  return (
    <>
      <Section title="Phone numbers" description="Shown in the contact section and at the bottom of every page. Empty numbers are hidden.">
        <div className="space-y-3">
          {phones.map((phone, i) => (
            <div key={phone.id || i} className="grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,12rem)_1fr_auto] gap-3 items-end rounded-xl border border-slate-200 p-3 sm:p-4">
              <AdminField label={`Label ${i + 1} (optional)`} placeholder="Mobile, Shop, Office…" value={phone.label} onChange={(v) => updatePhone(i, 'label', v)} className="col-span-2 sm:col-span-1" />
              <AdminField label="Phone number" type="tel" placeholder="+977 98XXXXXXXX" value={phone.number} onChange={(v) => updatePhone(i, 'number', v)} />
              {phones.length > MIN_PHONE_SLOTS ? (
                <IconButton icon="trash" label={`Remove phone ${i + 1}`} tone="danger" onClick={() => removePhone(i)} />
              ) : (
                <span className="w-9" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
        <AddButton onClick={addPhone}>Add another number</AddButton>
      </Section>

      <Section
        title="Social media & chat apps"
        description="Paste the link to your page or profile. Leave a box empty to hide that icon."
        actions={<span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{socialCount} shown on website</span>}
      >
        <Callout tone="tip">For WhatsApp and Viber you can simply type your phone number with country code, e.g. +977 9851448533.</Callout>
        <div className="grid md:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const value = draft.social?.[platform.key] ?? ''
            const href = socialHref(platform.key, value)
            return (
              <div key={platform.key} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${href ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <SocialIcon platform={platform.key} className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-slate-900">{platform.label}</span>
                </div>
                <AdminField
                  label=""
                  ariaLabel={`${platform.label} link`}
                  hint={platform.hint}
                  placeholder={platform.placeholder}
                  value={value}
                  onChange={(v) => set(`social.${platform.key}`, v)}
                />
                {value.trim() &&
                  (href ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700">
                      <AdminIcon name="checkCircle" className="w-4 h-4" /> Looks good — the icon will appear
                    </p>
                  ) : (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AdminIcon name="warning" className="w-4 h-4" /> Not recognised. Paste the full link starting with https://
                    </p>
                  ))}
              </div>
            )
          })}
        </div>
      </Section>
    </>
  )
}

export function ContactEditor({ draft, set, goTo }) {
  const c = draft.contact
  const previewSrc = mapEmbedSrc(c.mapLocation)
  return (
    <>
      <Section title="Email & address">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminField label="Email address" type="email" hint="Messages from the contact form can also be replied to from here." value={c.email} onChange={(v) => set('contact.email', v)} />
          <AdminField label="Shop / workshop address" hint="Shown in the contact section and footer." value={c.address} onChange={(v) => set('contact.address', v)} />
        </div>
        <Callout tone="info" action={<button type="button" onClick={() => goTo('phonesSocial')} className="admin-btn-secondary">Edit phone numbers</button>}>
          Phone numbers, WhatsApp and Viber are on the “Phone & social media” page.
        </Callout>
      </Section>

      <Section title="Google Map" description="The map shown below the contact form. Leave the location empty to hide it.">
        <AdminField
          label="Map location"
          hint="Type your address or plus code (e.g. P855+GXG Kathmandu), or paste a full Google Maps link."
          value={c.mapLocation}
          onChange={(v) => set('contact.mapLocation', v)}
        />
        {isShortMapsLink(c.mapLocation) && (
          <Callout tone="warning">
            Short share links (maps.app.goo.gl) can’t show a map. Paste that link in “Google Maps share link” below, and type your address or plus code here.
          </Callout>
        )}
        {previewSrc ? (
          <div>
            <span className="admin-label">Preview</span>
            <iframe title="Map preview" src={previewSrc} className="block w-full h-64 rounded-xl border border-slate-200" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        ) : (
          <p className="text-sm text-slate-500">No map will be shown until a location is entered.</p>
        )}
        <AdminField
          label="Google Maps share link"
          hint="In Google Maps, tap Share and copy the link. The “Get Directions” button opens it."
          value={c.mapLink}
          onChange={(v) => set('contact.mapLink', v.trim())}
        />
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminField label="Title under the map" value={c.mapTitle} onChange={(v) => set('contact.mapTitle', v)} />
          <AdminField label="Directions button text" value={c.directionsLabel} onChange={(v) => set('contact.directionsLabel', v)} />
        </div>
      </Section>

      <Section title="Chat buttons" description="These buttons appear in the contact section when a WhatsApp or Viber number is added.">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminField label="WhatsApp button text" value={c.whatsappLabel} onChange={(v) => set('contact.whatsappLabel', v)} />
          <AdminField label="Viber button text" value={c.viberLabel} onChange={(v) => set('contact.viberLabel', v)} />
        </div>
      </Section>

      <Section title="Section title & introduction">
        <SectionTextFields value={c} onChange={(field, v) => set(`contact.${field}`, v)} />
      </Section>
    </>
  )
}
