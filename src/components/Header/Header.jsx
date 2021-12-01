import './Header.css';
import { Link } from 'react-router-dom';
import Navigation from "../Navigation/Navigation";

export default function Header (props) {
    return (
        <header className={`header ${props.headerClassName}`}>
            <Link to="/">
            <svg className="logo"></svg>
            </Link>
            <h2 className="header__title">{props.greetings}</h2>
            <Navigation 
            navbarClass={props.navbarClass}
            movies={props.movies}
            navbarLinkClass={props.navbarLinkClass}
            navbarBtnIconClass={props.navbarBtnIconClass}
            navBarBtnClass={props.navBarBtnClass}
            savedMovies={props.savedMovies}
            btnValue={props.btnValue}
            />
        </header>
    )
}