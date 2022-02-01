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
import { filterAllMovies, filterShorts } from '../../utils/filter';

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
  const [savedLikedMovies, setSavedLikedMovies] = useState([])

  const [allCardsLoaded, setAllCardsLoaded] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true)

  const [cardsInRow, setCardsInRow] = useState()
  const [cardsColumns, setCardsColumns] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const [moviesSearchFormRequesting, setMoviesSearchFormRequesting] = useState(Boolean)
  const [savedMoviesSearchFormRequesting, setSavedMoviesMoviesSearchFormRequesting] = useState(Boolean)
  const [profileInputDisable, setProfileInputDisable] = useState(Boolean)
  const [loginInputDisable, setLoginInputDisable] = useState(Boolean)
  const [registerInputDisable, setRegisterInputDisable] = useState(Boolean)

  const [searchError, setSearchError] = useState('');

  const [savedMoviesError, setSavedMoviesError] = useState({
    long: '', 
    shorts: ''
  })

  const [moviesError, setMoviesError] = useState({
    long: '',
    shorts: ''
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
    renderCards(filteredMoviesCards, shortMoviesCards)
    handleSearchErrors()
  }, [cardsColumns, filteredMoviesCards, shortMoviesCards, shortMoviesChecked])

  // useEffect(() => {
  //   handleSearchErrors()
  // }, [filteredSavedMoviesCards, shortMoviesCards])

  useEffect(() => {
    getSavedMovies()
  }, [currentUser])

  useEffect(() => {
    renderInitialSaved()
  }, [savedMoviesData, filteredSavedMoviesCards, savedMoviesData, savedMoviesShorts, savedMoviesCheckbox])

  useEffect(() => {
    renderFiltered()
    handleSavedMoviesErrors()
  }, [filteredSavedMoviesCards, savedMoviesData, savedMoviesCheckbox])


  useEffect(() => {
    tokenCheck()
    getUserInfo()
    getSavedMoviesData()
  }, [isLoggedIn])

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
      setMoviesSearchFormRequesting(true)
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
      setMoviesError({ moviesSearchError: '', shortsSearchError: '' })
    } else {
      setMoviesError({ moviesSearchError: '', shortsSearchError: '' })
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
    localStorage.setItem('searchValue', searchValue)
    if (filteredMovies.length > 0 && searchValue.length > 0) {
      setSearchError('')
      setCardsLoading(true)
      setMoviesSearchFormRequesting(false)
      return filteredMovies
    } else {
      setFilteredMoviesCards([])
      setCardsLoading(true)
      setMoviesSearchFormRequesting(false)
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
      setMoviesError({ long: 'Ничего не найдено', shortsSearchError: 'Ничего не найдено' })
    } else {
      setMoviesError({ long: '' });
    }
  }

  function handleSavedMoviesSearchError() {
    if (filteredSavedMoviesCards.length < 1 && !savedMoviesCheckbox) {
      setSavedMoviesError({ long: 'ничего не найдено'})
    } else {
      setSavedMoviesError({ long: ''})
    }
  }

  //Отрисовать ошибки короткометражек
  function handleShortsSearchError() {
    if (shortMoviesCards.length < 1 && shortMoviesChecked) {
      setMoviesError({ shorts: 'Ничего не найдено' })
    } else {
      handleMoviesSearchError()
    }
  }

  function handleSavedShortsError() {
    let shorts = filterShorts(filteredSavedMoviesCards)
    if (shorts.length < 1 && savedMoviesCheckbox) {
      setSavedMoviesError({ shorts: 'Ничего не найдено' })
    } else {
      handleSavedMoviesSearchError()
    }
  }

  // Обработчик ошибок поиска фильмов
  function handleSearchErrors() {
    handleMoviesSearchError()
    handleShortsSearchError()
  }

  function handleSavedMoviesErrors () {
    handleSavedMoviesSearchError()
    handleSavedShortsError()
  }

    
  const moviesSearchErrorMessage = shortMoviesChecked ? moviesError.shorts : moviesError.long
  const savedMoviesSearchErrorMessage = savedMoviesCheckbox ? savedMoviesError.shorts : savedMoviesError.long

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
      setProfileInputDisable(true)
      if (userInfo.data) {
        setCurrentUser(userInfo.data)
        setFormError('')
        setSuccesseMessage('Данные успешно изменены')
        setProfileInputDisable(false)
      } else {
        setFormError(userInfo.message)
        setProfileInputDisable(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Удалить фильм
  async function onDelete(movie) {
    let result = await removeMovie(movie._id);
    let newArray = savedMovies.filter((c) => {
      return movie._id !== c._id
    })
    await setFilteredSavedMoviesCards(newArray)
    setSavedMovies(newArray)
    return result
  }

  async function deleteCard(movie, data) {
    data = savedMoviesData.filter((c) => {
      return movie.movieId === c.movieId
    })[0]._id
    try {
      if (savedMoviesData.some((c) => movie.movieId === c.movieId)) {
        let moviez = await removeMovie(data)
        let newArray = await savedMoviesData.filter((c) => {
          return movie.movieId !== c.movieId
        })
        setSavedMoviesData(newArray)
        setFilteredSavedMoviesCards(newArray)
      } else {
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleLike (movie, data) {
    if (!savedMoviesData.some((c) => movie.movieId === c.movieId)) {
      addSavedMovie(movie)
    } else {
      data = savedMoviesData.filter((c) => {
        return movie.movieId === c.movieId
      })[0]._id
      deleteCard(movie, data)
    }
  }

  async function addSavedMovie(movie) {
    console.log('before', movie)
    let savedMovie = await saveMovie(movie)
    try {
      console.log('after', savedMovie)
      if (savedMovie.data) {
        setSavedMoviesData([...savedMoviesData, savedMovie.data])
        setFilteredSavedMoviesCards([...filteredSavedMoviesCards, savedMovie.data])
        renderFiltered()
      } else {
        console.log('Вы не можете добавить данный фильм', savedMovie.message)
      }
    } 
   catch (e) {
      console.error(e)
    }
  }

  //Сброс ошибок
  function resetsearchFormErrors() {
    setSearchError('')
    setFormError('')
    setSuccesseMessage('')
  }


  async function getSavedMovies() {
    let moviesData = await getSavedMoviesData(currentUser._id)
    if (!moviesData) {
      console.log('no data')
    } else {
      // карточки со всеми лайками
      setSavedMoviesData(moviesData)
      setFilteredSavedMoviesCards(moviesData)
      let shorts = filterShorts(moviesData)
      setSavedMoviesShorts(shorts)
      savedMoviesCheckbox ? setSavedMovies(shorts) : setSavedMovies(moviesData)
    }
  }

  function renderInitialSaved() {
    let shorts = filterShorts(savedMoviesData)
    if (savedMoviesCheckbox) {
      setSavedMovies(savedMoviesShorts)
    } else {
      setSavedMovies(savedMoviesData)
    }
  }

  function renderFiltered() {
    let shorts = filterShorts(filteredSavedMoviesCards)
    if (savedMoviesCheckbox) {
      setSavedMovies(savedMoviesShorts)
    } else {
      setSavedMovies(filteredSavedMoviesCards)
    }
  }

  function handleFilterButtonSavedMovies() {
    setSavedMoviesCheckbox(!savedMoviesCheckbox)
  }

  //фильтр сохраненных фильмов
  function filterSavedMovies(searchValue) {
    setSavedMoviesMoviesSearchFormRequesting(true)
    let filteredMovies = filterAllMovies(searchValue, savedMoviesData)
    let shorts = filterShorts(filteredMovies)
    if (filteredMovies.length < 1) {
      setSavedMoviesShorts([])
      setFilteredSavedMoviesCards([])
      setSavedMovies([])
      setSavedMoviesMoviesSearchFormRequesting(false)
    } else {
      setFilteredSavedMoviesCards(filteredMovies)
      setSavedMoviesShorts(shorts)
      setSavedMoviesMoviesSearchFormRequesting(false)
    }
  }

  // Поиск сохраненных фильмов
  async function handleSavedMoviesSearch(searchValue) {
    filterSavedMovies(searchValue)
  }

  //Регистрация + автологин
  async function handleRegister(name, email, password) {
    let result = await register(name, email, password)
    setRegisterInputDisable(true)
    try {
      if (result.data) {
        setRegisterInputDisable(false)
        setIsLoggedIn(true)
        setFormError('')
        await handleLogin(email, password)
        setCurrentUser(result.data)
      } else {
        setRegisterInputDisable(false)
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
    setLoginInputDisable(true)
    try {
      if (result.token) {
        localStorage.setItem('jwt', result.token)
        setFormError('')
        setIsLoggedIn(true)
        history.replace('./movies');
        setLoginInputDisable(false)
      } else {
        setFormError(result.message)
        setLoginInputDisable(false)
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
        setCurrentUser(userContentResult.data)
      } else {
        setIsLoggedIn(false);
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  function clearLocalStorageData() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('movies')
    localStorage.removeItem('shortMovies')
    localStorage.removeItem('checkBox')
    localStorage.removeItem('searchValue')
    localStorage.removeItem('shortsCheckox')
    setCurrentUser({})
    setSavedMovies([])
    setMoviesCards([])
  }

  // LOGOUT
  function handleLogout() {
    setIsLoggedIn(false);
    clearLocalStorageData()
    history.push('./')
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
        <ProtectedRoute path='/movies' isLoggedIn={isLoggedIn}>
          <Header
            btnClass="header__btn_auth"
            resetError={resetsearchFormErrors}
            isLoggedIn={isLoggedIn}>
          </Header>
          <SearchForm
            isChecked={shortMoviesChecked}
            onFilterChange={handleFilterbutton}
            isRequesting={moviesSearchFormRequesting}
            onSubmit={handleSearchForm}
            name='moviesValue'>
          </SearchForm>
          <MoviesCardList
            component={MoviesCardList}
            hiddenDeleteBtn='movie__delete-btn_hidden'
            isLoggedIn={isLoggedIn}
            error={moviesSearchErrorMessage}
            onAddMore={handleLoadMoreCards}
            movies={moviesCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            // onCardLike={likeClick}
            handleLike={handleLike}
            handleDislike={deleteCard}
            savedMovies={savedMoviesData}
          // onDelete={onDelete}
          >
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
            onSubmit={handleSavedMoviesSearch}
            onFilterChange={handleFilterButtonSavedMovies}
            isChecked={savedMoviesCheckbox}
            isRequesting={savedMoviesSearchFormRequesting}
            name='savedMoviesValue'>
          </SearchForm>
          <SavedMovies
            hiddenAddBtn='movie__btn-container_hidden'
            isLoggedIn={isLoggedIn}
            error={savedMoviesSearchErrorMessage}
            onAddMore={handleLoadMoreCards}
            isLoading={cardsLoading}
            isLoaded={allCardsLoaded}
            // onCardLike={likeClick}
            onDelete={deleteCard}
            movies={savedMovies}
            savedMovies={savedMoviesData}>
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
            resetError={resetsearchFormErrors} 
            isDisabled={loginInputDisable}/>
          
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
            isDisabled={registerInputDisable}
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
            onLogout={handleLogout}
            isDisabled={profileInputDisable}>
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
