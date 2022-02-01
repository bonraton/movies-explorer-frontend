import { Link } from 'react-router-dom';
import { memo } from 'react';

function MoviesCard({ movie, isAdded, ...props } ) {


  const activeBtnClass = (`movie__add-btn ${isAdded ? 'movie__add-btn_active' : ''}`)

  //SAVE
  function saveOrDeleteMovie () {
    props.onClick(props)
    // !isAdded ? props.handleLike(props) : props.handleDislike(props)
  }

  //DELETE
  function deleteMovie() {
    props.onDelete(props)
  }

  function duration (movie) {
    const movieHours = Math.floor(movie/60)
    const movieMinutes = movie % 60
    if (movieHours > 0) {
      return `${movieHours}ч` + `${movieMinutes}м`  
    } else {
      return `${movieMinutes}м`  
    } 
  }

  return (
    <div className="movie">
      <Link to={{ pathname: props.link }} target="_blank">
      <img className="movie__image" src={props.image} alt={props.name}></img>
      </Link>
      <div className="movie__info-container">
        <h3 className="movie__title">{props.nameRU}</h3>
        <div className={`movie__btn-container ${props.hiddenAddBtn}`}>
          <button onClick={saveOrDeleteMovie} className={activeBtnClass}></button>
        </div>
        <button onClick={deleteMovie} type="button" className={`movie__delete-btn ${props.hiddenDeleteBtn}`}></button>
      </div>
      <p className="movie__duration">{duration(props.duration)}</p>
    </div>
  );
}

export default memo(MoviesCard)