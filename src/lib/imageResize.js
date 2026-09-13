const RESIZABLE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const SKIP_IF_SMALLER_THAN = 1.5 * 1024 * 1024

async function encode(canvas, type, quality) {
  if (typeof canvas.convertToBlob === 'function') return canvas.convertToBlob({ type, quality })
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * Shrinks a photo in the browser before upload so large phone photos don't slow the site down.
 * Keeps the original when it is already small enough, when the browser can't process it,
 * or for formats that must not be re-encoded (GIF animations, AVIF).
 * EXIF rotation is applied by createImageBitmap, so portrait photos stay upright.
 */
export async function resizeImage(file, { maxDimension = 2400, quality = 0.85, force = false } = {}) {
  if (!RESIZABLE_TYPES.includes(file.type) || typeof createImageBitmap !== 'function') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && !force && file.size <= SKIP_IF_SMALLER_THAN) {
    bitmap.close?.()
    return file
  }

  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : Object.assign(document.createElement('canvas'), { width, height })
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  // WebP keeps transparency and is small. Some browsers can't encode it; then use JPEG for photos, PNG otherwise.
  let blob = await encode(canvas, 'image/webp', quality)
  if (!blob || blob.type !== 'image/webp') {
    blob = file.type === 'image/png' ? await encode(canvas, 'image/png') : await encode(canvas, 'image/jpeg', quality)
  }
  if (!blob) return file
  // Re-encoding a same-sized image can make it bigger; keep whichever is smaller.
  if (scale === 1 && blob.size >= file.size) return file

  const ext = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }[blob.type] || 'img'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.${ext}`, { type: blob.type })
}
