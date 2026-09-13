import AdminField from '../../../components/admin/AdminField'
import AdminImageField from '../../../components/admin/AdminImageField'
import { Callout, Section } from '../../../components/admin/ui'

export function LogoEditor({ draft, set }) {
  return (
    <Section title="Website logo" description="A PNG with a transparent background looks best.">
      <AdminImageField label="Logo" value={draft.logo} onChange={(v) => set('logo', v)} />
    </Section>
  )
}

export function FooterEditor({ draft, set, goTo }) {
  const f = draft.footer
  return (
    <>
      <Section title="Brand">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminField label="Business name" hint="Shown in white." value={f.brandName} onChange={(v) => set('footer.brandName', v)} />
          <AdminField label="Highlighted words" hint="Shown in gold after the name." value={f.brandAccent} onChange={(v) => set('footer.brandAccent', v)} />
        </div>
        <AdminField label="Short description" type="textarea" rows={3} value={f.description} onChange={(v) => set('footer.description', v)} />
        <AdminField label="Tagline" value={f.tagline} onChange={(v) => set('footer.tagline', v)} />
      </Section>
      <Section title="Column headings">
        <div className="grid sm:grid-cols-3 gap-5">
          <AdminField label="Links column" value={f.quickLinksTitle} onChange={(v) => set('footer.quickLinksTitle', v)} />
          <AdminField label="Social media column" value={f.socialTitle} onChange={(v) => set('footer.socialTitle', v)} />
          <AdminField label="Contact column" value={f.contactTitle} onChange={(v) => set('footer.contactTitle', v)} />
        </div>
      </Section>
      <Section title="Copyright">
        <AdminField label="Copyright name" hint="Shown as “© 2026 [name]. All rights reserved.”" value={f.copyright} onChange={(v) => set('footer.copyright', v)} />
      </Section>
      <Callout tone="info" action={<button type="button" onClick={() => goTo('phonesSocial')} className="admin-btn-secondary">Edit phone & social media</button>}>
        The phone numbers and social media icons in the footer come from the “Phone & social media” page.
      </Callout>
    </>
  )
}
