import { useEffect, useMemo, useRef, useState } from 'react'
import Lightbox from '../components/Lightbox'
import SectionHeader from '../components/SectionHeader'
import { useContent } from '../context/ContentContext'
import { circularOffset } from '../lib/gallery'

const SWIPE_THRESHOLD_PX = 50

// Where each slide sits, by its offset from the active one. Static class strings so Tailwind keeps them.
const POSITION = {
  center: 'left-[11%] w-[78%] top-0 h-full sm:left-[17.5%] sm:w-[65%] z-20 opacity-100',
  left: 'left-0 w-[9%] top-[22%] h-[56%] sm:w-[15%] z-10 opacity-100',
  right: 'left-[91%] w-[9%] top-[22%] h-[56%] sm:left-[85%] sm:w-[15%] z-10 opacity-100',
  hiddenLeft: 'left-[-12%] w-[8%] top-[30%] h-[40%] z-0 opacity-0 pointer-events-none',
  hiddenRight: 'left-[104%] w-[8%] top-[30%] h-[40%] z-0 opacity-0 pointer-events-none',
}
const positionFor = (offset) =>
  offset === 0 ? POSITION.center : offset === -1 ? POSITION.left : offset === 1 ? POSITION.right : offset < 0 ? POSITION.hiddenLeft : POSITION.hiddenRight

export default function Gallery() {
  const { content } = useContent()
  const section = content.gallery
  const items = useMemo(() => section?.items || [], [section?.items])
  const count = items.length
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (active >= count) setActive(0)
  }, [active, count])

  // Preload the full-size neighbours so they are sharp as soon as they reach the centre.
  useEffect(() => {
    if (count < 2) return
    ;[items[(active + 1) % count], items[(active - 1 + count) % count]].forEach((n) => {
      if (n?.image) new Image().src = n.image
    })
  }, [active, count, items])

  if (count === 0) return null

  const goTo = (i) => setActive(((i % count) + count) % count)
  const onKeyDown = (e) => {
    if (count < 2) return
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1) }
  }

  return (
    <section id="gallery" className="py-20 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader overline={section.overline} title={section.title} subtitle={section.subtitle} />

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={section.title || 'Gallery'}
          onKeyDown={onKeyDown}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || count < 2) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) goTo(active + (dx < 0 ? 1 : -1))
          }}
          className="relative w-full aspect-[4/3] sm:aspect-[16/7] touch-pan-y select-none"
        >
          {items.map((item, i) => {
            const offset = circularOffset(i, active, count)
            const isCenter = offset === 0
            const isSide = Math.abs(offset) === 1
            // Only the centre, its neighbours and the next ones in line are rendered; the rest stay empty.
            const rendered = Math.abs(offset) <= 2
            const label = isCenter
              ? `View photo ${i + 1} of ${count} full screen${item.caption ? `: ${item.caption}` : ''}`
              : `Show photo ${i + 1} of ${count}${item.caption ? `: ${item.caption}` : ''}`
            return (
              <button
                key={item.id}
                type="button"
                tabIndex={isCenter || isSide ? 0 : -1}
                aria-hidden={isCenter || isSide ? undefined : true}
                aria-label={label}
                onClick={() => (isCenter ? setLightboxOpen(true) : goTo(i))}
                className={`absolute overflow-hidden rounded-2xl bg-cream-dark/50 shadow-soft-lg transition-all duration-500 ease-out motion-reduce:transition-none focus:outline-none focus-visible:ring-4 focus-visible:ring-gold ${
                  isCenter ? 'cursor-zoom-in' : 'cursor-pointer hover:opacity-90'
                } ${positionFor(offset)}`}
              >
                {rendered && (
                  <img
                    src={isCenter ? item.image : item.thumb || item.image}
                    alt={item.caption || `Gallery photo ${i + 1}`}
                    decoding="async"
                    draggable="false"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            )
          })}

          {count > 1 && (
            <div className="absolute z-30 bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === active ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    i === active ? 'w-2 bg-white scale-125' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox items={items} index={active} onIndexChange={setActive} onClose={() => setLightboxOpen(false)} />
      )}
    </section>
  )
}
