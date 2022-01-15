import "./MoviesCardList.css";
import MoviesCard from "../MoviesCard/MoviesCard";
import Preloader from '../Preloader/Preloader';
import { memo } from 'react'

function MoviesCardList({ movie, isAdded, savedMovies, ...props }) {

  function handleLike (movie) {
    props.onCardLike(movie)
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
      <div className="movies__container">
      <Preloader className={props.isLoading ? 'preloader_hidden' : ''} />
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
          link={movie.trailerLink}
          year={movie.year}
          description={movie.description}
          trailer={movie.trailerLink}
          onClick={handleLike}
          onDelete={handleDelete}
          _id={movie._id}
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

export default memo(MoviesCardList)
