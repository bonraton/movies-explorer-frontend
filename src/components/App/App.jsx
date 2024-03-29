//GLOBAL IMPORTS
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';

//COMPONENT IMPORTS
import Main from '../Main/Main';
import SearchForm from '../SearchForm';
import MoviesCardList from '../Movies/MoviesCardList';
import Profile from '../Auth/Profile';
import Register from '../Auth/Register';
import PopupMessage from '../PopupMessage';
import Login from '../Auth/Login';
import Error404 from '../Error404';
import Header from '../Header';
import Footer from '../Footer';
import SavedMovies from '../Movies/SavedMovies';
import ProtectedRoute from '../ProtectedRoute';

//CONTEXT
import CurrentUserContext from '../../contexts/currentUserContext';

//CONSTANTS
import { searchFormErrors, successeMessages, validationErrors } from '../../constants/messages';
import { PATHS } from '../../constants/endpoints';
import { cardsQuanity, localStorageConstants, movieObject, resolutionBreakpoints } from '../../constants/constant';

//UTILS
import { filterAllMovies, filterShorts } from '../../utils/filter';
import { clearLocalStorageData, saveDataToLocalStorage } from '../../utils/localStorageHandlers';
import { getSearchError, getInitialError } from '../../utils/errorHandlers';

//API
import MoviesApi from '../../utils/MoviesApi';
import { getUser, updateUser, saveMovie, removeMovie, getSavedMoviesData } from '../../utils/MainApi';
import { register, login, getUserContent } from '../../utils/Auth';

