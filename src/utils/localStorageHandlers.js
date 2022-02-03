function clearLocalStorageData() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('movies')
    localStorage.removeItem('checkBox')
    localStorage.removeItem('moviesSearchValue')
    localStorage.removeItem('searchValue')
    localStorage.removeItem('shortsCheckbox')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('savedSearchValue')
}

function saveDataToLocalStorage(movies, shortMoviesChecked) {
    localStorage.setItem('movies', JSON.stringify(movies))
    localStorage.setItem('shortsCheckbox', shortMoviesChecked)
  }

export { clearLocalStorageData, saveDataToLocalStorage }