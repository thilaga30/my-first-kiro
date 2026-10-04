import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function FoodDetailModal({ dish, isFavourite, onToggleFavourite, onClose }) {
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const containerRef = useRef(null)

  // Save trigger element on open
  useEffect(() => {
    if (dish) {
      triggerRef.current = document.activeElement
      // Focus close button after paint
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else if (triggerRef.current) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [dish])

  // Escape key listener + focus trap
  useEffect(() => {
    if (!dish) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const el = containerRef.current
        if (!el) return
        const focusable = [...el.querySelectorAll(FOCUSABLE)]
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [dish, onClose])

  if (!dish) return null

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleImageError(e) {
    e.currentTarget.src = PLACEHOLDER
  }

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      aria-hidden="false"
    >
      <div
        ref={containerRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal__header">
          <div className="modal__header-badges">
            <span className={`badge badge--diet ${dish.isVegetarian ? 'badge--veg' : 'badge--nonveg'}`}>
              <span aria-hidden="true">{dish.isVegetarian ? '🟢' : '🔴'}</span>
              {dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
            <span className="badge badge--category">{dish.category}</span>
          </div>
          <button
            ref={closeButtonRef}
            className="modal__close"
            onClick={onClose}
            aria-label="Close dish details"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="modal__image-wrap">
          <img
            src={dish.image}
            alt={dish.name}
            className="modal__image"
            onError={handleImageError}
          />
          <button
            className={`modal__favourite${isFavourite ? ' is-active' : ''}`}
            onClick={onToggleFavourite}
            aria-label={isFavourite ? `Remove ${dish.name} from favourites` : `Add ${dish.name} to favourites`}
            aria-pressed={isFavourite}
            type="button"
          >
            <span aria-hidden="true">{isFavourite ? '♥' : '♡'}</span>
            {isFavourite ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <h2 id="modal-title" className="modal__title">{dish.name}</h2>

          <div className="modal__meta">
            <span className="modal__meta-item">
              <span aria-hidden="true">📍</span>
              <strong>Region:</strong> {dish.region}
            </span>
          </div>

          <p className="modal__description">{dish.description}</p>

          <section className="modal__section" aria-labelledby="ingredients-heading">
            <h3 id="ingredients-heading" className="modal__section-title">Ingredients</h3>
            <ul className="modal__ingredients" aria-label={`Ingredients for ${dish.name}`}>
              {dish.ingredients.map((ing, i) => (
                <li key={i} className="modal__ingredient">{ing}</li>
              ))}
            </ul>
          </section>

          <section className="modal__section modal__section--cultural" aria-labelledby="cultural-heading">
            <h3 id="cultural-heading" className="modal__section-title">
              <span aria-hidden="true">📜</span> Cultural Note
            </h3>
            <p className="modal__cultural-note">{dish.culturalNote}</p>
          </section>
        </div>
      </div>
    </div>,
    document.body
  )
}
