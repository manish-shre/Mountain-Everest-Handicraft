import { defaultContent } from '../data/defaultContent'
import { isSupabaseConfigured, supabase } from './supabase'

const CONTENT_ID = 'main'
const MEDIA_BUCKET = 'media'

/** Deep-merge saved content over defaults (arrays replaced when present). */
export function mergeContent(saved = {}) {
  const merge = (base, patch) => {
    if (!patch || typeof patch !== 'object') return base
    const out = { ...base }
    for (const key of Object.keys(patch)) {
      const pv = patch[key]
      const bv = base[key]
      if (Array.isArray(pv)) {
        out[key] = pv
      } else if (pv && typeof pv === 'object' && !Array.isArray(pv) && bv && typeof bv === 'object') {
        out[key] = merge(bv, pv)
      } else if (pv !== undefined && pv !== null && pv !== '') {
        out[key] = pv
      }
    }
    return out
  }
  return merge(defaultContent, saved)
}

export async function fetchSiteContent() {
  if (!isSupabaseConfigured) {
    return { content: defaultContent, source: 'default' }
  }

  const { data, error } = await supabase
    .from('website_content')
    .select('content')
    .eq('id', CONTENT_ID)
    .maybeSingle()

  if (error) {
    console.warn('Failed to load content from Supabase:', error.message)
    return { content: defaultContent, source: 'default', error }
  }

  const merged = mergeContent(data?.content || {})
  return { content: merged, source: data?.content ? 'supabase' : 'default' }
}

export async function saveSiteContent(content) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }

  const { error } = await supabase
    .from('website_content')
    .upsert({
      id: CONTENT_ID,
      content,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error
  return mergeContent(content)
}

export async function checkIsAdmin() {
  if (!isSupabaseConfigured || !supabase) return false

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return false
  return Boolean(data)
}

export async function uploadImage(file) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
