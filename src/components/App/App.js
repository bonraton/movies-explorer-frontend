import React, { useState } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Main from '../Main/Main';
import SearchForm from '../SearchForm/SearchForm';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import Profile from '../Auth/Profile/Profile';
import Register from '../Auth/Register/Register';
import Login from '../Auth/Login/Login';
import Error404 from '../Error404/Error404';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SavedMovies from '../SavedMovies/SavedMovies';
import Navigation from '../Navigation/Navigation';
import Popup from '../Popup/Popup';


function App() {

const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false)

function openHeaderMenu () {
  setIsPopupMenuOpen(!isPopupMenuOpen)
}

function openPopup () {
  setIsPopupMenuOpen(true)
}

  return (
    // 1. PROMO 
    <div className="page">
      <Route exact path ="/">
      <Header 
      headerClassName='header_promo'
      navbarLinkClass='navbar__link_promo'
      navbarBtnIconClass='navbar__btn-icon_promo'
      navBarBtnClass='navbar__btn_promo'
      btnValue='Войти'
      movies="Регистрация"/>
      <Main />
      <Footer />
      </Route>
      {/* 2. MOVIESCARDLIST  */}
      <Route path="/movies">
      <Popup 
              onClose={openHeaderMenu}
              isOpen={isPopupMenuOpen}
        />
      <Header 
      btnValue="Аккаунт"
      movies="Фильмы"
      savedMovies="Сохраненные фильмы"
      btnClass="header__btn_auth"
      navbarClass="navbar_auth"
      onOpen={openPopup}
      />
      <SearchForm />
      <MoviesCardList />
      <Footer /> 
      </Route>
      {/* 3. SavedMovies */}
      <Route path="/saved-movies">
      <Popup 
              onClose={openHeaderMenu}
              isOpen={isPopupMenuOpen}
        />
      <Header 
      btnValue="Аккаунт"
      movies="Фильмы"
      savedMovies="Сохраненные фильмы"
      btnClass="header__btn_auth"
      navbarClass="navbar_auth"
      onOpen={openPopup}
      />
      <SavedMovies />
      <Footer />
      </Route>
      {/* 4. LOGIN  */}
      <Route path="/signin">
      <Header
      headerClassName="header_auth" 
      greetings="Добро пожаловать!"
      navbarClass="navbar_auth"/>
      
      <Login />
      </Route>
      {/* {/* 5.REGISTER */}
      <Route path="/signup">
      <Header 
      headerClassName="header_auth"
      greetings="Рады видеть!"
      navbarClass="navbar_auth"/>
      <Register />
      </Route>

      {/* 6.PROFILE  */}
      <Route path="/profile">
      <Header
      navbarClass="navbar_auth"
      movies="Фильмы"
      savedMovies="Сохраненные фильмы"
      btnValue="Аккаунт"/> 
      <Profile />
      </Route> 
      
      {/* 7.ERROR 404 */}
      {/* <Error404 /> */}

    </div>
  );
}

export default App;
