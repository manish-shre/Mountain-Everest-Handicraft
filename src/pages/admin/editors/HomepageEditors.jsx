import AdminField from '../../../components/admin/AdminField'
import AdminGalleryManager from '../../../components/admin/AdminGalleryManager'
import AdminImageField from '../../../components/admin/AdminImageField'
import { AddButton, Callout, CollapsibleCard, Section, SectionTextFields, movable } from '../../../components/admin/ui'
import { MAX_HERO_SLIDES, createSlide } from '../../../lib/heroSlides'
import { MAX_PRODUCTS, PRICE_ON_REQUEST, PRODUCT_DESCRIPTION_MAX, PRODUCT_GRID_MAX, createProduct, isPriceOnRequest } from '../../../lib/products'
import { moveItem, updateAt, useOpenItems } from './listHelpers'

const confirmRemove = (what) => window.confirm(`Remove ${what}? It will disappear from your website after you click “Save changes”.`)

export function HeroEditor({ draft, set, setWith }) {
  const slides = draft.hero.slides
  const open = useOpenItems(slides.length === 1 ? [slides[0].id] : [])
  const update = (i, field, value) => setWith('hero.slides', (list) => updateAt(list, i, field, value))
  const add = () => {
    const slide = createSlide()
    setWith('hero.slides', (list) => (list.length >= MAX_HERO_SLIDES ? list : [...list, slide]))
    open.openOnly(slide.id)
  }
  const left = MAX_HERO_SLIDES - slides.length

  return (
    <>
      <Section title="Slides" description="Tap a slide to change its photo and text. Use the arrows to change the order.">
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <CollapsibleCard
              key={slide.id}
              id={slide.id}
              open={open.isOpen(slide.id)}
              onToggle={() => open.toggle(slide.id)}
              thumbnail={slide.image || ''}
              title={slide.title || `Slide ${i + 1}`}
              subtitle={`Slide ${i + 1} of ${slides.length}${slide.overline ? ` · ${slide.overline}` : ''}`}
              onMoveUp={slides.length > 1 ? movable(() => setWith('hero.slides', (l) => moveItem(l, i, -1)), i > 0) : undefined}
              onMoveDown={slides.length > 1 ? movable(() => setWith('hero.slides', (l) => moveItem(l, i, 1)), i < slides.length - 1) : undefined}
              onRemove={slides.length > 1 ? () => confirmRemove('this slide') && setWith('hero.slides', (l) => l.filter((_, x) => x !== i)) : undefined}
              removeLabel="Remove slide"
            >
              <AdminImageField label="Banner photo" hint="Wide (landscape) photos look best." fit="cover" value={slide.image} onChange={(v) => update(i, 'image', v)} />
              <AdminField label="Headline" value={slide.title} onChange={(v) => update(i, 'title', v)} placeholder="e.g. Mount Everest Handicraft" />
              <AdminField label="Small heading above the headline" value={slide.overline} onChange={(v) => update(i, 'overline', v)} />
              <AdminField label="Short description" type="textarea" rows={3} value={slide.subtitle} onChange={(v) => update(i, 'subtitle', v)} />
              <div className="grid sm:grid-cols-2 gap-5">
                <AdminField label="Gold button text" hint="Takes visitors to your collection. Leave empty to hide." value={slide.ctaPrimary} onChange={(v) => update(i, 'ctaPrimary', v)} />
                <AdminField label="Outline button text" hint="Takes visitors to the contact form. Leave empty to hide." value={slide.ctaSecondary} onChange={(v) => update(i, 'ctaSecondary', v)} />
              </div>
              <AdminField label="Photo description (optional)" hint="A few words describing the photo. Helps blind visitors and Google." value={slide.imageAlt} onChange={(v) => update(i, 'imageAlt', v)} />
            </CollapsibleCard>
          ))}
        </div>
        <AddButton onClick={add} disabled={left <= 0} note={left <= 0 ? 'You have the maximum of 3 slides.' : `You can add ${left} more.`}>
          Add a slide
        </AddButton>
      </Section>

      <Section title="Slide speed" description="How long each slide stays on screen before the next one appears.">
        <AdminField
          label="Seconds per slide"
          type="number"
          hint="Between 3 and 30 seconds. Enter 0 if you don’t want the slides to change by themselves."
          value={draft.hero.autoplaySeconds}
          onChange={(v) => set('hero.autoplaySeconds', v === '' ? '' : Number(v))}
        />
      </Section>
    </>
  )
}

