import { useCallback, useEffect, useRef, useState } from 'react'
import CTAButton from '../components/CTAButton'
import { useContent } from '../context/ContentContext'
import { clampAutoplaySeconds } from '../lib/heroSlides'
import { SITE_NAME } from '../lib/sections'

const SWIPE_THRESHOLD_PX = 50

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden')
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}

const ArrowIcon = ({ direction }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
)

export default function Hero() {
  const { content } = useContent()
  const slides = content.hero?.slides?.length ? content.hero.slides : []
  const count = slides.length
  const autoplaySeconds = clampAutoplaySeconds(content.hero?.autoplaySeconds)

  const [index, setIndex] = useState(0)
  // Keyboard focus inside the slider pauses it (mouse hover does not: the hero fills the screen,
  // so a resting cursor would stop the slideshow for most desktop visitors).
  const [interacting, setInteracting] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const pageVisible = usePageVisible()
  const touchStartX = useRef(null)

  const hasMultiple = count > 1
  const autoplayEnabled = hasMultiple && autoplaySeconds > 0 && !reducedMotion
  const playing = autoplayEnabled && !interacting && pageVisible

  // Keep the index valid if the admin removes slides.
  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Restarts whenever the slide changes, so manual navigation gets a full interval.
  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), autoplaySeconds * 1000)
    return () => clearTimeout(timer)
  }, [playing, index, count, autoplaySeconds])

  if (count === 0) return null

  const onKeyDown = (e) => {
    if (!hasMultiple) return
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null || !hasMultiple) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
    if (dx < 0) next()
    else prev()
  }
  const fade = reducedMotion ? '' : 'transition-opacity duration-1000 ease-in-out'

  return (
    <section
      // touch-pan-y: vertical scrolling stays native, horizontal swipes belong to the slider
      // (otherwise mobile browsers may treat a swipe as "go back").
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-navy ${hasMultiple ? 'touch-pan-y' : ''}`}
      aria-roledescription={hasMultiple ? 'carousel' : undefined}
      aria-label={hasMultiple ? 'Featured highlights' : undefined}
      onKeyDown={onKeyDown}
      onFocus={(e) => { if (e.target.matches?.(':focus-visible')) setInteracting(true) }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false) }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background images (cross-fade) */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) =>
          slide.image ? (
            <img
              key={slide.id || i}
              src={slide.image}
              alt=""
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover ${fade} ${i === index ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-navy/60" />
      </div>

      {/* The page's single h1 must not live inside a slide: hidden slides are aria-hidden/inert. */}
      <h1 className="sr-only">{SITE_NAME} — Handcrafted Art from Nepal</h1>

      {/* Slide content: all slides share one grid cell, so the height never jumps between slides */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 grid" aria-live={playing ? 'off' : 'polite'}>
        {slides.map((slide, i) => {
          const active = i === index
          const Heading = 'h2'
          return (
            <div
              key={slide.id || i}
              role={hasMultiple ? 'group' : undefined}
              aria-roledescription={hasMultiple ? 'slide' : undefined}
              aria-label={hasMultiple ? `${i + 1} of ${count}` : undefined}
              aria-hidden={active ? undefined : true}
              inert={active ? undefined : ''}
              className={`[grid-area:1/1] text-center self-center ${fade} ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              {slide.imageAlt && slide.image && <span className="sr-only">{slide.imageAlt}</span>}
              {slide.overline && (
                <p className="font-sans text-sm uppercase tracking-[0.25em] text-gold-light mb-4">{slide.overline}</p>
              )}
              {slide.title && (
                <Heading className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
                  {slide.title}
                </Heading>
              )}
              {slide.subtitle && (
                <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">{slide.subtitle}</p>
              )}
              {(slide.ctaPrimary || slide.ctaSecondary) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {slide.ctaPrimary && (
                    <CTAButton href="/collection" variant="primary" className="min-w-[180px]">
                      {slide.ctaPrimary}
                    </CTAButton>
                  )}
                  {slide.ctaSecondary && (
                    <CTAButton href="/contact" variant="outlineLight" className="min-w-[180px]">
                      {slide.ctaSecondary}
                    </CTAButton>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
          >
            <ArrowIcon direction="right" />
          </button>

          <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    i === index ? 'w-8 bg-gold' : 'w-2.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
