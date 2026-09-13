import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { prefillContactMessage } from '../lib/contactPrefill'
import { PRICE_ON_REQUEST, isPriceOnRequest } from '../lib/products'

export default function ProductCard({ name, description, image, price }) {
  const [imgError, setImgError] = useState(false)
  useEffect(() => setImgError(false), [image])

  const onRequest = isPriceOnRequest(price)
  const priceText = onRequest ? PRICE_ON_REQUEST : String(price).trim()

  const handleEnquire = () => {
    prefillContactMessage(
      onRequest
        ? `Hello, I would like to know the price of "${name}".`
        : `Hello, I am interested in "${name}" (${priceText}). Please share more details.`,
    )
  }

  return (
    <article className="group h-full rounded-2xl overflow-hidden bg-white border border-cream-dark/50 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-cream-dark/30">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/25" aria-hidden="true">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-serif text-lg md:text-xl font-semibold text-navy mb-1 line-clamp-2">{name}</h3>
        {description && <p className="font-sans text-sm text-navy/80 line-clamp-2 mb-4">{description}</p>}
        <div className="mt-auto">
          <p className={onRequest ? 'font-sans text-base font-medium text-navy/80' : 'font-serif text-xl font-semibold text-gold-deep'}>
            {priceText}
          </p>
          <Link
            to="/contact"
            onClick={handleEnquire}
            className="mt-4 flex w-full items-center justify-center py-2.5 rounded-xl bg-navy text-white font-sans text-sm font-medium hover:bg-navy-light transition-colors"
          >
            {onRequest ? 'Request Price' : 'Enquire Now'}
          </Link>
        </div>
      </div>
    </article>
  )
}
