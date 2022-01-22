//GLOBAL IMPORTS
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import { searchFormErrors } from '../../constants/errors';

//UTILS
import { filterAllMovies, filterShorts, filterSavedMovies } from '../../utils/filter';

//API
import MoviesApi from '../../utils/MoviesApi';
import { getUser, updateUser, saveMovie, removeMovie, getSavedMoviesData } from '../../utils/MainApi';

//Main APi
import { register, login, getUserContent } from '../../utils/Auth';


function App() {


  //STATES
  // 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [moviesData, setMoviesData] = useState([]);
  const [moviesCards, setMoviesCards] = useState([])
  const [filteredMoviesCards, setFilteredMoviesCards] = useState([])
  const [shortMoviesCards, setShortMoviesCards] = useState([])

  const [savedMovies, setSavedMovies] = useState([]);
  const [filteredSavedMoviesCards, setFilteredSavedMoviesCards] = useState([])
  const [savedMoviesShorts, setSavedMoviesShorts] = useState([])

  const [shortMoviesChecked, setShortMoviesCheked] = useState(Boolean)
  const [savedMoviesCheckbox, setSavedMoviesCheckbox] = useState(false)
  const [savedMoviesData, setSavedMoviesData] = useState([])

  const [allCardsLoaded, setAllCardsLoaded] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true)

  const [cardsInRow, setCardsInRow] = useState()
  const [cardsColumns, setCardsColumns] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const [searchError, setSearchError] = useState('');
  const [error, setError] = useState({
    moviesSearchError: '',
    shortsSearchError: ''
  })

  const [successeMessage, setSuccesseMessage] = useState('')

  const [formError, setFormError] = useState('')
  const [currentUser, setCurrentUser] = useState({});

  const Api = new MoviesApi();
  const history = useHistory();

  //EFFECTS

  useEffect(() => {
    setCardsQuanity();
  }, [windowWidth])


  useEffect(() => {
    tokenCheck()
    getSavedMovies()
    getUserInfo()
  }, [])

  useEffect(() => {
    renderSavedCards(filteredSavedMoviesCards, savedMoviesShorts, savedMoviesCheckbox)
  }, [filteredSavedMoviesCards, savedMoviesShorts, savedMoviesCheckbox])

  useEffect(() => {
    renderCards(filteredMoviesCards, shortMoviesCards)
    handleSearchErrors()
  }, [cardsColumns, filteredMoviesCards, shortMoviesCards, shortMoviesChecked])

  useEffect(() => {
    renderMoviesFromLocalStorage()
  }, [])

  //LISTENERS
  window.addEventListener('resize', () => {
    setTimeout(resizeWindow, 2000)
  })

  // CONSTANTS
  const resolutionBreakpoints = {
    desktop: 1280,
    tabletPlus: 896,
    tablet: 768,
    mobile: 320
  }

  // 
  function resizeWindow() {
    setWindowWidth(window.innerWidth)
  }

  // О трисовка кол-ва карточек в зависимости от ширины окна
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
        setSearchError(searchFormErrors.searchInternalError)
      } else {
        let movies = data.map((movie) => {
          return movieObject(movie, `https://api.nomoreparties.co${movie.image.url}`)
        })
        let filteredMovies = filterMovies(searchValue, movies)
        setFilteredMoviesCards(filteredMovies)
        let shorts = filterShorts(filteredMovies, shortMoviesChecked)
        setShortMoviesCards(shorts)
        saveDataToLocalStorage(filteredMovies, shorts, shortMoviesChecked)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // сохраняем карточки, чекбокс в локальное хранилище
  function saveDataToLocalStorage(movies, shortMovies, shortMoviesChecked) {
    localStorage.setItem('movies', JSON.stringify(movies))
    localStorage.setItem('shortMovies', JSON.stringify(shortMovies))
    localStorage.setItem('shortsCheckox', shortMoviesChecked)
  }

  function renderCards(movies, shorts) {
    if (!shortMoviesChecked) {
      setMoviesCards(movies.slice(0, cardsColumns * cardsInRow))
      hideAddBtn(movies)
    } else {
      setMoviesCards(shorts);
      hideAddBtn(shorts)
    }
  }

  //рендер карточек из локального хранилища
  function renderMoviesFromLocalStorage() {
    let filteredMovies = JSON.parse(localStorage.getItem('movies'))
    let shortMovies = JSON.parse(localStorage.getItem('shortMovies'))
    setInitialCheckboxValue()
    if (filteredMovies) {
      setFilteredMoviesCards(filteredMovies)
      setShortMoviesCards(shortMovies)
      renderCards(filteredMovies, shortMovies)
      setError({ moviesSearchError: '', shortsSearchError: '' })
    } else {
      setError({ moviesSearchError: '', shortsSearchError: '' })
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
    localStorage.setItem('searchValue', searchValue)
    if (filteredMovies.length > 0 && searchValue.length > 0) {
      setSearchError('')
      setCardsLoading(true)
      return filteredMovies
    } else {
      setFilteredMoviesCards([])
      setCardsLoading(true)
      return []
    }
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

  //прячем кнопку ещё
  function hideAddBtn(movies) {
    if (movies.length <= movies.slice(0, cardsColumns * cardsInRow).length) {
      setAllCardsLoaded(true)
    } else {
      setAllCardsLoaded(false)
    }
  }

  //Обработчик searchForm хватаем JSON, рендерим карточки и прелоадер
  async function handleSearchForm(searchValue) {
    await getAllMoviesData(searchValue)
    renderCards(filteredMoviesCards, shortMoviesCards)
  }

  // клик по ещё
  function handleLoadMoreCards() {
    setCardsColumns(cardsColumns + 1)
  }

  //обработчик кнопки фильтраa
  function handleFilterbutton() {
    setShortMoviesCheked(!shortMoviesChecked)
    localStorage.setItem('shortsCheckbox', !shortMoviesChecked)
  }

  // Отрисовать ошибки фильмов
  function handleMoviesSearchError() {
    if (filteredMoviesCards.length < 1 && !shortMoviesChecked) {
      setError({ moviesSearchError: 'Ничего не найдено', shortsSearchError: 'Ничего не найдено' })
    } else {
      setError({ moviesSearchError: '' });
    }
  }

  //Отрисовать ошибки короткометражек
  function handleShortsSearchError() {
    if (shortMoviesCards.length < 1 && shortMoviesChecked) {
      setError({ shortsSearchError: 'Ничего не найдено' })
    } else {
      handleMoviesSearchError()
    }
  }

  // Обработчик ошибок поиска фильмов
  function handleSearchErrors() {
    handleMoviesSearchError()
    handleShortsSearchError()
  }

  const searchErrorMessage = shortMoviesChecked ? error.shortsSearchError : error.moviesSearchError

  // Берем сохраненные фильмы
  async function getSavedMovies() {
    try {
      const savedMovies = await getSavedMoviesData()
      const savedByOwner = filterSavedMovies(savedMovies, currentUser._id)
      if (!savedByOwner) {
        console.log('no data')
      } else {
        let movies = savedByOwner.map((movie) => {
          return movieObject(movie, movie.image)
        })
        let shorts = filterShorts(movies)
        setSavedMoviesData(movies)
        setSavedMovies(movies)
        setFilteredSavedMoviesCards(movies)
        setSavedMoviesShorts(shorts)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // Фильтр сохраненных
  function filterSaved(searchValue, movies) {
    let filtered = filterAllMovies(searchValue, movies)
    let shorts = filterShorts(filtered)
    console.log(filtered, shorts)
    setFilteredSavedMoviesCards(filtered)
    setSavedMoviesShorts(shorts)
  }

  //Кнопка фильтра для сохраненных
  function handleFilterButtonSavedMovies() {
    setSavedMoviesCheckbox(!savedMoviesCheckbox)
  }

  // обработчик поиска сохраненных карточек
  async function handleSearchFormSavedMovies(searchValue) {
    await getSavedMovies(searchValue)
    filterSaved(searchValue, savedMoviesData)
    renderSavedCards(filteredSavedMoviesCards, savedMoviesShorts, savedMoviesCheckbox)
  }

  // Отрисовка сохраненных карточек
  function renderSavedCards(movies, shorts, isChecked) {
    if (isChecked) {
      setSavedMovies(shorts)
    } else {
      setSavedMovies(movies)
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
        setSuccesseMessage('Данные успешно изменены')
      } else {
        setFormError(userInfo.message)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // обработчик лайка
  function likeClick(movie, data) {
    console.log(movie)
    if (!savedMovies.some((c) => c.movieId === movie.movieId)) {
      addSavedMovie(movie)
    } else {
      data = savedMovies.filter((c) => {
        return movie.movieId === c.movieId
      })[0]._id
      deleteCard(movie, data)
    }
  }

  //Сброс ошибк
  function resetsearchFormErrors() {
    setSearchError('')
    setFormError('')
    setSuccesseMessage('')
  }

  //Добавить фильм
  async function addSavedMovie(movie) {
    try {
      let savedMovie = await saveMovie(movie)
      await setSavedMovies([...savedMovies, savedMovie.data])
    } catch (e) {
      console.log(e)
    }
  }

  //Удалить фильм
  async function deleteCard(movie, data) {
    await removeMovie(data)
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
        setCurrentUser(result.data)
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
        setFormError('')
        setIsLoggedIn(true)
        history.replace('./movies');
      } else {
        setFormError(result.message)
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
        setCurrentUser(userContentResult.data)
        setIsLoggedIn(true);
        history.replace('/movies')
      } else {
        return
      }
    } catch (e) {
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
    localStorage.removeItem('shortMovies')
    localStorage.removeItem('checkBox')
    localStorage.removeItem('searchValue')
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
      {/* <div className="page"> */}
      <Switch>
        <Route exact path="/">
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
        <ProtectedRoute path='/movies'isLoggedIn={isLoggedIn}>
        <Header
            btnClass="header__btn_auth"
            resetError={resetsearchFormErrors}
            isLoggedIn={isLoggedIn}>
          </Header>
          <SearchForm
            isChecked={shortMoviesChecked}
            onFilterChange={handleFilterbutton}
            // isLoggedIn={isLoggedIn}
            onSubmit={handleSearchForm}
            name='moviesValue'>
          </SearchForm>
          <MoviesCardList
          component={MoviesCardList}
            hiddenDeleteBtn='movie__delete-btn_hidden'
            isLoggedIn={isLoggedIn}
            error={searchErrorMessage}
            onAddMore={handleLoadMoreCards}
            movies={moviesCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            onCardLike={likeClick}
            savedMovies={savedMovies}
            onDelete={onDelete}>
          </MoviesCardList>
        </ProtectedRoute>
        {/* SAVED MOVIES */}
        <ProtectedRoute path="/saved-movies" isLoggedIn={isLoggedIn}>
        <Header
            btnClass="header__btn_auth"
            isLoggedIn={isLoggedIn}
            resetError={resetsearchFormErrors}>
          </Header>
          <SearchForm
            component={SearchForm}
            isLoggedIn={isLoggedIn}
            onSubmit={handleSearchFormSavedMovies}
            onFilterChange={handleFilterButtonSavedMovies}
            isChecked={savedMoviesCheckbox}
            name='savedMoviesValue'>
          </SearchForm>
          <SavedMovies
          hiddenAddBtn='movie__btn-container_hidden'
          isLoggedIn={isLoggedIn}
          error={searchError}
          onAddMore={handleLoadMoreCards}
          isLoading={cardsLoading}
          isLoaded={allCardsLoaded}
          onCardLike={likeClick}
          savedMovies={savedMovies}
          onDelete={onDelete}
          movies={savedMovies}>
          </SavedMovies>
          <Footer />
        </ProtectedRoute>
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
            resetError={resetsearchFormErrors} />
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
            resetError={resetsearchFormErrors} />
        </Route>
        {/* 6.PROFILE  */}
        <ProtectedRoute path="/profile" isLoggedIn={isLoggedIn}>
          <Header btnClass="header__btn_auth" isLoggedIn={isLoggedIn} />
          <Profile
          successe={successeMessage}
          formError={formError}
          onSubmit={updateUserInfo}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}>
          </Profile> 
        </ProtectedRoute>
        <Route path='*'>
          <Error404 />
        </Route>
      </Switch>
      {/* </div> */}
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
