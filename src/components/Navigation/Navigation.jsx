import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants/endpoints';

export default function Navigation(props) {
  return (
    <nav className={`navbar navbar_promo`}>
      <NavLink onClick={props.resetError} to={PATHS.signup} activeClassName="navbar__link_selected" className={`navbar__link ${props.link}`}>
        Регистрация
      </NavLink>
      <NavLink onClick={props.resetError} to={PATHS.signin} className={`navbar__btn navbar__btn_promo ${props.btn}`}>
        Войти
      </NavLink>
    </nav>
  );
}
