import { useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Categories from '../sections/Categories'
import FeaturedProducts from '../sections/FeaturedProducts'
import CustomOrders from '../sections/CustomOrders'
import Process from '../sections/Process'
import Gallery from '../sections/Gallery'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import { useContent } from '../context/ContentContext'
import { SITE_NAME, SITE_TITLE, pathForSection, sectionById, sectionBySlug } from '../lib/sections'

const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown']

/** Scrolls to the section named in the URL whenever the user navigates (including clicking the same link again). */
function useSectionScroll(loading) {
  const location = useLocation()
  const navigate = useNavigate()
  const { section: slug } = useParams()
  const firstRun = useRef(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (loading) return

    // Old links like /#contact → /contact
    const legacyId = location.hash.slice(1)
    if (legacyId && sectionById(legacyId)) {
      navigate(pathForSection(legacyId), { replace: true })
      return
    }

    const initial = firstRun.current
    firstRun.current = false
    const section = sectionBySlug(slug)
    document.title = section ? `${section.title} | ${SITE_NAME}` : SITE_TITLE

    if (!section) {
      if (!initial) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const scrollToSection = (behavior) =>
      document.getElementById(section.id)?.scrollIntoView({ behavior, block: 'start' })

    if (!initial) {
      scrollToSection('smooth')
      return
    }

    // Direct visit (e.g. opening /contact): jump there, then re-align a few times while
    // images and reviews finish loading above it — unless the visitor starts scrolling.
    scrollToSection('instant')
    let userScrolled = false
    const stop = () => { userScrolled = true }
    USER_SCROLL_EVENTS.forEach((e) => window.addEventListener(e, stop, { passive: true }))
    const timers = [250, 700, 1500].map((ms) => setTimeout(() => { if (!userScrolled) scrollToSection('instant') }, ms))
    return () => {
      timers.forEach(clearTimeout)
      USER_SCROLL_EVENTS.forEach((e) => window.removeEventListener(e, stop))
    }
    // location.key changes on every navigation, even to the same path.
  }, [location.key, loading]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default function HomePage() {
  const { loading } = useContent()
  const { section: slug } = useParams()
  useSectionScroll(loading)

  if (slug && !sectionBySlug(slug)) return <Navigate to="/" replace />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" aria-hidden="true" />
          <span className="font-sans text-sm text-navy/70">Loading…</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Categories />
        <FeaturedProducts />
        <CustomOrders />
        <Process />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
