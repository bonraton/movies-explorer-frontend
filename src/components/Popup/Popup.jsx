import { NavLink } from "react-router-dom";
import "./Popup.css";

export default function Popup(props) {
  return (
    <div className={`popup ${props.isOpen ? 'popup_visible' : ''}`}>
      <button onClick={props.onClose} type="button" className="popup__close-btn"></button>
      <nav className="popup__links">
        <NavLink activeClassName="popup__link_selected" className="popup__link" exact to="/">
          Главная
        </NavLink>
        <NavLink activeClassName="popup__link_selected" className="popup__link" to="/movies">
          Фильмы
        </NavLink>
        <NavLink activeClassName="popup__link_selected" className="popup__link" to="/saved-movies">
          Сохраненные фильмы
        </NavLink>
      </nav>
      <NavLink to="/profile" className="navbar__btn">
        Аккаунт
        <svg className="navbar__btn-icon"></svg>
      </NavLink>
    </div>
  );
}
