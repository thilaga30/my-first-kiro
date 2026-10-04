import { useState, useEffect } from 'react'

const STORAGE_KEY = 'foods-tn-favourites'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    const strings = parsed.filter(item => typeof item === 'string')
    return new Set(strings)
  } catch {
    return new Set()
  }
}

function writeToStorage(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // silent — private browsing or quota exceeded
  }
}

/**
 * Manages favourite dish IDs, persisted to localStorage.
 * @returns {{ favourites: Set<string>, toggleFavourite: (id: string) => void, count: number }}
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState(() => readFromStorage())

  useEffect(() => {
    writeToStorage(favourites)
  }, [favourites])

  function toggleFavourite(id) {
    setFavourites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return { favourites, toggleFavourite, count: favourites.size }
}
