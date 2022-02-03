import MoviesCard from "./MoviesCard";
import Preloader from '../Preloader/Preloader';

function MoviesCardList({ movie, isAdded, savedMovies, ...props }) {

  // function handleLike (movie) {
  //   props.onCardLike(movie)
  // }

  function handleLike (movie) {
    if (isAdded) {
      props.handleDislike(movie)
    } else {
      props.handleLike(movie)
    }
  }

  function handleDelete (movie) {
    props.onDelete(movie)
  }
  
  function handleAddMore() {
    props.onAddMore()
  }
    
  return (    
    <section className="movies">
      <p className="movies__error">{props.error}</p>
      <Preloader className={props.isLoading ? 'preloader_hidden' : ''} />
      <div className="movies__container">
        {props.movies.map((movie) => {
         return (
          <MoviesCard
          key={movie.id ?? Math.random()}
          movieId={movie.movieId}
          nameRU={movie.nameRU}
          nameEN={movie.nameEN}
          country={movie.country}
          director={movie.director}
          thumbnail={movie.thumbnail}
          duration={movie.duration}
          trailer={movie.trailerLink}
          image={movie.image}
          link={movie.trailer}
          year={movie.year}
          description={movie.description}
          _id={movie._id}
          onClick={handleLike}
          onDelete={handleDelete}
          hiddenDeleteBtn={props.hiddenDeleteBtn}
          hiddenAddBtn={props.hiddenAddBtn}
          isAdded={savedMovies.some((c) => c.movieId === movie.movieId)}
          />)
        })}
      </div>
      <button onClick={handleAddMore} 
      className={props.isLoaded ? 'movies__more_hidden' : 'movies__more'}>
        Еще</button>
    </section>
  );
}

export default MoviesCardList
