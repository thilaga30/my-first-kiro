export default function SurpriseMe({ onClick, disabled }) {
  return (
    <button
      className={`surprise-btn${disabled ? ' is-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Surprise me — open a random dish"
      title={disabled ? 'No dishes available to surprise you with' : 'Open a random dish'}
    >
      <span aria-hidden="true">🍛</span>
      <span>Surprise Me</span>
    </button>
  )
}
