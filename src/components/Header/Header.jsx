import './Header.css';
import { Link } from 'react-router-dom';
import LoggedInNavigation from '../Navigation/LoggedInNavigation';
import Popup from '../Popup/Popup';
import Navigation from '../Navigation/Navigation';
import { useState } from 'react';


export default function Header(props) {

    const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false)

    function openHeaderMenu() {
      setIsPopupMenuOpen(!isPopupMenuOpen)
    }

    function closePopup() {
        setIsPopupMenuOpen(false)
      }

    return (
        <header className={`header ${props.headerClassName}`}>
            <Link to="/">
                <svg className="logo"></svg>
            </Link>
            <h2 className="header__title">{props.greetings}</h2>
            <button onClick={openHeaderMenu} 
            type="button" 
            className={`header__btn ${props.btnClass}`}></button>
            <Popup onClose={closePopup} 
            isOpen={isPopupMenuOpen} />
            {props.isLoggedIn ? 
            <LoggedInNavigation onClick={props.resetError} link={props.link} btn={props.btn} /> : 
            <Navigation onClick={props.resetError} link={props.link} btn={props.btn} />}
        </header>
    )
}