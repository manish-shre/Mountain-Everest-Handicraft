export const MAX_HERO_SLIDES = 3
export const DEFAULT_AUTOPLAY_SECONDS = 6

/** Fields of one hero slide (also the legacy single-hero fields). */
export const SLIDE_FIELDS = ['image', 'imageAlt', 'overline', 'title', 'subtitle', 'ctaPrimary', 'ctaSecondary']

export function createSlide(overrides = {}) {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    image: '',
    imageAlt: '',
    overline: '',
    title: '',
    subtitle: '',
    ctaPrimary: 'Shop Collection',
    ctaSecondary: 'Custom Order',
    ...overrides,
  }
}

/** 0 turns auto-advance off; anything else is kept between 3 and 30 seconds. */
export function clampAutoplaySeconds(value) {
  if (value === '' || value === null || value === undefined) return DEFAULT_AUTOPLAY_SECONDS
  const n = Number(value)
  if (!Number.isFinite(n)) return DEFAULT_AUTOPLAY_SECONDS
  if (n <= 0) return 0
  return Math.min(30, Math.max(3, Math.round(n)))
}
