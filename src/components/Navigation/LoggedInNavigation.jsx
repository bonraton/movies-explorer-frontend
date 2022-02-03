import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants/endpoints';

export default function LoggedInNavigation(props) {
  return (
    <nav className='navbar navbar_auth'>
      <NavLink onClick={props.resetError} to={PATHS.movies} activeClassName="navbar__link_selected" className={`navbar__link ${props.link}`}>
        Фильмы
      </NavLink>
      <NavLink onClick={props.resetError} to={PATHS.savedMovies} activeClassName="navbar__link_selected" className={`navbar__link ${props.link}`}>
        Сохраненные фильмы
      </NavLink>
      <NavLink onClick={props.resetError} to={PATHS.account} className={`navbar__btn ${props.btn}`}>
        Аккаунт
        <svg className='navbar__btn-icon'></svg>
      </NavLink>
    </nav>
  );
         
}