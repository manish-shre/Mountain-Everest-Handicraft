import { useCallback, useEffect, useRef, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import ProductCard from '../components/ProductCard'
import { useContent } from '../context/ContentContext'
import { PRODUCT_GRID_MAX } from '../lib/products'

const Chevron = ({ direction }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
)

const arrowClasses =
  'w-11 h-11 flex items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-soft transition-colors hover:bg-gold hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-navy/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold'

/**
 * Horizontal, swipeable product slider built on native scroll-snap:
 * touch/trackpad scrolling works everywhere, arrows and dots move one "page" at a time.
 */
function ProductSlider({ items }) {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const pages = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth))
    setPageCount(pages)
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft >= maxScroll - 2)
    setPage(el.scrollLeft >= maxScroll - 2 ? pages - 1 : Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  useEffect(() => {
    measure()
    const el = trackRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, items.length])

  const scrollToPage = (target) => {
    const el = trackRef.current
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: target * el.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div>
      <div className="flex justify-end gap-3 mb-5">
        <button type="button" className={arrowClasses} onClick={() => scrollToPage(page - 1)} disabled={atStart} aria-label="Previous products" aria-controls="featured-products-track">
          <Chevron direction="left" />
        </button>
        <button type="button" className={arrowClasses} onClick={() => scrollToPage(page + 1)} disabled={atEnd} aria-label="Next products" aria-controls="featured-products-track">
          <Chevron direction="right" />
        </button>
      </div>

      <div
        id="featured-products-track"
        ref={trackRef}
        onScroll={measure}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
        tabIndex={0}
        // overscroll-x-contain: swiping past the ends must not trigger the browser's back/forward gesture.
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain scroll-smooth pt-2 pb-6 -mb-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((product, i) => (
          <div
            key={product.id || i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="snap-start shrink-0 w-[80%] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to page ${i + 1} of ${pageCount}`}
              aria-current={i === page ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                i === page ? 'w-8 bg-gold' : 'w-2.5 bg-navy/20 hover:bg-navy/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FeaturedProducts() {
  const { content } = useContent()
  const section = content.products
  const items = section.items || []

  if (items.length === 0) return null

  return (
    <section id="products" className="py-20 md:py-28 bg-cream pattern-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader overline={section.overline} title={section.title} subtitle={section.subtitle} />
        {items.length > PRODUCT_GRID_MAX ? (
          <ProductSlider items={items} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {items.map((product) => (
              <ProductCard key={product.id || product.name} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
