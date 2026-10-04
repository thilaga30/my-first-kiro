export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-icon" aria-hidden="true">🍛</span>
          <span className="footer__brand-name">Flavours of Tamil Nadu</span>
        </div>
        <p className="footer__tagline">
          Celebrating the rich culinary heritage of Tamil Nadu — one dish at a time.
        </p>
        <div className="footer__divider" aria-hidden="true" />
        <div className="footer__bottom">
          <p className="footer__credit">
            Built with ❤️ for <strong>Kiro University 2026</strong>
          </p>
          <p className="footer__note">
            A food discovery project · React + Vite · Local data only
          </p>
        </div>
        <div className="footer__kolam" aria-hidden="true">
          ✦ ✧ ✦ ✧ ✦ ✧ ✦
        </div>
      </div>
    </footer>
  )
}
