import { defaultContent } from '../data/defaultContent'
import { MAX_HERO_SLIDES, SLIDE_FIELDS, clampAutoplaySeconds, createSlide } from './heroSlides'
import { MAX_GALLERY_IMAGES, normalizeGalleryItem } from './gallery'
import { resizeImage } from './imageResize'
import { MAX_PRODUCTS, normalizeProduct } from './products'
import { socialHref } from './social'
import { isSupabaseConfigured, supabase } from './supabase'

const CONTENT_ID = 'main'
const MEDIA_BUCKET = 'media'
// Generous enough for slow mobile connections; the site falls back to built-in content after this.
const FETCH_TIMEOUT_MS = 8000
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
export const ACCEPTED_IMAGE_TYPES = Object.keys(ALLOWED_IMAGE_TYPES).join(',')
export const MIN_PHONE_SLOTS = 3

// Template placeholders ('#', 'wa.me/9771XXXXXXXX') must not be migrated as real links.
const isRealLegacyLink = (value) =>
  typeof value === 'string' && value.trim() !== '' && value.trim() !== '#' && !/X{4,}/.test(value)

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]))
const omit = (obj, keys) => Object.fromEntries(Object.entries(obj || {}).filter(([k]) => !keys.includes(k)))

/**
 * Upgrades content saved by older versions of the site:
 * single hero → `hero.slides[]`,
 * single `contact.phone` → `contact.phones[]`, and
 * `contact.whatsapp` / `footer.facebook` / `footer.instagram` → `social`.
 */
function migrateLegacyContent(saved) {
  if (!saved || typeof saved !== 'object') return saved
  const out = { ...saved }

  if (saved.hero && !Array.isArray(saved.hero.slides)) {
    const legacySlide = pick(saved.hero, SLIDE_FIELDS)
    out.hero = {
      ...omit(saved.hero, SLIDE_FIELDS),
      ...(Object.keys(legacySlide).length ? { slides: [{ ...defaultContent.hero.slides[0], ...legacySlide }] } : {}),
    }
  }

  if (saved.contact && !Array.isArray(saved.contact.phones) && typeof saved.contact.phone === 'string') {
    out.contact = {
      ...saved.contact,
      phones: [{ id: 'phone-1', label: '', number: saved.contact.phone }],
    }
  }

  if (!saved.social) {
    const legacy = {
      whatsapp: saved.contact?.whatsapp,
      facebook: saved.footer?.facebook,
      instagram: saved.footer?.instagram,
    }
    out.social = Object.fromEntries(Object.entries(legacy).filter(([, v]) => isRealLegacyLink(v)))
  }
  return out
}

/** Keeps 1–MAX_HERO_SLIDES complete slides, pads phone slots, and strips legacy fields. */
function normalizeContent(content) {
  const phones = Array.isArray(content.contact?.phones) ? [...content.contact.phones] : []
  while (phones.length < MIN_PHONE_SLOTS) {
    phones.push({ id: `phone-${phones.length + 1}`, label: '', number: '' })
  }
  const { phone: _phone, whatsapp: _whatsapp, ...contact } = content.contact || {}
  const { facebook: _facebook, instagram: _instagram, ...footer } = content.footer || {}

  const savedSlides = Array.isArray(content.hero?.slides)
    ? content.hero.slides.filter((s) => s && typeof s === 'object')
    : []
  const slides = (savedSlides.length ? savedSlides : defaultContent.hero.slides)
    .slice(0, MAX_HERO_SLIDES)
    .map((s, i) => ({ ...createSlide(), id: `slide-${i + 1}`, ...s }))
  const hero = {
    ...omit(content.hero, SLIDE_FIELDS),
    autoplaySeconds: clampAutoplaySeconds(content.hero?.autoplaySeconds),
    slides,
  }

  const productItems = Array.isArray(content.products?.items) ? content.products.items : []
  const products = {
    ...content.products,
    items: productItems.filter((p) => p && typeof p === 'object').slice(0, MAX_PRODUCTS).map(normalizeProduct),
  }

  const galleryItems = Array.isArray(content.gallery?.items) ? content.gallery.items : []
  const gallery = {
    ...content.gallery,
    items: galleryItems
      .filter((g) => g && typeof g === 'object' && typeof g.image === 'string' && g.image.trim())
      .slice(0, MAX_GALLERY_IMAGES)
      .map(normalizeGalleryItem),
  }

  return { ...content, hero, products, gallery, contact: { ...contact, phones }, footer }
}

/**
 * Writes the legacy single-value fields alongside the new structure, so an
 * older deployment of the site still shows the right phone and links
 * while the new version is rolling out.
 */
