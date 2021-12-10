import './Header.css';
import { Link } from 'react-router-dom';

export default function Header(props) {
    return (
        <header className={`header ${props.headerClassName}`}>
            <Link to="/">
                <svg className="logo"></svg>
            </Link>
            <h2 className="header__title">{props.greetings}</h2>
            <button onClick={props.onOpen} type="button" className={`header__btn ${props.btnClass}`}></button>
            {props.children}
        </header>
    )
}