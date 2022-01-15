//GLOBAL IMPORTS
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

//COMPONENT IMPORTS
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
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
//CONTEXT
import CurrentUserContext from '../../contexts/currentUserContext';

//UTILS
import { filterAllMovies } from '../../utils/filter';

//API
import MoviesApi from '../../utils/MoviesApi';
import { getUser, updateUser, saveMovie, removeMovie, getSavedMoviesData } from '../../utils/MainApi';

//Main APi
import { register, login, getUserContent } from '../../utils/Auth';


function App(props) {

  //STATES
  // 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [moviesData, setMoviesData] = useState([]);
  const [moviesCards, setMoviesCards] = useState([])
  const [filteredMoviesCards, setFilteredMoviesCards] = useState([])

  const [savedMovies, setSavedMovies] = useState([]);
  const [filteredSavedMoviesCards, setFilteredSavedMoviesCards] = useState([])

  const [shortMoviesChecked, setShortMoviesCheked] = useState(Boolean)
  const [savedMoviesCheckbox, setSavedMoviesCheckbox] = useState(Boolean)

  const [allCardsLoaded, setAllCardsLoaded] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true)

  const [cardsInRow, setCardsInRow] = useState()
  const [cardsColumns, setCardsColumns] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const [searchError, setSearchError] = useState('');
  const [formError, setFormError] = useState('')
  const [currentUser, setCurrentUser] = useState({});

  const Api = new MoviesApi();
  const history = useHistory();

  //EFFECTS

  useEffect(() => {
    setCardsQuanity();
  }, [windowWidth])

  useEffect(() => {
    renderInitialCards()
  }, [filteredMoviesCards, cardsColumns, isLoggedIn])

  useEffect(() => {
    getSavedMovies()
    tokenCheck()
    getUserInfo()
  }, [isLoggedIn])

  useEffect(() => {
    renderMoviesFromLocalStorage()
  }, [isLoggedIn, cardsColumns])

  //LISTENERS
  window.addEventListener('resize', resizeWindow)

  //CONSTANTS
  const resolutionBreakpoints = {
    desktop: 1280,
    tablet: 768,
    mobile: 320
  }

  const errorMessages = {
    searchResultMsg: `запроса произошла ошибка. 
    Возможно, проблема с соединением или сервер недоступен. 
    Подождите немного и попробуйте ещё раз.`,
    searchFormError: 'Ничего не найдено',
  }

  // 
  function resizeWindow() {
    setWindowWidth(window.innerWidth)
  }

  // Отрисовка кол-ва карточек в зависимости от ширины окна
  function setCardsQuanity() {
    if (windowWidth >= resolutionBreakpoints.desktop) {
      setCardsColumns(4);
      setCardsInRow(4);
    }
    else if (windowWidth >= resolutionBreakpoints.tablet) {
      setCardsColumns(4);
      setCardsInRow(2);
    }
    else if (windowWidth >= resolutionBreakpoints.mobile) {
      setCardsColumns(5);
      setCardsInRow(1);
    }
  }

  //объект карточки
  function movieObject(movie, imgUrl) {
    return {
      movieId: movie.id || movie.movieId,
      image: imgUrl,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      trailerLink: movie.trailerLink,
      duration: movie.duration,
      country: movie.country,
      director: movie.director,
      description: movie.description,
      year: movie.year,
      thumbnail: imgUrl,
      trailer: movie.trailerLink,
      _id: movie._id
    }
  }

  // БЕРЕМ Все карточки с API
  async function getAllMoviesData(searchValue) {
    try {
      setCardsLoading(false)
      let data = await Api.getMoviesData();
      if (!data) {
        setSearchError(errorMessages.searchResultMsg)
      } else {
        let movies = data.map((movie) => {
          return movieObject(movie, `https://api.nomoreparties.co${movie.image.url}`)
        })
        let filteredMovies = filterMovies(searchValue, movies, shortMoviesChecked)
        console.log(filteredMovies)
        setFilteredMoviesCards(filteredMovies)
        setMoviesCards(filteredMovies.slice(0, cardsColumns * cardsInRow))
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
    if (movies.length > 0) {
      setSearchError('')
      setCardsQuanity()
      setCardsLoading(true)
      setFilteredMoviesCards(filteredMovies)
      localStorage.setItem('movies', JSON.stringify(filteredMovies))
      localStorage.setItem('shortsCheckbox', shortMoviesChecked)
      return filteredMovies
    } else {
      setSearchError(errorMessages.searchFormError)
      setFilteredMoviesCards([])
    }
  }

  //фильтр отфильтрованных карточек
  function filterFilteredMovies(movies, isChecked) {
    let filteredMovies = movies.filter((movie) => {
      return movie.duration <= 40
    })
    if (!isChecked) {
      return filteredMovies
    } else {
      hideAddBtn(movies)
      return movies.slice(0, cardsInRow * cardsColumns)
    }
  }

  //рендер карточек из локального хранилища
  function renderMoviesFromLocalStorage() {
    const localMovies = getFromLocal()
    if (localMovies) {
      setMoviesCards(localMovies.slice(0, cardsColumns * cardsInRow))
      setInitialCheckbox()
      hideAddBtn(localMovies)
    } else {
      return
    }
  }

  //отображаем чекбокс при загрузке
  function setInitialCheckbox() {
    const localMovies = getFromLocal()
    if (localMovies.some((movies) => movies.duration > 40)) {
      setShortMoviesCheked(false)
    } else {
      setShortMoviesCheked(true)
    }
  }

  //выводим отфильтрованные карточки
  const renderInitialCards = () => {
    setMoviesCards(filteredMoviesCards.slice(0, cardsColumns * cardsInRow))
    hideAddBtn(filteredMoviesCards)
  }

  function hideAddBtn(movies) {
    if (movies.length <= movies.slice(0, cardsColumns * cardsInRow).length) {
      setAllCardsLoaded(true)
    } else {
      setAllCardsLoaded(false)
    }
  }

  //Обработчик searchForm хватаем JSON, рендерим карточки и прелоадер
  async function handleSearchForm(searchValue) {
    if (searchValue.length < 1) {
      setSearchError(errorMessages.searchFormError)
      setFilteredMoviesCards([])
    } else {
      await getAllMoviesData(searchValue)
    }
  }

  // клик по ещё
  function handleLoadMoreCards() {
    setCardsColumns(cardsColumns + 1)
  }

  //обработчик кнопки фильтра
  function handleFilterbutton() {
    setShortMoviesCheked(!shortMoviesChecked)
    let movies = filterFilteredMovies(filteredMoviesCards, shortMoviesChecked)
    setMoviesCards(movies)
    setLocal()
  }

  //вносим изменения чекбокса в локальное хранилище
  function setLocal() {
    localStorage.setItem('shortsCheckbox', shortMoviesChecked)
  }

  //берем данные карточек с локального хранилища
  function getFromLocal() {
    let localMovies = JSON.parse(localStorage.getItem('movies'))
    return localMovies
  }

  // Достаем сохраненные карточки
  async function getSavedMovies() {
    const savedMovies = await getSavedMoviesData()
    try {
      const filteredByOwner = savedMovies.data.filter((movie) => {
        return movie.owner === currentUser._id
      })
      if (!filteredByOwner) {
        setSearchError(errorMessages.searchError)
      } else {
        const movies = await filteredByOwner.map((movie) => {
          return movieObject(movie, movie.image)
        });
        setFilteredSavedMoviesCards(movies)
        setSavedMovies(movies)
        return movies
      }
    } catch (e) {
    }
  }

  function handleFilterButtonSavedMovies() {
    setSavedMoviesCheckbox(!savedMoviesCheckbox)
    let movies = filterFilteredMovies(filteredSavedMoviesCards, savedMoviesCheckbox)
    setSavedMovies(movies)
  }

  // обработчик поиска сохраненных карточек
  async function handleSearchFormSavedMovies(searchValue) {
    await getSavedMovies(searchValue)
    let filteredMovies = await filterAllMovies(searchValue, filteredSavedMoviesCards, savedMoviesCheckbox)
    setSavedMovies(filteredMovies)
  }

  //Проверяем токен при загрузке страницы
  async function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    let userContentResult = await getUserContent(jwt)
    try {
      if (userContentResult) {
        setCurrentUser(userContentResult.data)
        props.history.push('/movies')
        setIsLoggedIn(true);
      } else {
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Берем данные юзера
  async function getUserInfo() {
    try {
      let user = await getUser()
      setCurrentUser(user.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  // Обновляем данные юзера
  async function updateUserInfo(name, email) {
    try {
      let userInfo = await updateUser(name, email);
      if (userInfo.data) {
        setCurrentUser(userInfo.data)
        setFormError('')
      } else {
        setFormError(userInfo.message)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function likeClick(movie, data) {
    if (!savedMovies.some((c) => c.movieId === movie.movieId)) {
      addSavedMovie(movie)
    } else {
      data = savedMovies.filter((c) => {
        return movie.movieId === c.movieId
      })[0]._id
      deleteCard(movie, data)
    }
  }

  function resetErrorMessages() {
    setSearchError('')
    setFormError('')
  }

  async function addSavedMovie(movie) {
    try {
      let savedMovie = await saveMovie(movie)
      await setSavedMovies([...savedMovies, savedMovie.data])
    } catch (e) {
      console.log(e)
    }
  }

  async function deleteCard(movie, data) {
    await removeMovie(data)
    console.log(movie)
    let newArray = savedMovies.filter((c) => {
      return movie.movieId !== c.movieId
    })
    await setSavedMovies(newArray)
  }

  //Регистрация + автологин
  async function handleRegister(name, email, password) {
    let result = await register(name, email, password)
    try {
      if (result.data) {
        setIsLoggedIn(true)
        setFormError('')
        await handleLogin(email, password)
      } else {
        setFormError(result.message)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  // LOGIN
  async function handleLogin(email, password) {
    let result = await login(email, password)
    try {
      if (result.token) {
        localStorage.setItem('jwt', result.token)
        history.push('./movies');
        setFormError('')
        setIsLoggedIn(true)
        console.log(result)
      } else {
        setFormError(result.message)
        console.log(result)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  async function onDelete(movie) {
    let result = await removeMovie(movie._id);
    let newArray = savedMovies.filter((c) => {
      return movie._id !== c._id
    })
    setSavedMovies(newArray)
    return result
  }

  function clearLocalStorageData() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('movies')
    setCurrentUser({})
    setSavedMovies([])
  }

  // LOGOUT
  function handleLogout() {
    clearLocalStorageData()
    history.push('./')
    setIsLoggedIn(false);
  }

  return (
    // 1. PROMO 
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <Route exact path="/">
            <Header headerClassName="header_promo"
              link="navbar__link_promo"
              isLoggedIn={isLoggedIn}
              btnClass={isLoggedIn ? 'header__btn_auth header__btn_promo' : ''}>
            </Header>
            <Main />
            <Footer />
          </Route>
          {/* MOVIES */}
          <Route path="/movies">
            <Header
              btnClass="header__btn_auth"
              isLoggedIn={isLoggedIn}
              resetError={resetErrorMessages}
            >
            </Header>
            <ProtectedRoute
              component={SearchForm}
              isChecked={shortMoviesChecked}
              onFilterChange={handleFilterbutton}
              isLoggedIn={isLoggedIn}
              onSubmit={handleSearchForm}>
            </ProtectedRoute>
            <ProtectedRoute
              component={MoviesCardList}
              hiddenDeleteBtn='movie__delete-btn_hidden'
              isLoggedIn={isLoggedIn}
              error={searchError}
              onAddMore={handleLoadMoreCards}
              movies={moviesCards}
              isLoading={cardsLoading}
              isLoaded={allCardsLoaded}
              onCardLike={likeClick}
              savedMovies={savedMovies}
              onDelete={onDelete}
            ></ProtectedRoute>
            <Footer />
          </Route>
          {/* SAVED MOVIES */}
          <Route path="/saved-movies">
            <Header
              btnClass="header__btn_auth"
              isLoggedIn={isLoggedIn}
              resetError={resetErrorMessages}
            >
            </Header>
            <ProtectedRoute
              component={SearchForm}
              isLoggedIn={isLoggedIn}
              onSubmit={handleSearchFormSavedMovies}
              onFilterChange={handleFilterButtonSavedMovies}
              isChecked={savedMoviesCheckbox}>

            </ProtectedRoute>
            <ProtectedRoute
              component={SavedMovies}
              hiddenAddBtn='movie__btn-container_hidden'
              isLoggedIn={isLoggedIn}
              error={searchError}
              onAddMore={handleLoadMoreCards}
              isLoading={cardsLoading}
              isLoaded={allCardsLoaded}
              onCardLike={likeClick}
              savedMovies={savedMovies}
              onDelete={onDelete}
              movies={savedMovies}
            >
            </ProtectedRoute>
            <Footer />
          </Route>
          {/* 4. LOGIN  */}
          <Route path="/signin">
            <Header
              headerClassName="header_auth"
              greetings="Рады видеть!"
              isLoggedIn={isLoggedIn}
              link="navbar__link_hidden"
              btn='navbar__btn_hidden' />
            <Login
              onSubmit={handleLogin}
              formError={formError}
              resetError={resetErrorMessages} />
          </Route>
          {/* {/* 5.REGISTER */}
          <Route path="/signup">
            <Header
              headerClassName="header_auth"
              greetings="Добро пожаловать!"
              isLoggedIn={isLoggedIn}
              link="navbar__link_hidden"
              btn='navbar__btn_hidden'
            />
            <Register
              formError={formError}
              onSubmit={handleRegister}
              resetError={resetErrorMessages} />
          </Route>
          {/* 6.PROFILE  */}
          <Route path="/profile">
            <ProtectedRoute
              component={Header}
              btnClass="header__btn_auth"
              isLoggedIn={isLoggedIn}>
            </ProtectedRoute>
            <ProtectedRoute
              component={Profile}
              formError={formError}
              onSubmit={updateUserInfo}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}>
            </ProtectedRoute>
          </Route>
          {/* ERROR */}
          <Route path="">
            <Error404 />
          </Route>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
