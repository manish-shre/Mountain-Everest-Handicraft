import { useState } from 'react'

export const updateAt = (list, index, field, value) =>
  list.map((item, i) => (i === index ? { ...item, [field]: value } : item))

export const moveItem = (list, index, delta) => {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

/** Which collapsible cards are open. */
export function useOpenItems(initiallyOpen = []) {
  const [open, setOpen] = useState(() => new Set(initiallyOpen))
  return {
    isOpen: (id) => open.has(id),
    toggle: (id) =>
      setOpen((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    openOnly: (id) => setOpen(new Set([id])),
  }
}
