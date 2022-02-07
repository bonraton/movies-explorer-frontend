const cardsQuanity = {
    desktop: {
        row: 4,
        column: 4
    },
    tabletPlus: {
        row: 3,
        column: 4,
    }, 
    tablet: {
        row: 4,
        column: 2,
    },
    mobile: {
        row: 1,
        column: 5,
    }
}

const localStorageConstants = {
    movies: 'movies',
    searchValue: 'searchValue',
    email: 'userEmail',
    jwt: 'jwt',
    isLoggedIn: 'isLoggedIn',
    userName: 'userName',
    shortsCheckbox: 'shortsCheckbox',
    savedSearchValue: 'savedSearchValue'
}

const shortMoviesDuration = 40

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

  const resolutionBreakpoints = {
    desktop: 1280,
    tabletPlus: 989,
    tablet: 768,
    mobile: 320
  }
  
export {cardsQuanity, localStorageConstants, shortMoviesDuration, resolutionBreakpoints, movieObject}