import { useEffect } from 'react'

/** Tells search engines not to index admin pages (backs up the X-Robots-Tag header in vercel.json). */
export default function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const previousTitle = document.title
    document.title = 'Website Manager | Mount Everest Handicraft'
    return () => {
      meta.remove()
      document.title = previousTitle
    }
  }, [])
}
