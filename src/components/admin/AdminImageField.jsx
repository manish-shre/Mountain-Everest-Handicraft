import { useRef, useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabase'
import { uploadImage } from '../../lib/contentService'

export default function AdminImageField({ label, value, onChange, hint }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isSupabaseConfigured) {
      setError('Configure Supabase in .env to upload images.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {label && <span className="admin-label">{label}</span>}
      {hint && <p className="text-sm text-gray-600 -mt-1">{hint}</p>}
      {value && (
        <div className="rounded-lg border border-gray-300 bg-white p-3 inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-auto max-w-full object-contain"
          />
        </div>
      )}
      <input
        type="url"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste an image URL, or upload a file below"
        className="admin-input"
      />
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="admin-btn-primary text-sm"
        >
          {uploading ? 'Uploading…' : 'Upload image file'}
        </button>
        <span className="text-sm text-gray-600">JPG, PNG, or WebP</span>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      {error && <p className="text-sm text-red-700 font-semibold">{error}</p>}
    </div>
  )
}
