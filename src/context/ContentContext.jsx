import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { fetchSiteContent, mergeContent, saveSiteContent } from '../lib/contentService'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('default')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchSiteContent()
      setContent(result.content)
      setSource(result.source)
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

  const persistContent = useCallback(async (data) => {
    const toSave = data ?? content
    const saved = await saveSiteContent(toSave)
    setContent(saved)
    setSource('supabase')
    return saved
  }, [content])

  const value = useMemo(
    () => ({
      content,
      loading,
      source,
      reload: load,
      updateContent,
      persistContent,
    }),
    [content, loading, source, load, updateContent, persistContent],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
