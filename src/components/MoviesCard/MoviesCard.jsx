import test from '../../images/test.png';
import './MoviesCard.css';

export default function MoviesCard() { 
  return (
    <div className="movie">
      <img className="movie__image" src={test} alt="test"></img>
      <h3 className="movie__title">Test text</h3>
      <p className="movie__duration">4:20</p>
    </div>
  );
}
