export const MAX_GALLERY_IMAGES = 15
export const GALLERY_THUMB_SIZE = 640
export const GALLERY_FULL_SIZE = 2000

export function createGalleryItem(overrides = {}) {
  return {
    id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    image: '',
    thumb: '',
    caption: '',
    ...overrides,
  }
}

/** Current shape: image, thumbnail and optional caption (older saves also had a category, now unused). */
export function normalizeGalleryItem(item, index) {
  const { category: _category, ...rest } = item || {}
  return { ...createGalleryItem(), id: `gal-${index + 1}`, ...rest }
}

/**
 * Position of slide `index` relative to the active slide on a circular track:
 * 0 = centre, -1 = left neighbour, 1 = right neighbour, ±2… = off-stage.
 */
export function circularOffset(index, active, count) {
  if (count <= 1) return 0
  let offset = (index - active) % count
  if (offset < 0) offset += count
  // Anything past the halfway point sits on the left. With exactly 2 photos the other one goes right.
  return offset > count / 2 ? offset - count : offset
}
