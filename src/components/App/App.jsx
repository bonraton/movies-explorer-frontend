import './App.css';
import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
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
import Popup from '../Popup/Popup';
import PromoNavigation from '../Navigation/PromoNavigation';
import Navigation from '../Navigation/Navigation';


function App() {

  const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false)

  function openHeaderMenu() {
    setIsPopupMenuOpen(!isPopupMenuOpen)
  }

  function openPopup() {
    setIsPopupMenuOpen(true)
  }

  return (
    // 1. PROMO 
    <div className="page">
      <Switch>
        <Route exact path="/">
          <Header headerClassName="header_promo">
            <PromoNavigation />
          </Header>
          <Main />
          <Footer />
        </Route>
        {/* 2. MOVIESCARDLIST  */}
        <Route path="/movies">
          <Popup onClose={openHeaderMenu} isOpen={isPopupMenuOpen} />
          <Header btnClass="header__btn_auth" onOpen={openPopup}>
            <Navigation />
          </Header>
          <SearchForm />
          <MoviesCardList />
          <Footer />
        </Route>
        {/* 3. SavedMovies */}
        <Route path="/saved-movies">
          <Popup onClose={openHeaderMenu} isOpen={isPopupMenuOpen} />
          <Header btnClass="header__btn_auth" onOpen={openPopup}>
            <Navigation />
          </Header>
          <SearchForm />
          <SavedMovies />
          <Footer />

        </Route>
        {/* 4. LOGIN  */}
        <Route path="/signin">
          <Header headerClassName="header_auth" greetings="Рады видеть!" />
          {/* navbarClass="navbar_hidden" */}
          <Login />
        </Route>
        {/* {/* 5.REGISTER */}
        <Route path="/signup">
          <Header headerClassName="header_auth" greetings="Добро пожаловать!" />
          <Register />
        </Route>
        {/* 6.PROFILE  */}
        <Route path="/profile">
          <Popup onClose={openHeaderMenu} isOpen={isPopupMenuOpen} />
          <Header btnClass="header__btn_auth" onOpen={openPopup}>
            <Navigation />
          </Header>
          <Profile />
        </Route>
        <Route path="">
          <Error404 />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