export function AboutEditor({ draft, set }) {
  const about = draft.about
  const setParagraph = (index, value) => {
    const p = [...(about.paragraphs || [])]
    p[index] = value
    set('about.paragraphs', p)
  }
  return (
    <>
      <Section title="Photo" description="A portrait photo works best, for example the founder at work.">
        <AdminImageField label="About photo" fit="cover" value={about.image} onChange={(v) => set('about.image', v)} />
        <AdminField label="Photo description (optional)" hint="A few words describing the photo." value={about.imageAlt} onChange={(v) => set('about.imageAlt', v)} />
      </Section>
      <Section title="Your story">
        <AdminField label="Title" hint="For example the founder’s name." value={about.title} onChange={(v) => set('about.title', v)} />
        <AdminField label="Small heading" hint="The short gold text above the title, e.g. “Meet The Founder”." value={about.overline} onChange={(v) => set('about.overline', v)} />
        <AdminField label="First paragraph" type="textarea" rows={5} value={about.paragraphs?.[0]} onChange={(v) => setParagraph(0, v)} />
        <AdminField label="Second paragraph (optional)" type="textarea" rows={4} value={about.paragraphs?.[1]} onChange={(v) => setParagraph(1, v)} />
        <AdminField label="Closing line" hint="Shown in gold at the end." value={about.tagline} onChange={(v) => set('about.tagline', v)} />
      </Section>
    </>
  )
}

export function CategoriesEditor({ draft, set, setWith }) {
  const items = draft.categories.items || []
  const open = useOpenItems()
  const update = (i, field, value) => setWith('categories.items', (list) => updateAt(list, i, field, value))
  return (
    <>
      <Section title="Category cards" description="Tap a card to change its photo, name or description.">
        <div className="space-y-3">
          {items.map((item, i) => (
            <CollapsibleCard
              key={item.id || i}
              id={item.id || `cat-${i}`}
              open={open.isOpen(item.id || `cat-${i}`)}
              onToggle={() => open.toggle(item.id || `cat-${i}`)}
              thumbnail={item.image || ''}
              title={item.title || `Category ${i + 1}`}
              subtitle={item.description}
            >
              <AdminImageField label="Card photo" fit="cover" value={item.image} onChange={(v) => update(i, 'image', v)} />
              <AdminField label="Name" value={item.title} onChange={(v) => update(i, 'title', v)} />
              <AdminField label="Description" type="textarea" rows={3} value={item.description} onChange={(v) => update(i, 'description', v)} />
            </CollapsibleCard>
          ))}
        </div>
      </Section>
      <Section title="Section title & introduction">
        <SectionTextFields value={draft.categories} onChange={(field, v) => set(`categories.${field}`, v)} />
      </Section>
    </>
  )
}

export function ProductsEditor({ draft, set, setWith }) {
  const items = draft.products.items
  const open = useOpenItems()
  const update = (i, field, value) => setWith('products.items', (list) => updateAt(list, i, field, value))
  const add = () => {
    const product = createProduct()
    setWith('products.items', (list) => (list.length >= MAX_PRODUCTS ? list : [...list, product]))
    open.openOnly(product.id)
  }
  const left = MAX_PRODUCTS - items.length

  return (
    <>
      <Section title="Your products" description="Tap a product to change its photo, name, description or price.">
        {items.length > PRODUCT_GRID_MAX && (
          <Callout tone="info">You have {items.length} products, so visitors see them in a slider they can swipe through.</Callout>
        )}
        {items.length === 0 && <Callout tone="tip">You haven’t added any products yet. The products section is hidden until you add one.</Callout>}
        <div className="space-y-3">
          {items.map((item, i) => (
            <CollapsibleCard
              key={item.id}
              id={item.id}
              open={open.isOpen(item.id)}
              onToggle={() => open.toggle(item.id)}
              thumbnail={item.image || ''}
              title={item.name || 'New product'}
              subtitle={isPriceOnRequest(item.price) ? PRICE_ON_REQUEST : item.price}
              onMoveUp={movable(() => setWith('products.items', (l) => moveItem(l, i, -1)), i > 0)}
              onMoveDown={movable(() => setWith('products.items', (l) => moveItem(l, i, 1)), i < items.length - 1)}
              onRemove={() => confirmRemove(`“${item.name || 'this product'}”`) && setWith('products.items', (l) => l.filter((_, x) => x !== i))}
              removeLabel="Remove product"
            >
              <AdminImageField label="Product photo" hint="Square photos look best." fit="cover" value={item.image} onChange={(v) => update(i, 'image', v)} />
              <AdminField label="Product name" value={item.name} onChange={(v) => update(i, 'name', v)} placeholder="e.g. Silver Singing Bowl" />
              <AdminField
                label="Short description"
                type="textarea"
                rows={2}
                hint="One or two lines. Longer text is cut off on the card."
                maxLength={PRODUCT_DESCRIPTION_MAX}
                value={item.description}
                onChange={(v) => update(i, 'description', v)}
              />
              <AdminField
                label="Price"
                placeholder="e.g. NPR 25,000"
                hint={`Leave empty to show “${PRICE_ON_REQUEST}”.`}
                value={isPriceOnRequest(item.price) ? '' : item.price}
                onChange={(v) => update(i, 'price', v)}
              />
            </CollapsibleCard>
          ))}
        </div>
        <AddButton onClick={add} disabled={left <= 0} note={left <= 0 ? `You have the maximum of ${MAX_PRODUCTS} products.` : `${items.length} of ${MAX_PRODUCTS} products`}>
          Add a product
        </AddButton>
      </Section>
      <Section title="Section title & introduction">
        <SectionTextFields value={draft.products} onChange={(field, v) => set(`products.${field}`, v)} />
      </Section>
    </>
  )
}

