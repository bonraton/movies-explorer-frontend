import "./Navigation.css";
import { NavLink } from 'react-router-dom';

export default function Navigation(props) {
  return (
    <nav className='navbar navbar_auth'>
      <NavLink to="/movies" activeClassName="navbar__link_selected" className='navbar__link'>
        Фильмы
      </NavLink>
      <NavLink to="saved-movies" activeClassName="navbar__link_selected" className='navbar__link'>
        Сохраненные фильмы
      </NavLink>
      <NavLink to="/profile" className='navbar__btn'>
        Аккаунт
        <svg className='navbar__btn-icon'></svg>
      </NavLink>
    </nav>
  );
}