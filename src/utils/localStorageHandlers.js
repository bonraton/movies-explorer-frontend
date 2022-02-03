function clearLocalStorageData() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('movies')
    localStorage.removeItem('shortMovies')
    localStorage.removeItem('checkBox')
    localStorage.removeItem('moviesSearchValue')
    localStorage.removeItem('searchValue')
    localStorage.removeItem('shortsCheckbox')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('savedSearchValue')
}

function saveDataToLocalStorage(movies, shortMovies, shortMoviesChecked) {
    localStorage.setItem('movies', JSON.stringify(movies))
    localStorage.setItem('shortMovies', JSON.stringify(shortMovies))
    localStorage.setItem('shortsCheckbox', shortMoviesChecked)
  }

export { clearLocalStorageData, saveDataToLocalStorage }