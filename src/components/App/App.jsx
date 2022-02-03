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
import Login from '../Auth/Login';
import Error404 from '../Error404';
import Header from '../Header';
import Footer from '../Footer';
import SavedMovies from '../Movies/SavedMovies';
import ProtectedRoute from '../ProtectedRoute';

//CONTEXT
import CurrentUserContext from '../../contexts/currentUserContext';

//CONSTANTS
import { searchFormErrors, validationErrors, successeMessages } from '../../constants/messages';
import { movieObject, resolutionBreakpoints } from '../../constants/objects';
import { PATHS } from '../../constants/endpoints';

//UTILS
import { filterAllMovies, filterShorts } from '../../utils/filter';
import { clearLocalStorageData, saveDataToLocalStorage } from '../../utils/localStorageHandlers';

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
  const [shortMoviesCards, setShortMoviesCards] = useState([])
  const [shortMoviesChecked, setShortMoviesCheked] = useState(Boolean)

  const [allCardsLoaded, setAllCardsLoaded] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true)

  const [cardsInRow, setCardsInRow] = useState()
  const [cardsColumns, setCardsColumns] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  //SavedMovies states
  const [savedMovies, setSavedMovies] = useState([]);
  const [savedMoviesData, setSavedMoviesData] = useState([])
  const [savedShortMoviesChecked, setSavedShortMoviesChecked] = useState(false)

  const [likedMovies, setLikedMovies] = useState([])

  //Errors
  const [formError, setFormError] = useState('')
  const [savedMoviesError, setSavedMoviesError] = useState('')
  const [moviesError, setMoviesError] = useState('')
  const [successeMessage, setSuccesseMessage] = useState('')

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
    renderMovies(moviesData)
    hideAddBtn(filteredMoviesCards)
  }, [cardsColumns, cardsInRow, moviesData, shortMoviesChecked])

  
  useEffect(() => {
    handleMoviesErrors(moviesCards)
  }, [moviesCards])

  useEffect(() => {
    getSavedMovies()
  }, [currentUser])

  useEffect(() => {
    renderSavedMovies()
  }, [likedMovies, savedMoviesData, savedShortMoviesChecked])

  useEffect(() => {
    handleSavedMoviesErrors(savedMovies)
  }, [savedMovies])

  useEffect(() => {
    tokenCheck()
    getUserInfo()
    getSavedMoviesData()
  }, [isLoggedIn])

  useEffect(() => {
    renderMoviesFromLocalStorage()
  }, [isLoggedIn, shortMoviesChecked, cardsColumns, cardsInRow])

  
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
      setCardsColumns(4);
      setCardsInRow(4);
    }
    else if (windowWidth >= resolutionBreakpoints.tabletPlus) {
      setCardsColumns(4)
      setCardsInRow(3)
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


  // БЕРЕМ Все карточки с API
  async function getAllMoviesData(searchValue) {
    try {
      setCardsLoading(false)
      setIsDisabledInput(true)
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
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
    let shorts = filterShorts(filteredMovies) 
    localStorage.setItem('searchValue', searchValue)
    if (filteredMovies.length > 0 && searchValue.length > 0) {
      setCardsLoading(true)
      setIsDisabledInput(false)
      return filteredMovies
    } else {
      setMoviesCards([])
      setCardsLoading(true)
      setIsDisabledInput(false)
      return []
    }
  }

  //рендер карточек
    function renderMovies(movies) {
    let shorts = filterShorts(movies)
    console.log(shorts)
    if (!shortMoviesChecked) {
      setMoviesCards(movies.slice(0, cardsColumns * cardsInRow))
      setFilteredMoviesCards(savedMoviesData)
      hideAddBtn(movies)
    } else {
      setMoviesCards(shorts);
      setFilteredMoviesCards(filterShorts(savedMoviesData))
      hideAddBtn(shorts)
    }
  }

  // клик по ещё
  function handleLoadMoreCards() {
    setCardsColumns(cardsColumns + 1)
  }

  //прячем кнопку ещё
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
    localStorage.setItem('shortsCheckbox', !shortMoviesChecked)
  }

  //Обработчик searchForm хватаем JSON, рендерим карточки и прелоадер
  async function handleSearchForm(searchValue) {
    let movies = await getAllMoviesData(searchValue)
    renderMovies(movies)
  }

  //Выставляем чекбокс при рендере
  function setInitialCheckboxValue() {
    const checkBox = localStorage.getItem('shortsCheckbox')
    if (checkBox === 'true') {
      setShortMoviesCheked(true)
    } else {
      setShortMoviesCheked(false)
    }
  }

  //рендер карточек из локального хранилища
  function renderMoviesFromLocalStorage() {
    setMoviesError('')
    let filteredMovies = JSON.parse(localStorage.getItem('movies'))
    setInitialCheckboxValue()
    if (filteredMovies) {
      handleMoviesErrors(filteredMovies)
      renderMovies(filteredMovies)
    } else {
      return
    }
  }

  //Обработчики ошибок фильмов
  function handleMoviesErrors(movies) {
    if (movies.length < 1) {
      setMoviesError(searchFormErrors.notFoundError)
    } else {
      setMoviesError()
    }
  }

  function handleSavedMoviesErrors(movies) {
    if (movies.length < 1) {
      setSavedMoviesError(searchFormErrors.notFoundError)
    } else {
      setSavedMoviesError('')
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
      setIsDisabledInput(true)
      if (userInfo.data) {
        setCurrentUser(userInfo.data)
        setFormError('')
        setSuccesseMessage(successeMessages.profile)
        setIsDisabledInput(false)
      } else {
        setFormError(userInfo.message)
        setIsDisabledInput(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function addSavedMovie(movie) {
    let savedMovie = await saveMovie(movie)
    try {
      if (savedMovie.data) {
        setSavedMoviesData([...savedMovies, savedMovie.data])
        setLikedMovies([...likedMovies, savedMovie.data])
      }
      else {
        console.log(validationErrors.addMovieError, savedMovie.message)
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  //Удалить фильм
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
      } else {
        return
      }
    } catch (e) {
      console.log(e)
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
    let moviesData = await getSavedMoviesData(currentUser._id)
    if (!moviesData) {
      console.log(searchFormErrors.notFoundError)
    } else {
      let savedMovies = moviesData.map((movie) => {
        return movieObject(movie, movie.image)
      })
      setLikedMovies(savedMovies)
      setSavedMoviesData(savedMovies)
      return savedMovies
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
    let filteredMovies = filterAllMovies(searchValue, moviesData)
    localStorage.setItem('savedSearchValue', searchValue)
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
  }

  //Регистрация + автологин
  async function handleRegister(name, email, password) {
    let result = await register(name, email, password)
    isDisabledInput(true)
    try {
      if (result.data) {
        isDisabledInput(false)
        setIsLoggedIn(true)
        setFormError('')
        await handleLogin(email, password)
        setCurrentUser(result.data)
      } else {
        isDisabledInput(false)
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
    setIsDisabledInput(true)
    try {
      if (result.token) {
        setIsLoggedIn(true)
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('jwt', result.token)
        setFormError('')
        setIsDisabledInput(false)
        history.push(PATHS.movies)
      } else {
        setFormError(result.message)
        setIsDisabledInput(false)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  //Проверяем токен при загрузке страницы
  async function tokenCheck() {
    try {
      const jwt = localStorage.getItem('jwt');
      let userContentResult = await getUserContent(jwt)
      if (userContentResult) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true)
        setCurrentUser(userContentResult.data)
      } else {
        setIsLoggedIn(false);
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Стереть данные юзера и локальное хранилище
  function clearUserData() {
    clearLocalStorageData()
    setMoviesCards([])
    setCurrentUser({})
    setSavedMovies([])

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
            error={moviesError}
            onAddMore={handleLoadMoreCards}
            movies={moviesCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            handleLike={handleLike}
            handleDislike={deleteCard}
            savedMovies={likedMovies}
          >
          </MoviesCardList>
        </ProtectedRoute>
        {/* SAVED MOVIES */}
        <ProtectedRoute path={PATHS.savedMovies} isLoggedIn={isLoggedIn}>
          <Header
            btnClass="header__btn_auth"
            isLoggedIn={isLoggedIn}>
          </Header>
          <SearchForm
            component={SearchForm}
            // isLoggedIn={isLoggedIn}
            onSubmit={handleSavedMoviesSearch}
            onFilterChange={handleFilterButtonSavedMovies}
            isChecked={savedShortMoviesChecked}
            isRequesting={isDisabledInput}
            name='savedMoviesValue'>
          </SearchForm>
          <SavedMovies
            hiddenAddBtn='movie__btn-container_hidden'
            // isLoggedIn={isLoggedIn}
            error={savedMoviesError}
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
            formError={formError}
            isDisabled={isDisabledInput} />
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
            formError={formError}
            onSubmit={handleRegister} />
        </Route>
        {/* 6.PROFILE  */}
        <ProtectedRoute path={PATHS.account} isLoggedIn={isLoggedIn}>
          <Header btnClass="header__btn_auth" isLoggedIn={isLoggedIn} />
          <Profile
            successe={successeMessage}
            formError={formError}
            onSubmit={updateUserInfo}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isDisabled={isDisabledInput}>
          </Profile>
        </ProtectedRoute>
        <Route path='*'>
          <Error404 isLoggedIn={isLoggedIn} />
        </Route>
      </Switch>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);