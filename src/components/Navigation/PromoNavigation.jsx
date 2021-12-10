import "./Navigation.css";
import { NavLink } from 'react-router-dom';

export default function PromoNavigation(props) {
  return (
    <nav className={`navbar navbar_promo`}>
      <NavLink to="/signin" activeClassName="navbar__link_selected" className={`navbar__link navbar__link_promo`}>
        Войти
      </NavLink>
      <NavLink to="/profile" className={`navbar__btn navbar__btn_promo`}>
        Профиль
      </NavLink>
    </nav>
  );
}
