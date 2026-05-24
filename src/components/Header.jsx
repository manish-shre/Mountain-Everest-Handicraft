import { useState } from 'react'
import CTAButton from './CTAButton'
import { useContent } from '../context/ContentContext'

export default function Header() {
  const { content } = useContent()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: 'Collection', href: '#categories' },
    { label: 'Our Craft', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] sm:min-h-20 md:min-h-[5.25rem] py-2 sm:py-2.5">
          <a href="#" className="flex items-center shrink-0 min-w-0" aria-label="Mount Everest Gold & Silver Handicraft — Home">
            <img
              src={content.logo}
              alt="Mount Everest Gold & Silver Handicraft"
              className="h-[clamp(2.75rem,10vw,3.5rem)] sm:h-14 md:h-16 lg:h-[4.5rem] w-auto max-w-[min(58vw,11rem)] sm:max-w-[13rem] md:max-w-[15rem] lg:max-w-[17rem] object-contain object-left"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-navy/80 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
            <CTAButton href="#contact" variant="outline">
              Custom Order
            </CTAButton>
          </nav>

          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center text-navy"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <nav className="md:hidden py-4 border-t border-cream-dark/30 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-navy/80 hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <CTAButton href="#contact" variant="outline" className="self-start">
              Custom Order
            </CTAButton>
          </nav>
        )}
      </div>
    </header>
  )
}
