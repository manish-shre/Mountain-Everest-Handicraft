import { useEffect, useId, useRef, useState } from 'react'
import AdminIcon from './AdminIcon'
import { isSupabaseConfigured } from '../../lib/supabase'
import { ACCEPTED_IMAGE_TYPES, uploadImage } from '../../lib/contentService'

/** Photo picker: big preview, Upload / Change / Remove buttons, and an optional "use a link" field for advanced users. */
export default function AdminImageField({ label, value, onChange, hint, fit = 'contain' }) {
  const id = useId()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewError, setPreviewError] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => setPreviewError(false), [value])

  const upload = async (file) => {
    if (!file) return
    if (!isSupabaseConfigured) {
      setError('Photo uploads need the website database to be connected.')
      return
    }
    setUploading(true)
    setError('')
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      {label && <span className="admin-label" id={`${id}-label`}>{label}</span>}
      {hint && <p className="admin-help">{hint}</p>}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files?.[0]) }}
          className={`relative w-full sm:w-56 h-40 shrink-0 overflow-hidden rounded-xl border-2 flex items-center justify-center transition-colors ${
            dragOver ? 'border-navy border-dashed bg-blue-50' : value ? 'border-slate-200 bg-slate-50' : 'border-dashed border-slate-300 bg-slate-50'
          }`}
        >
          {uploading ? (
            <span className="flex flex-col items-center gap-2 text-sm text-slate-600">
              <span className="w-7 h-7 rounded-full border-2 border-navy/20 border-t-navy animate-spin" aria-hidden="true" />
              Uploading…
            </span>
          ) : value && !previewError ? (
            <img src={value} alt="" onError={() => setPreviewError(true)} className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`} />
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-4 text-center text-sm text-slate-500">
              <AdminIcon name="photo" className="w-8 h-8 text-slate-400" />
              {previewError ? 'This photo could not be loaded' : 'No photo yet'}
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={value ? 'admin-btn-secondary' : 'admin-btn-primary'} aria-describedby={label ? `${id}-label` : undefined}>
              <AdminIcon name="upload" className="w-4 h-4" />
              {uploading ? 'Uploading…' : value ? 'Change photo' : 'Upload photo'}
            </button>
            {value && !uploading && (
              <button type="button" onClick={() => onChange('')} className="admin-btn-danger">
                <AdminIcon name="trash" className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">You can also drag a photo onto the box. Large phone photos are resized automatically.</p>
          <button type="button" onClick={() => setShowLink((s) => !s)} className="text-xs font-medium text-slate-500 underline hover:text-navy" aria-expanded={showLink}>
            {showLink ? 'Hide image link' : 'Use an image link instead'}
          </button>
        </div>
        <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </div>

      {showLink && (
        <div className="mt-3">
          <label htmlFor={`${id}-url`} className="sr-only">Image link</label>
          <input
            id={`${id}-url`}
            type="text"
            inputMode="url"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value.trim())}
            placeholder="https://… or /images/…"
            className="admin-input"
          />
        </div>
      )}
      {error && <p className="mt-2 text-sm font-medium text-red-600" role="alert">{error}</p>}
    </div>
  )
}
