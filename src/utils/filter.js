import { shortMoviesDuration } from '../constants/constant'

export function filterAllMovies(searchValue, movies, isChecked) {
    let filteredByNameRu = filterByNameRu(searchValue, movies)
    let filteredByNameEn = filterByNameEn(searchValue, movies)

    const regexpRu = /[а-яё]/gi
    if (searchValue.match(regexpRu)) {
        return filteredByNameRu
    } else {
        return filteredByNameEn
    }
}

function filterByNameRu(searchValue, movies) {
    let filteredArray = movies.filter((movie) => {
        return ( movie.nameRU.toLowerCase()).includes(searchValue.toLowerCase())
    })
    return filteredArray
}

function filterByNameEn(searchValue, movies) {
    let filteredArray = movies.filter((movie) => {
        return movie.nameEN ? movie.nameEN.toLowerCase().includes(searchValue.toLowerCase()) : movie.nameEN
    })
    return filteredArray
}

export function filterShorts(movies) {
    let filteredShorts = movies.filter((movie) => {
        return (movie.duration <= shortMoviesDuration)
    })
    return filteredShorts
}

export function filterSavedMovies(movies, userId) {
    let filteredMovies = movies.data.filter((movie) => {
        return movie.owner === userId
    })
    return filteredMovies
}