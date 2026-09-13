import { useCallback, useEffect, useRef } from 'react'

const SWIPE_THRESHOLD_PX = 50

const Icon = ({ d }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
)

const buttonClasses =
  'flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors'

/** Full-screen image viewer: arrows / keyboard / swipe to navigate, Esc or backdrop click to close. */
export default function Lightbox({ items, index, onIndexChange, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const touchStartX = useRef(null)
  const item = items[index]
  const count = items.length

  const go = useCallback((delta) => onIndexChange((index + delta + count) % count), [index, count, onIndexChange])

  // Lock page scroll, focus the dialog, and give focus back to the thumbnail on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      previouslyFocused?.focus?.()
    }
  }, [])

  // Preload neighbours so next/previous feels instant.
  useEffect(() => {
    if (count < 2) return
    ;[items[(index + 1) % count], items[(index - 1 + count) % count]].forEach((n) => {
      if (n?.image) new Image().src = n.image
    })
  }, [index, items, count])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'ArrowRight' && count > 1) { e.preventDefault(); go(1) }
    else if (e.key === 'ArrowLeft' && count > 1) { e.preventDefault(); go(-1) }
    else if (e.key === 'Tab') {
      // Keep keyboard focus inside the dialog.
      const focusable = [...dialogRef.current.querySelectorAll('button')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ? `Image: ${item.caption}` : 'Image viewer'}
      onKeyDown={onKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || count < 2) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(dx < 0 ? 1 : -1)
      }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 px-4 py-16 sm:px-20 touch-pan-y overscroll-contain"
    >
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={`${buttonClasses} absolute top-4 right-4`}>
        <Icon d="M6 18L18 6M6 6l12 12" />
      </button>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${buttonClasses} absolute left-2 sm:left-5 top-1/2 -translate-y-1/2`}>
            <Icon d="M15 19l-7-7 7-7" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${buttonClasses} absolute right-2 sm:right-5 top-1/2 -translate-y-1/2`}>
            <Icon d="M9 5l7 7-7 7" />
          </button>
        </>
      )}

      <figure className="flex flex-col items-center max-w-full max-h-full" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <img
          key={item.id}
          src={item.image}
          alt={item.caption || 'Gallery image'}
          className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
          draggable="false"
        />
        <figcaption className="mt-4 text-center font-sans text-white/90 max-w-2xl">
          {item.caption && <span className="block text-base sm:text-lg">{item.caption}</span>}
          <span className="block text-sm text-white/60 mt-1">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
