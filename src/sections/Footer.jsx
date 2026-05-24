import { useContent } from '../context/ContentContext'

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.074-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.074 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.074-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export default function Footer() {
  const { content } = useContent()
  const footer = content.footer
  const contact = content.contact

  const quickLinks = [
    { label: 'Collection', href: '#categories' },
    { label: 'Our Craft', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    { label: 'Facebook', href: footer.facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: footer.instagram, Icon: InstagramIcon },
  ]

  return (
    <footer className="bg-navy text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <a href="#" className="font-serif text-xl font-semibold text-white">
              {footer.brandName} <span className="text-gold">{footer.brandAccent}</span>
            </a>
            <p className="mt-4 font-sans text-sm text-white/70 leading-relaxed">
              {footer.description}
            </p>
            <p className="mt-4 font-sans text-sm text-gold font-medium">
              {footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-sans text-white/80 hover:text-gold transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((s) => {
                const Icon = s.Icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                    aria-label={s.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
          <div>
            <h4 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">Contact</h4>
            <p className="font-sans text-sm text-white/80">{contact.address}</p>
            <p className="font-sans text-sm text-white/80 mt-1">{contact.email}</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="font-sans text-sm text-white/60">
            © {new Date().getFullYear()} {footer.copyright}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
