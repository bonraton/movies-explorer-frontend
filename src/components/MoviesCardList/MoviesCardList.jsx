import "./MoviesCardList.css";
import MoviesCard from "../MoviesCard/MoviesCard";
import Preloader from '../Preloader/Preloader';

export default function MoviesCardList() {
  return (
    <section className="movies">
      <div className="movies__container">
        {/* Тестовые картинки, в последующем будем брать из из API */}
        <MoviesCard hiddenToggle="toggle_hidden" />
        <MoviesCard hiddenDeleteBtn="movie__delete-btn_hidden" />
        <MoviesCard hiddenDeleteBtn="movie__delete-btn_hidden" />
        <MoviesCard hiddenToggle="toggle_hidden" />
      </div>
      <button className="movies__more">Еще</button>
      <Preloader />
    </section>
  );
}
