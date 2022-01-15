export function filterAllMovies(searchValue, movies, isChecked) {
    let filteredByNameRu = filterByNameRu(searchValue, movies)
    let filteredByNameEn = filterByNameEn(searchValue, movies)

    const regexpRu = /[а-яё]/gi
    if (searchValue.match(regexpRu)) {
        return filterShorts(filteredByNameRu, isChecked)
    } else {
        return filterShorts(filteredByNameEn, isChecked)
    }
}

function filterByNameRu(searchValue, movies) {
    let filteredArray = movies.filter((movie) => {
        return (movie.nameRU.toLowerCase()).includes(searchValue.toLowerCase())
    })
    return filteredArray
}

function filterByNameEn(searchValue, movies) {
    let filteredArray = movies.filter((movie) => {
        return movie.nameEN ? movie.nameEN.toLowerCase().includes(searchValue.toLowerCase()) : movie.nameEN
    })
    return filteredArray
}

export function filterShorts(movies, isChecked) {
    let filteredShorts = movies.filter((movie) => {
        return (movie.duration <= 40)
    })
    return isChecked ? filteredShorts : movies
}