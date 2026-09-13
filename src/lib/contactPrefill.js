const EVENT = 'contact:prefill'

/** Ask the contact form to prefill its message (e.g. from a product card). */
export function prefillContactMessage(message) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message } }))
}

/** Subscribe to prefill requests; returns an unsubscribe function. */
export function onContactPrefill(handler) {
  const listener = (e) => handler(e.detail?.message ?? '')
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
