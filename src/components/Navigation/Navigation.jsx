import "./Navigation.css";
import { Link } from 'react-router-dom';

export default function Navigation(props) {
  return (
    <nav className={`navbar ${props.navbarClass}`} >
      <Link to ="/movies" className={`navbar__link ${props.navbarLinkClass}`}>
        {props.movies}
      </Link>
      <Link to="saved-movies" className={`navbar__link ${props.navbarLinkClass}`}>
        {props.savedMovies}
      </Link>
      <Link to="/profile" className={`navbar__btn ${props.navBarBtnClass}`}>
            {props.btnValue}
          <svg className={`navbar__btn-icon ${props.navbarBtnIconClass}`}></svg>
        </Link>
    </nav>
  );
}
