import { NavLink } from 'react-router-dom';

export default function LoggedInNavigation(props) {
  return (
    <nav className='navbar navbar_auth'>
      <NavLink onClick={props.resetError} to="/movies" activeClassName="navbar__link_selected" className={`navbar__link ${props.link}`}>
        Фильмы
      </NavLink>
      <NavLink onClick={props.resetError} to="saved-movies" activeClassName="navbar__link_selected" className={`navbar__link ${props.link}`}>
        Сохраненные фильмы
      </NavLink>
      <NavLink onClick={props.resetError} to="/profile" className={`navbar__btn ${props.btn}`}>
        Аккаунт
        <svg className='navbar__btn-icon'></svg>
      </NavLink>
    </nav>
  );
         
}