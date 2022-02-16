import Navigation from './Navigation/Navigation'
import LoggedInNavigation from './Navigation/LoggedInNavigation'
import { Link } from 'react-router-dom';
import Popup from './Popup';
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
            <LoggedInNavigation resetError={props.resetError} link={props.link} btn={props.btn} /> : 
            <Navigation resetError={props.resetError} link={props.link} btn={props.btn} />}
        </header>
    )
}