export const MAX_PRODUCTS = 20
/** More products than this turns the Featured Products grid into a slider. */
export const PRODUCT_GRID_MAX = 4
export const PRODUCT_DESCRIPTION_MAX = 160
export const PRICE_ON_REQUEST = 'Price on request'

export function createProduct(overrides = {}) {
  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: '',
    description: '',
    image: '',
    price: '',
    ...overrides,
  }
}

/** Empty price or "Price on request" means the customer has to ask. */
export const isPriceOnRequest = (price) =>
  !String(price ?? '').trim() || String(price).trim().toLowerCase() === PRICE_ON_REQUEST.toLowerCase()

/**
 * Brings a saved product up to the current shape. Older versions had a
 * `showRequestPrice` checkbox that hid the price; keep what visitors saw.
 */
export function normalizeProduct(product, index) {
  const { showRequestPrice, ...rest } = product || {}
  return {
    ...createProduct(),
    id: `prod-${index + 1}`,
    ...rest,
    ...(showRequestPrice === true ? { price: PRICE_ON_REQUEST } : {}),
  }
}
