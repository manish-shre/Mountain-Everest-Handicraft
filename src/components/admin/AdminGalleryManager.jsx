import { useRef, useState } from 'react'
import { ACCEPTED_IMAGE_TYPES, uploadImage } from '../../lib/contentService'
import { GALLERY_FULL_SIZE, GALLERY_THUMB_SIZE, MAX_GALLERY_IMAGES, createGalleryItem } from '../../lib/gallery'
import { isSupabaseConfigured } from '../../lib/supabase'

/**
 * Gallery editor. `onChange` receives an updater function (prev → next) so uploads that
 * finish one after another never overwrite each other's changes.
 */
export default function AdminGalleryManager({ items, onChange }) {
  const inputRef = useRef(null)
  const [progress, setProgress] = useState(null) // { done, total }
  const [errors, setErrors] = useState([])
  const [dragOver, setDragOver] = useState(false)

  const slotsLeft = MAX_GALLERY_IMAGES - items.length
  const uploading = progress !== null
  const full = slotsLeft <= 0

  const uploadFiles = async (fileList) => {
    if (uploading) return
    const all = [...fileList]
    const files = all.filter((f) => f.type.startsWith('image/'))
    const newErrors = all.filter((f) => !f.type.startsWith('image/')).map((f) => `${f.name}: not an image, skipped.`)
    const accepted = files.slice(0, Math.max(0, slotsLeft))
    if (files.length > accepted.length) {
      newErrors.push(`The gallery holds up to ${MAX_GALLERY_IMAGES} photos — ${files.length - accepted.length} were not uploaded. Remove some photos to add more.`)
    }
    setErrors(newErrors)
    if (!accepted.length) {
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setProgress({ done: 0, total: accepted.length })
    let insertAt = items.length
    for (const file of accepted) {
      try {
        const image = await uploadImage(file, { maxDimension: GALLERY_FULL_SIZE })
        let thumb = ''
        try {
          thumb = await uploadImage(file, { maxDimension: GALLERY_THUMB_SIZE, quality: 0.8, force: true })
        } catch {
          // The slider falls back to the full image if the thumbnail fails.
        }
        const item = createGalleryItem({ image, thumb })
        const position = insertAt++
        // New photos are added at the end, in the order they were selected.
        onChange((prev) => {
          const next = [...prev]
          next.splice(Math.min(position, next.length), 0, item)
          return next.slice(0, MAX_GALLERY_IMAGES)
        })
      } catch (err) {
        newErrors.push(`${file.name}: ${err.message || 'upload failed'}`)
        setErrors([...newErrors])
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }))
    }
    setProgress(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const update = (index, field, value) =>
    onChange((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const move = (index, delta) =>
    onChange((prev) => {
      const target = index + delta
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  const remove = (index) => {
    if (!window.confirm('Remove this photo from the gallery? (Not permanent until you click “Save changes”.)')) return
    onChange((prev) => prev.filter((_, i) => i !== index))
    setErrors([])
  }

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured ? (
        <p className="admin-item-card text-base text-red-700 font-semibold">Configure Supabase in .env to upload photos.</p>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
          className={`rounded-lg border-2 border-dashed p-6 space-y-4 text-center transition-colors ${dragOver ? 'border-navy bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
        >
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading || full} className="admin-btn-primary">
            {uploading ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : full ? 'Gallery is full' : 'Select photos'}
          </button>
          <input ref={inputRef} type="file" accept={ACCEPTED_IMAGE_TYPES} multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
          <p className="text-sm text-slate-700">
            {full
              ? `The gallery already has ${MAX_GALLERY_IMAGES} photos. Remove a photo to upload another.`
              : `Select several photos at once or drag and drop them here — ${slotsLeft} more can be added. Large phone photos are resized automatically (JPG, PNG, WebP up to 25 MB).`}
          </p>
          {uploading && (
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
              <div className="h-full bg-navy transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
          )}
          {errors.length > 0 && (
            <ul className="text-sm text-red-700 font-semibold space-y-1 text-left" role="alert">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}

      <p className="text-base text-slate-700">
        {items.length} of {MAX_GALLERY_IMAGES} photos. They appear in this order in the gallery slider.
        {items.length > 0 && ' Remember to click “Save changes” after uploading.'}
      </p>

      {items.length > 0 && (
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <li key={item.id} className="admin-item-card !p-3 !space-y-3">
              <div className="relative aspect-video rounded-md overflow-hidden bg-slate-200">
                <img src={item.thumb || item.image} alt={item.caption || `Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-bold text-white">{i + 1}</span>
              </div>
              <label className="block">
                <span className="admin-label !text-sm !mb-1">Caption (optional)</span>
                <input
                  value={item.caption}
                  onChange={(e) => update(i, 'caption', e.target.value)}
                  maxLength={120}
                  placeholder="Shown when the photo is opened full screen"
                  className="admin-input !py-2"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="admin-btn-secondary text-sm !px-3 !py-1.5 disabled:opacity-40" aria-label={`Move photo ${i + 1} earlier`}>
                  ← Earlier
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="admin-btn-secondary text-sm !px-3 !py-1.5 disabled:opacity-40" aria-label={`Move photo ${i + 1} later`}>
                  Later →
                </button>
                <button type="button" onClick={() => remove(i)} className="admin-btn-danger text-sm !px-3 !py-1.5">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
