import { Link } from "react-router-dom";
import "./Popup.css";

export default function Popup(props) {
  return (
    <div className={`popup ${props.isOpen ? 'popup_visible' : ''}`}>
      <button onClick={props.onClose} type="button" className="popup__close-btn"></button>
      <nav className="popup__links">
        <Link className="popup__link" to="/">
          Главная
        </Link>
        <Link className="popup__link" to="/movies">
          Фильмы
        </Link>
        <Link className="popup__link" to="/saved-movies">
          Сохраненные фильмы
        </Link>
      </nav>
      <Link to="/profile" className="navbar__btn">
        Аккаунт
        <svg className="navbar__btn-icon"></svg>
      </Link>
    </div>
  );
}