export function CustomOrdersEditor({ draft, set }) {
  const c = draft.customOrders
  return (
    <Section title="Custom orders banner">
      <AdminField label="Title" value={c.title} onChange={(v) => set('customOrders.title', v)} />
      <AdminField label="Small heading" hint="The short gold text above the title." value={c.overline} onChange={(v) => set('customOrders.overline', v)} />
      <AdminField label="Description" type="textarea" rows={4} value={c.subtitle} onChange={(v) => set('customOrders.subtitle', v)} />
      <AdminField label="Button text" hint="The button takes visitors to the contact form." value={c.cta} onChange={(v) => set('customOrders.cta', v)} />
    </Section>
  )
}

export function ProcessEditor({ draft, set, setWith }) {
  const steps = draft.process.steps || []
  const open = useOpenItems()
  const update = (i, field, value) => setWith('process.steps', (list) => updateAt(list, i, field, value))
  return (
    <>
      <Section title="Steps" description="Tap a step to change its name or explanation.">
        <div className="space-y-3">
          {steps.map((step, i) => (
            <CollapsibleCard
              key={step.id || i}
              id={step.id || `step-${i}`}
              open={open.isOpen(step.id || `step-${i}`)}
              onToggle={() => open.toggle(step.id || `step-${i}`)}
              number={i + 1}
              title={step.title || `Step ${i + 1}`}
              subtitle={step.description}
            >
              <AdminField label="Step name" value={step.title} onChange={(v) => update(i, 'title', v)} />
              <AdminField label="Explanation" type="textarea" rows={3} value={step.description} onChange={(v) => update(i, 'description', v)} />
            </CollapsibleCard>
          ))}
        </div>
      </Section>
      <Section title="Section title & introduction">
        <SectionTextFields value={draft.process} onChange={(field, v) => set(`process.${field}`, v)} />
      </Section>
    </>
  )
}

export function GalleryEditor({ draft, set, setWith }) {
  return (
    <>
      <Section title="Photos" description="Upload photos of events, your workshop and new products. They appear in the order shown here.">
        <AdminGalleryManager items={draft.gallery.items} onChange={(updater) => setWith('gallery.items', updater)} />
      </Section>
      <Section title="Section title & introduction">
        <SectionTextFields value={draft.gallery} onChange={(field, v) => set(`gallery.${field}`, v)} introRows={2} />
      </Section>
    </>
  )
}

export function TestimonialsEditor({ draft, set, goTo }) {
  const t = draft.testimonials
  return (
    <>
      <Callout
        tone="info"
        title="Looking for the reviews themselves?"
        action={<button type="button" onClick={() => goTo('reviews')} className="admin-btn-secondary">Go to Customer reviews</button>}
      >
        Customers write reviews on your website, and you approve them in Customer reviews. This page only changes the text around them.
      </Callout>
      <Section title="Section title & introduction">
        <SectionTextFields value={t} onChange={(field, v) => set(`testimonials.${field}`, v)} />
      </Section>
      <Section title="Review form">
        <AdminField label="Button text" hint="The button customers click to write a review. Leave empty to hide the form." value={t.cta} onChange={(v) => set('testimonials.cta', v)} />
        <AdminField label="Message when there are no reviews yet" type="textarea" rows={2} value={t.emptyText} onChange={(v) => set('testimonials.emptyText', v)} />
      </Section>
    </>
  )
}
