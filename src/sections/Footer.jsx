import { Link } from 'react-router-dom'
import PhoneList from '../components/PhoneList'
import SocialIcon from '../components/SocialIcon'
import { useContent } from '../context/ContentContext'
import { getSocialLinks } from '../lib/social'
import { isExternalHref } from '../lib/url'

const quickLinks = [
  { label: 'Collection', to: '/collection' },
  { label: 'Our Craft', to: '/our-craft' },
  { label: 'Process', to: '/process' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const { content } = useContent()
  const footer = content.footer
  const contact = content.contact
  // Only platforms with a link set in the admin panel are shown.
  const socialLinks = getSocialLinks(content.social)

  return (
    <footer className="bg-navy text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <Link to="/" className="font-serif text-xl font-semibold text-white">
              {footer.brandName} <span className="text-gold">{footer.brandAccent}</span>
            </Link>
            <p className="mt-4 font-sans text-sm text-white/70 leading-relaxed">
              {footer.description}
            </p>
            <p className="mt-4 font-sans text-sm text-gold font-medium">
              {footer.tagline}
            </p>
          </div>
          <div>
            <h3 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">{footer.quickLinksTitle}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-sans text-white/80 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {socialLinks.length > 0 && (
            <div>
              <h3 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">{footer.socialTitle}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    {...(isExternalHref(s.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon platform={s.key} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-sans text-sm uppercase tracking-wider text-gold mb-4">{footer.contactTitle}</h3>
            {contact.address && <p className="font-sans text-sm text-white/80">{contact.address}</p>}
            <PhoneList
              phones={contact.phones}
              className="mt-2 space-y-1 font-sans text-sm text-white/80"
              labelClassName="text-white/60"
              itemClassName="hover:text-gold transition-colors"
            />
            {contact.email && (
              <a href={`mailto:${contact.email.trim()}`} className="block font-sans text-sm text-white/80 mt-2 hover:text-gold transition-colors break-all">
                {contact.email}
              </a>
            )}
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
