import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { fetchSiteContent, mergeContent, saveSiteContent } from '../lib/contentService'
import { isSupabaseConfigured } from '../lib/supabase'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  // Start in a loading state when remote content is expected, so visitors
  // don't see default placeholder copy flash before the real content arrives.
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [source, setSource] = useState('default')
  const [loadError, setLoadError] = useState(null)
  // updated_at of the loaded content; used to detect changes made on another device before saving.
  const versionRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchSiteContent()
      versionRef.current = result.version ?? null
      setContent(result.content)
      setSource(result.source)
      setLoadError(result.error ?? null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateContent = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return mergeContent(next)
    })
  }, [])

  /** Saves content. Throws ContentConflictError if it changed elsewhere, unless `force` is set. */
  const persistContent = useCallback(async (data, { force = false } = {}) => {
    const toSave = data ?? content
    const saved = await saveSiteContent(toSave, { expectedVersion: versionRef.current, force })
    versionRef.current = saved.version
    setContent(saved.content)
    setSource('supabase')
    setLoadError(null)
    return saved.content
  }, [content])

  const value = useMemo(
    () => ({
      content,
      loading,
      source,
      loadError,
      reload: load,
      updateContent,
      persistContent,
    }),
    [content, loading, source, loadError, load, updateContent, persistContent],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
