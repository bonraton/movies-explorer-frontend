import { NavLink } from "react-router-dom";
import "./Popup.css";

export default function Popup(props) {

  function closePopup () {
    props.onClose(props)
  }
  
  return (
    <div className={`popup ${props.isOpen ? 'popup_visible' : ''}`}>
      <button onClick={closePopup} type="button" className="popup__close-btn"></button>
      <nav className="popup__links">
        <NavLink onClick={closePopup} activeClassName="popup__link_selected" className="popup__link" exact to="/">
          Главная
        </NavLink>
        <NavLink onClick={closePopup} activeClassName="popup__link_selected" className="popup__link" to="/movies">
          Фильмы
        </NavLink>
        <NavLink onClick={closePopup} activeClassName="popup__link_selected" className="popup__link" to="/saved-movies">
          Сохраненные фильмы
        </NavLink>
      </nav>
      <NavLink onClick={closePopup} to="/profile" className="navbar__btn">
        Аккаунт
        <svg className="navbar__btn-icon"></svg>
      </NavLink>
    </div>
  );
}
