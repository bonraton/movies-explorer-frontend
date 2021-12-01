import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__title">
        Учебный проект Яндекс.Практикум х BeatFilm.
      </p>
      <div className="footer__links-container">
        <span className="footer__copyright">© 2020</span>
        <nav className="footer__links">
          <a href="#" className="footer__link">
            Яндекс.Практикум
          </a>
          <a href="#" className="footer__link">
            Github
          </a>
          <a href="#" className="footer__link">
            Facebook
          </a>
        </nav>
      </div>
    </footer>
  );
}
