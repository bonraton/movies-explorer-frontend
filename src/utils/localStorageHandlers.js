import { localStorageConstants } from '../constants/constant'

function clearLocalStorageData() {
    localStorage.removeItem(localStorageConstants.jwt)
    localStorage.removeItem(localStorageConstants.movies)
    localStorage.removeItem(localStorageConstants.shortsCheckbox)
    localStorage.removeItem(localStorageConstants.userName)
    localStorage.removeItem(localStorageConstants.email)
    localStorage.removeItem(localStorageConstants.searchValue)
    localStorage.removeItem(localStorageConstants.isLoggedIn)
}

function saveDataToLocalStorage(movies, shortMoviesChecked) {
    localStorage.setItem(localStorageConstants.movies, JSON.stringify(movies))
    localStorage.setItem(localStorageConstants.shortsCheckbox, shortMoviesChecked)
  }

export { clearLocalStorageData, saveDataToLocalStorage }