function withLegacyFields(content) {
  const firstPhone = content.contact?.phones?.find((p) => p?.number?.trim())?.number ?? ''
  return {
    ...content,
    hero: { ...content.hero, ...pick(content.hero?.slides?.[0], SLIDE_FIELDS) },
    // Older deployments hid the price when showRequestPrice was true; always show the price text.
    products: { ...content.products, items: (content.products?.items || []).map((p) => ({ ...p, showRequestPrice: false })) },
    contact: {
      ...content.contact,
      phone: firstPhone,
      whatsapp: socialHref('whatsapp', content.social?.whatsapp) ?? '#',
    },
    footer: {
      ...content.footer,
      facebook: socialHref('facebook', content.social?.facebook) ?? '#',
      instagram: socialHref('instagram', content.social?.instagram) ?? '#',
    },
  }
}

/**
 * Deep-merge saved content over defaults (arrays replaced when present).
 * Empty strings are kept so admins can intentionally clear a field;
 * only missing (undefined/null) values fall back to the defaults.
 */
export function mergeContent(saved = {}) {
  const merge = (base, patch) => {
    if (!patch || typeof patch !== 'object') return base
    const out = { ...base }
    for (const key of Object.keys(patch)) {
      const pv = patch[key]
      const bv = base[key]
      if (Array.isArray(pv)) {
        out[key] = pv
      } else if (pv && typeof pv === 'object' && bv && typeof bv === 'object' && !Array.isArray(bv)) {
        out[key] = merge(bv, pv)
      } else if (pv !== undefined && pv !== null) {
        out[key] = pv
      }
    }
    return out
  }
  return normalizeContent(merge(defaultContent, migrateLegacyContent(saved)))
}

/** The content was changed elsewhere (another device or browser tab) after it was loaded here. */
export class ContentConflictError extends Error {
  constructor() {
    super('The website was changed somewhere else after you opened this page.')
    this.name = 'ContentConflictError'
  }
}

export async function fetchSiteContent() {
  if (!isSupabaseConfigured) {
    return { content: defaultContent, source: 'default', version: null }
  }

  try {
    // Bound the wait: the public site shows a loader until this resolves,
    // so a slow or unreachable Supabase must not block visitors indefinitely.
    const { data, error } = await supabase
      .from('website_content')
      .select('content, updated_at')
      .eq('id', CONTENT_ID)
      .abortSignal(AbortSignal.timeout(FETCH_TIMEOUT_MS))
      .maybeSingle()

    if (error) throw error

    const merged = mergeContent(data?.content || {})
    // `version` lets a later save detect edits made elsewhere in the meantime.
    return { content: merged, source: data?.content ? 'supabase' : 'default', version: data?.updated_at ?? null }
  } catch (error) {
    console.warn('Failed to load content from Supabase:', error?.message || error)
    return { content: defaultContent, source: 'default', version: null, error }
  }
}

/**
 * Saves the whole website content.
 * With `expectedVersion`, the save only succeeds if nobody changed the content since it was loaded
 * (otherwise a ContentConflictError is thrown). `force` skips that check.
 * Resolves to { content, version }.
 */
export async function saveSiteContent(content, { expectedVersion = null, force = false } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }

  const row = { content: withLegacyFields(content), updated_at: new Date().toISOString() }

  if (expectedVersion && !force) {
    const { data, error } = await supabase
      .from('website_content')
      .update(row)
      .eq('id', CONTENT_ID)
      .eq('updated_at', expectedVersion)
      .select('updated_at')
    if (error) throw error
    if (!data?.length) {
      // Nothing updated: either someone saved in between, or this account may not edit.
      const { data: current, error: readError } = await supabase
        .from('website_content')
        .select('updated_at')
        .eq('id', CONTENT_ID)
        .maybeSingle()
      if (readError) throw readError
      if (current && current.updated_at !== expectedVersion) throw new ContentConflictError()
      throw new Error('Your account is not allowed to change the website content.')
    }
    return { content: mergeContent(content), version: data[0].updated_at }
  }

  const { data, error } = await supabase
    .from('website_content')
    .upsert({ id: CONTENT_ID, ...row })
    .select('updated_at')
  if (error) throw error
  return { content: mergeContent(content), version: data?.[0]?.updated_at ?? row.updated_at }
}

export async function checkIsAdmin() {
  if (!isSupabaseConfigured || !supabase) return false

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) return false

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

/**
 * Uploads an image to the public media bucket and returns its URL.
 * JPG/PNG/WebP photos are resized in the browser first (see resizeImage), so large phone photos are accepted.
 */
export async function uploadImage(originalFile, { maxDimension = 2400, quality = 0.85, force = false } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  if (!ALLOWED_IMAGE_TYPES[originalFile.type]) {
    throw new Error('Unsupported file type. Please upload a JPG, PNG, WebP, GIF, or AVIF image.')
  }
  if (originalFile.size > MAX_SOURCE_BYTES) {
    throw new Error('Image is too large. Maximum size is 25 MB.')
  }

  const file = await resizeImage(originalFile, { maxDimension, quality, force })
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image is too large after compression (max 5 MB). GIF and AVIF files must be under 5 MB.')
  }

  const ext = ALLOWED_IMAGE_TYPES[file.type]
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
