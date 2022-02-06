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
import { searchFormErrors, validationErrors, successeMessages } from '../../constants/messages';
import { movieObject, resolutionBreakpoints } from '../../constants/objects';
import { PATHS } from '../../constants/endpoints';

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
  const [savedMoviesError, setSavedMoviesError] = useState({ long: '', shorts: '' })
  const [moviesError, setMoviesError] = useState({ long: '', shorts: '' })
  const [successeMessage, setSuccesseMessage] = useState('')

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
    setIsDisabledInput(true)
    try {
      setCardsLoading(false)
      let data = await Api.getMoviesData();
      if (!data) {
        setMoviesError(searchFormErrors.searchInternalError)
        setIsDisabledInput(false)
      } else {
        let movies = data.map((movie) => {
          return movieObject(movie, `https://api.nomoreparties.co${movie.image.url}`)
        })
        let filteredMovies = filterMovies(searchValue, movies)
        setMoviesData(filteredMovies)
        saveDataToLocalStorage(filteredMovies, shortMoviesChecked)
        setIsDisabledInput(false)
        return filteredMovies
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Отфильтровать карточки
  function filterMovies(searchValue, movies) {
    let filteredMovies = filterAllMovies(searchValue, movies, shortMoviesChecked)
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

  function renderLocalOrFilteredCards() {
    let movies = JSON.parse(localStorage.getItem('movies'))
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
      setMoviesCards(movies.slice(0, cardsColumns * cardsInRow))
      setFilteredMoviesCards(movies)
    } else {
      setMoviesCards(shorts);
      setFilteredMoviesCards(shorts)
    }
  }

  // клик по ещё
  function handleLoadMoreCards() {
    setCardsColumns(cardsColumns + 1)
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
    localStorage.setItem('shortsCheckbox', !shortMoviesChecked)
  }

  //Обработчик searchForm хватаем JSON, рендерим карточки и прелоадер
  async function handleSearchForm(searchValue) {
    let movies = await getAllMoviesData(searchValue)
    renderMovies(movies)
    handleMoviesErrors(movies)
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

  
  function setInitialSavedMoviesErrors (movies) {
    const error  = getInitialError(movies)
    setSavedMoviesError({ long: error.long, shorts: error.shorts })
  }

  function handleSavedMoviesErrors(movies) {
    const error = getSearchError(movies)
    setSavedMoviesError({ long: error.long, shorts: error.shorts })
  }

  function setInitialMoviesErrors () {
    const localStorageMovies = JSON.parse(localStorage.getItem('movies'))
    if (localStorageMovies) {
      const error = getInitialError(localStorageMovies)
      setMoviesError({ long: error.long, shorts: error.shorts })
    } else {
      return 
    }
  }

  function handleMoviesErrors (movies) {
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
      console.log(error)
      console.error(error.message)
    }
  }

    // Обновляем данные юзера
    async function updateUserInfo(name, email) {
      setIsDisabledInput(true)
      try {
        let userInfo = await updateUser(name, email);
          setCurrentUser(userInfo.data)
          setFormError('')
          setPopupMessage(successeMessages.profile)
          setPopupIsOpened(true)
          // setSuccesseMessage(successeMessages.profile)
          setIsDisabledInput(false)
      } catch (e) {
        const error = await e
          setPopupIsOpened(false)
          setPopupMessage(error.message)
          setIsDisabledInput(false)
          console.log(error.message)
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
      setPopupMessage('На сервере произошла ошибка, вы не можете сохранить данный фильм')
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
      setIsDisabledInput(false)
      return moviesData
    } catch (e) {
      const error = await e
      console.log(error.message)
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
    handleSavedMoviesErrors(filteredMovies)
  }

    //Регистрация + автологин
    async function handleRegister(name, email, password) {
      setIsDisabledInput(true)
      try {
        let result = await register(name, email, password)
          setIsLoggedIn(true)
          setIsDisabledInput(false)
          // setFormError('')
          await handleLogin(email, password)
          setCurrentUser(result.data)
      }
      catch (e) {
        const error = await e
        setIsDisabledInput(false)
        setIsLoggedIn(false)
        setPopupIsOpened(true)
        setPopupMessage(error.message)
      }
    }

  async function handleLogin(email, password) {
    setIsDisabledInput(true)
    try {
      let result = await login(email, password)
        setIsLoggedIn(true)
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('jwt', result.token)
        // setPopupIsOpened(true)
        // setFormError('')
        setIsDisabledInput(false)
        history.push('/movies')
    }
    catch (e) {
      const error = await e
      setPopupIsOpened(true)
        setPopupMessage(error.message)
        // setFormError(result.message)
        setIsDisabledInput(false)
    }
  }

  async function tokenCheck() {
    try {
      const jwt = localStorage.getItem('jwt');
      let userContentResult = await getUserContent(jwt)
      // if (userContentResult) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true)
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
    setSuccesseMessage('')
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
          onClose={closePopup}/>
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
            formError={formError}
            isDisabled={isDisabledInput} />
          <PopupMessage 
          text={popupMessage} 
          isOpened={popupIsOpened}
          onClose={closePopup}/>
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
            <PopupMessage 
          text={popupMessage} 
          isOpened={popupIsOpened}
          onClose={closePopup}/>
        </Route>
        {/* 6.PROFILE  */}
        <ProtectedRoute path={PATHS.account}>
          <Header btnClass="header__btn_auth" isLoggedIn={isLoggedIn} />
          <Profile
            successe={successeMessage}
            formError={formError}
            onSubmit={updateUserInfo}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isDisabled={isDisabledInput}
            >
          </Profile>
          <PopupMessage 
          text={popupMessage} 
          isOpened={popupIsOpened}
          onClose={closePopup}/>
        </ProtectedRoute>
        <Route path='*'>
          <Error404 isLoggedIn={isLoggedIn} />
        </Route>
      </Switch>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);