function App() {

  //STATES
  // 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Movies States
  const [moviesData, setMoviesData] = useState([])
  const [moviesCards, setMoviesCards] = useState([])
  const [filteredMoviesCards, setFilteredMoviesCards] = useState([])
  const [shortMoviesChecked, setShortMoviesCheked] = useState(Boolean)

  const [allCardsLoaded, setAllCardsLoaded] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true)

  const [cardsInRow, setCardsInRow] = useState(0)
  const [cardsColumns, setCardsColumns] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  //SavedMovies states
  const [savedMovies, setSavedMovies] = useState([]);
  const [savedMoviesData, setSavedMoviesData] = useState([])
  const [savedShortMoviesChecked, setSavedShortMoviesChecked] = useState(false)

  const [likedMovies, setLikedMovies] = useState([])

  //Errors
  const [savedMoviesError, setSavedMoviesError] = useState({ long: '', shorts: '' })
  const [moviesError, setMoviesError] = useState({ long: '', shorts: '' })

  const [popupMessage, setPopupMessage] = useState('')
  const [popupIsOpened, setPopupIsOpened] = useState(false)

  //DisableInputs
  const [isDisabledInput, setIsDisabledInput] = useState(false)

  const [currentUser, setCurrentUser] = useState({});

  const Api = new MoviesApi();
  const history = useHistory();

  //EFFECTS

  useEffect(() => {
    setCardsQuanity();
  }, [windowWidth])

  useEffect(() => {
    tokenCheck()
    getSavedMoviesData()
  }, [isLoggedIn])

  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    renderLocalOrFilteredCards()
  }, [moviesData, shortMoviesChecked, cardsInRow, cardsColumns])

  useEffect(() => {
    hideAddBtn(filteredMoviesCards)
  }, [moviesCards, filteredMoviesCards])

  useEffect(() => {
    getSavedMovies()
  }, [currentUser])

  useEffect(() => {
    renderSavedMovies()
  }, [likedMovies, savedMoviesData, savedShortMoviesChecked])

  useEffect(() => {
    setInitialMoviesErrors()
  }, [isLoggedIn])

  useEffect(() => {
    setInitialSavedMoviesErrors(likedMovies)
  }, [isLoggedIn, likedMovies])

  //LISTENERS
  window.addEventListener('resize', () => {
    setTimeout(resizeWindow, 1000)
  })

  function resizeWindow() {
    setWindowWidth(window.innerWidth)
  }

  // Отрисовка кол-ва карточек в зависимости от ширины окна
  function setCardsQuanity() {
    if (windowWidth >= resolutionBreakpoints.desktop) {
      setCardsColumns(cardsQuanity.desktop.column);
      setCardsInRow(cardsQuanity.desktop.row);
    }
    else if (windowWidth >= resolutionBreakpoints.tabletPlus) {
      setCardsColumns(cardsQuanity.tabletPlus.row)
      setCardsInRow(cardsQuanity.tabletPlus.column)
    }
    else if (windowWidth >= resolutionBreakpoints.tablet) {
      setCardsColumns(cardsQuanity.tablet.column);
      setCardsInRow(cardsQuanity.tablet.row);
    }
    else if (windowWidth >= resolutionBreakpoints.mobile) {
      setCardsColumns(cardsQuanity.mobile.row);
      setCardsInRow(cardsQuanity.mobile.column);
    }
  }

  // БЕРЕМ Все карточки с API
  async function getAllMoviesData(searchValue) {
    setIsDisabledInput(true)
    setCardsLoading(false)
    try {
      let data = await Api.getMoviesData();
      if (!data) {
        setMoviesError(searchFormErrors.searchInternalError)
      } else {
        let movies = data.map((movie) => {
          return movieObject(movie, `https://api.nomoreparties.co${movie.image.url}`)
        })
        let filteredMovies = filterMovies(searchValue, movies)
        setMoviesData(filteredMovies)
        saveDataToLocalStorage(filteredMovies, shortMoviesChecked)
        return filteredMovies
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsDisabledInput(false)
      setCardsLoading(true)
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
    localStorage.setItem(localStorageConstants.searchValue, searchValue)
    if (filteredMovies.length > 0 && searchValue.length > 0) {
      return filteredMovies
    } else {
      setMoviesCards([])
      return []
    }
  }

  function renderLocalOrFilteredCards() {
    let movies = JSON.parse(localStorage.getItem(localStorageConstants.movies))
    setInitialCheckboxValue()
    if (movies) {
      renderMovies(movies)
    } else {
      renderMovies(moviesData)
    }
  }

  function renderMovies(movies) {
    let shorts = filterShorts(movies)
    if (!shortMoviesChecked) {
      setFilteredMoviesCards(movies)
      setMoviesCards(movies.slice(0, cardsColumns * cardsInRow))
    } else {
      setMoviesCards(shorts);
      setFilteredMoviesCards(shorts)
    }
  }

  // клик по ещё
  function handleLoadMoreCards() {
    setCardsInRow(cardsInRow + 1)
  }

  function hideAddBtn(movies) {
    if (movies.length <= (moviesCards.length)) {
      setAllCardsLoaded(true)
    } else {
      setAllCardsLoaded(false)
    }
  }

  //обработчик кнопки фильтраa
  function handleFilterbutton() {
    setShortMoviesCheked(!shortMoviesChecked)
    localStorage.setItem(localStorageConstants.shortsCheckbox, !shortMoviesChecked)
  }

  //Обработчик searchForm хватаем JSON, рендерим карточки и прелоадер
  async function handleSearchForm(searchValue) {
    let movies = await getAllMoviesData(searchValue)
    renderMovies(movies)
    handleMoviesErrors(movies)
    setCardsQuanity() 
  }

  //Выставляем чекбокс при рендере
  function setInitialCheckboxValue() {
    const checkBox = localStorage.getItem(localStorageConstants.shortsCheckbox)
    if (checkBox === 'true') {
      setShortMoviesCheked(true)
    } else {
      setShortMoviesCheked(false)
    }
  }

  function setInitialSavedMoviesErrors(movies) {
    const error = getInitialError(movies)
    setSavedMoviesError({ long: error.long, shorts: error.shorts })
  }

  function handleSavedMoviesErrors(movies) {
    const error = getSearchError(movies)
    setSavedMoviesError({ long: error.long, shorts: error.shorts })
  }

  function setInitialMoviesErrors() {
    const localStorageMovies = JSON.parse(localStorage.getItem(localStorageConstants.movies))
    if (localStorageMovies) {
      const error = getInitialError(localStorageMovies)
      setMoviesError({ long: error.long, shorts: error.shorts })
    } else {
      return
    }
  }

  function handleMoviesErrors(movies) {
    const error = getSearchError(movies)
    setMoviesError({ long: error.long, shorts: error.shorts })
  }

  const moviesSearchError = shortMoviesChecked ? moviesError.shorts : moviesError.long
  const savedMoviesSearchEror = savedShortMoviesChecked ? savedMoviesError.shorts : savedMoviesError.long

  //Берем данные юзера
  async function getUserInfo() {
    try {
      let user = await getUser()
      setCurrentUser(user.data)
    }
    catch (e) {
      const error = await e
      console.log(error.message)
    }
  }

  // Обновляем данные юзера
  async function updateUserInfo(name, email) {
    setIsDisabledInput(true)
    try {
      let userInfo = await updateUser(name, email);
      setCurrentUser(userInfo.data)
      setPopupMessage(successeMessages.profile)
      setPopupIsOpened(true)
    } catch (e) {
      const error = await e
      setPopupIsOpened(true)
      setPopupMessage(error.message)
      console.log(error.message)
    } finally {
      setIsDisabledInput(false)
    }
  }

  async function addSavedMovie(movie) {
    try {
      let savedMovie = await saveMovie(movie)
      setSavedMoviesData([...savedMovies, savedMovie.data])
      setLikedMovies([...likedMovies, savedMovie.data])
    }
    catch (e) {
      const error = await e
      setPopupIsOpened(true)
      setPopupMessage(validationErrors.addMovieError)
      console.log(error.statusCode, error.message)
    }
  }

  async function deleteCard(movie, data) {
    data = savedMoviesData.filter((c) => {
      return movie.movieId === c.movieId
    })[0]._id
    try {
      if (savedMoviesData.some((c) => movie.movieId === c.movieId)) {
        await removeMovie(data)
        let newArray = await savedMoviesData.filter((c) => {
          return movie.movieId !== c.movieId
        })
        setSavedMoviesData(newArray)
        setLikedMovies(newArray)
      }
      else {
        return
      }
    } catch (e) {
      const error = await e
      console.log(error.message)
    }
  }

  //Обработчик лайка
  function handleLike(movie, data) {
    if (!savedMoviesData.some((c) => movie.movieId === c.movieId)) {
      addSavedMovie(movie)
    } else {
      data = savedMoviesData.filter((c) => {
        return movie.movieId === c.movieId
      })[0]._id
      deleteCard(movie, data)
    }
  }

  //Запрос на сохраненные карточки
  async function getSavedMovies() {
    setIsDisabledInput(true)
    try {
      let moviesData = await getSavedMoviesData(currentUser._id)
      setLikedMovies(moviesData)
      setSavedMoviesData(moviesData)
      return moviesData
    } catch (e) {
      const error = await e
      console.log(error.message)
    } finally {
      setIsDisabledInput(false)
    }
  }

  function renderSavedMovies() {
    let shorts = filterShorts(savedMoviesData)
    !savedShortMoviesChecked ? setSavedMovies(savedMoviesData) : setSavedMovies(shorts)
  }

  function handleFilterButtonSavedMovies() {
    setSavedShortMoviesChecked(!savedShortMoviesChecked)
  }

  //фильтр сохраненных фильмов
  function filterSavedMovies(searchValue, moviesData) {
    setIsDisabledInput(true)
    localStorage.setItem(localStorageConstants.savedSearchValue, searchValue)
    let filteredMovies = filterAllMovies(searchValue, moviesData)
    if (filteredMovies.length > 0) {
      setIsDisabledInput(false)
      return filteredMovies
    } else {
      setSavedMoviesData([])
      setIsDisabledInput(false)
      return []
    }
  }

  // Поиск сохраненных фильмов
  async function handleSavedMoviesSearch(searchValue) {
    let moviesData = await getSavedMovies()
    let filteredMovies = await filterSavedMovies(searchValue, moviesData)
    setSavedMoviesData(filteredMovies)
    handleSavedMoviesErrors(filteredMovies)
  }

  //Регистрация + автологин
  async function handleRegister(name, email, password) {
    setIsDisabledInput(true)
    try {
      let result = await register(name, email, password)
      setIsLoggedIn(true)
      await handleLogin(email, password)
      setCurrentUser(result.data)
    }
    catch (e) {
      const error = await e
      setIsLoggedIn(false)
      setPopupIsOpened(true)
      setPopupMessage(error.message)
    } finally {
      setIsDisabledInput(false)
    }
  }

  async function handleLogin(email, password) {
    setIsDisabledInput(true)
    try {
      let result = await login(email, password)
      setIsLoggedIn(true)
      localStorage.setItem(localStorageConstants.isLoggedIn, true)
      localStorage.setItem(localStorageConstants.jwt, result.token)
      history.push(PATHS.movies)
    }
    catch (e) {
      const error = await e
      setPopupIsOpened(true)
      setPopupMessage(error.message)
    } finally {
      setIsDisabledInput(false)
    }
  }

  async function tokenCheck() {
    try {
      const jwt = localStorage.getItem(localStorageConstants.jwt);
      let userContentResult = await getUserContent(jwt)
      setIsLoggedIn(true);
      localStorage.setItem(localStorageConstants.isLoggedIn, true)
      setCurrentUser(userContentResult.data)
    } catch (e) {
      const error = await e
      setIsLoggedIn(false);
      console.log(error.message)
    }
  }

  //Стереть данные юзера и локальное хранилище
  function clearUserData() {
    clearLocalStorageData()
    setMoviesCards([])
    setCurrentUser({})
    setSavedMovies([])
    setMoviesData([])
  }

  function closePopup() {
    setPopupIsOpened(false)
  }

  // LOGOUT
  function handleLogout() {
    setIsLoggedIn(false);
    clearUserData()
    history.push(PATHS.main)
  }

  return (
    // 1. PROMO 
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path={PATHS.main}>
          <Header
            headerClassName="header_promo"
            link="navbar__link_promo"
            isLoggedIn={isLoggedIn}
            btnClass={isLoggedIn ? 'header__btn_auth header__btn_promo' : ''}>
          </Header>
          <Main />
          <Footer />
        </Route>
        {/* MOVIES */}
        <ProtectedRoute path={PATHS.movies} isLoggedIn={isLoggedIn}>
          <Header
            btnClass="header__btn_auth"
            isLoggedIn={isLoggedIn}>
          </Header>
          <SearchForm
            isDisabled={isDisabledInput}
            isChecked={shortMoviesChecked}
            onFilterChange={handleFilterbutton}
            isRequesting={isDisabledInput}
            onSubmit={handleSearchForm}
            name='moviesValue'>
          </SearchForm>
          <MoviesCardList
            component={MoviesCardList}
            hiddenDeleteBtn='movie__delete-btn_hidden'
            isLoggedIn={isLoggedIn}
            error={moviesSearchError}
            onAddMore={handleLoadMoreCards}
            movies={moviesCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            handleLike={handleLike}
            handleDislike={deleteCard}
            savedMovies={likedMovies}
          >
          </MoviesCardList>
          <PopupMessage
            text={popupMessage}
            isOpened={popupIsOpened}
            onClose={closePopup} />
        </ProtectedRoute>
        {/* SAVED MOVIES */}
        <ProtectedRoute path={PATHS.savedMovies} isLoggedIn={isLoggedIn}>
          <Header
            btnClass="header__btn_auth"
            isLoggedIn={isLoggedIn}>
          </Header>
          <SearchForm
            isDisabled={isDisabledInput}
            component={SearchForm}
            isLoggedIn={isLoggedIn}
            onSubmit={handleSavedMoviesSearch}
            onFilterChange={handleFilterButtonSavedMovies}
            isChecked={savedShortMoviesChecked}
            isRequesting={isDisabledInput}
            name='savedMoviesValue'>
          </SearchForm>
          <SavedMovies
            isDisabled={isDisabledInput}
            hiddenAddBtn='movie__btn-container_hidden'
            isLoggedIn={isLoggedIn}
            error={savedMoviesSearchEror}
            onAddMore={handleLoadMoreCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            onDelete={deleteCard}
            movies={savedMovies}
            savedMovies={likedMovies}>
          </SavedMovies>
          <Footer />
        </ProtectedRoute>
        {/* 4. LOGIN  */}
        <Route path="/signin">
          {isLoggedIn ? <Redirect to={PATHS.movies} /> : <Redirect to={PATHS.signin} />}
          <Header
            headerClassName="header_auth"
            greetings="Рады видеть!"
            isLoggedIn={isLoggedIn}
            link="navbar__link_hidden"
            btn='navbar__btn_hidden' />
          <Login
            onSubmit={handleLogin}
            isDisabled={isDisabledInput} />
          <PopupMessage
            text={popupMessage}
            isOpened={popupIsOpened}
            onClose={closePopup} />
        </Route>
        {/* {/* 5.REGISTER */}
        <Route path="/signup">
          {isLoggedIn ? <Redirect to={PATHS.movies} /> : <Redirect to={PATHS.signup} />}
          <Header
            headerClassName="header_auth"
            greetings="Добро пожаловать!"
            isLoggedIn={isLoggedIn}
            link="navbar__link_hidden"
            btn='navbar__btn_hidden'
          />
          <Register
            isDisabled={isDisabledInput}
            onSubmit={handleRegister} />
          <PopupMessage
            text={popupMessage}
            isOpened={popupIsOpened}
            onClose={closePopup} />
        </Route>
        {/* 6.PROFILE  */}
        <ProtectedRoute path={PATHS.account} isLoggedIn={isLoggedIn}>
          <Header btnClass="header__btn_auth" isLoggedIn={isLoggedIn} />
          <Profile
            onSubmit={updateUserInfo}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isDisabled={isDisabledInput}
          >
          </Profile>
          <PopupMessage
            text={popupMessage}
            isOpened={popupIsOpened}
            onClose={closePopup} />
        </ProtectedRoute>
        <Route path='*'>
          <Error404 isLoggedIn={isLoggedIn} />
        </Route>
      </Switch>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);