import test from '../../images/test.png';
import './MoviesCard.css';

export default function MoviesCard(props) {
  return (
    <div className="movie">
      <img className="movie__image" src={test} alt="test"></img>
      <div className="movie__info-container">
        <h3 className="movie__title">Test text</h3>
        <div className={`toggle toggle_round ${props.hiddenToggle}`}>
          <label htmlFor={props.id}>
            <input
              id={props.id}
              type="checkbox"
              className="toggle__button toggle__button_round"
            ></input>
            <span className="toggle__slider toggle__slider_round"></span>
          </label>
        </div>
        <button type="button" className={`movie__delete-btn ${props.hiddenDeleteBtn}`}></button>
      </div>
      <p className="movie__duration">4:20</p>
    </div>
  );
}
