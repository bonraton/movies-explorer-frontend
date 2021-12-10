import "./Footer.css";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__title">
        Учебный проект Яндекс.Практикум х BeatFilm.
      </p>
      <div className="footer__links-container">
        <span className="footer__copyright">© 2020</span>
        <nav className="footer__links">
          <Link to={{ pathname: "https://practicum.yandex.ru/" }} target="_blank" className="footer__link">
            Яндекс.Практикум
          </Link>
          <Link to={{ pathname: "https://github.com/bonraton" }} target="_blank" className="footer__link">
            Github
          </Link>
          <Link to={{ pathname: "https://www.facebook.com/zarechny.oleg/" }} target="_blank" className="footer__link">
            Facebook
          </Link>
        </nav>
      </div>
    </footer>
  );
}
