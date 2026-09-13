import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CTAButton from './CTAButton'
import { useContent } from '../context/ContentContext'

const navLinks = [
  { label: 'Collection', to: '/collection' },
  { label: 'Our Craft', to: '/our-craft' },
  { label: 'Process', to: '/process' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const { content } = useContent()
  const [open, setOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    setLogoError(false)
  }, [content.logo])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] sm:min-h-20 md:min-h-[5.25rem] py-2 sm:py-2.5">
          <Link to="/" onClick={close} className="flex items-center shrink-0 min-w-0" aria-label="Mount Everest Gold & Silver Handicraft — Home">
            {content.logo && !logoError ? (
              <img
                src={content.logo}
                alt="Mount Everest Gold & Silver Handicraft"
                onError={() => setLogoError(true)}
                className="h-[clamp(2.75rem,10vw,3.5rem)] sm:h-14 md:h-16 lg:h-[4.5rem] w-auto max-w-[min(58vw,11rem)] sm:max-w-[13rem] md:max-w-[15rem] lg:max-w-[17rem] object-contain object-left"
              />
            ) : (
              <span className="font-serif text-lg sm:text-xl font-semibold text-navy">
                Mount Everest <span className="text-gold-deep">Handicraft</span>
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-sans text-sm text-navy/80 hover:text-gold-deep transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CTAButton href="/contact" variant="outline">
              Custom Order
            </CTAButton>
          </nav>

          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center text-navy"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Mobile" className="md:hidden py-4 border-t border-cream-dark/30 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-sans text-navy/80 hover:text-gold-deep"
                onClick={close}
              >
                {link.label}
              </Link>
            ))}
            <CTAButton href="/contact" variant="outline" className="self-start" onClick={close}>
              Custom Order
            </CTAButton>
          </nav>
        )}
      </div>
    </header>
  )
}
