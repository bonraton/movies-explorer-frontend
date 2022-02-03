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

  export {movieObject, resolutionBreakpoints}