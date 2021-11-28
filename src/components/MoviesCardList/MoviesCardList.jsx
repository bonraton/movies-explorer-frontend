import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard'

export default function MoviesCardList() {
  return (
    <section className="landing">
      <div className="movies">
        {/* Тестовые картинки, в последующем будем брать из из API */}
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
        <MoviesCard />
      </div>
      <button className="movies__more">Еще</button>
    </section>
  );
}
